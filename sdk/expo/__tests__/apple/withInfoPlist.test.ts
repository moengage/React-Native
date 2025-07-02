import { withMoEngageInfoPlist } from '../../src/apple/withInfoPlist';
import * as fs from 'fs';
import * as path from 'path';

// Mock the file system module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn()
}));

describe('Info.plist configuration', () => {
  let mockConfig: any;
  const OLD_ENV = process.env;

  const mockProps = {
    android: {
      configFilePath: 'assets/moengage/android_initialization_config.xml'
    },
    apple: {
      configFilePath: 'assets/moengage/MoEngage-Config.plist',
      pushNotificationImpressionTrackingEnabled: true,
      richPushNotificationEnabled: false,
      pushTemplatesEnabled: false,
      deviceTriggerEnabled: false
    }
  };

  const plistContent = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n<key>WorkspaceId</key>\n<string>mocked_app_id</string>\n<key>AppGroupName</key>\n<string>mocked_app_group</string>\n<key>DataCenter</key>\n<integer>1</integer>\n</dict>\n</plist>';

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    mockConfig = {
      name: 'TestApp',
      slug: 'test-app',
      modRequest: {
        projectRoot: '/test/project'
      }
    };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  test('should throw error when MoEngage configuration is missing', () => {
    // Precondition (Arrange)
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    // Act & Assert
    expect(() => {
      withMoEngageInfoPlist(mockConfig, mockProps);
    }).toThrow('MoEngage configuration does not exist');

    expect(fs.existsSync).toHaveBeenCalledWith('/test/project/assets/moengage/MoEngage-Config.plist');
  });

  test('should merge MoEngage configuration from plist file when it exists', () => {
    // Precondition (Arrange)
    const modResultsMock = {
      MoEngage: {
        ExistingKey: 'ExistingValue'
      }
    };

    mockConfig.infoPlistResults = modResultsMock;
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(plistContent);

    // Act
    const result: any = withMoEngageInfoPlist(mockConfig, mockProps);

    // Assert
    expect(result.infoPlistResults.MoEngage).toEqual({
      'ExistingKey': 'ExistingValue',
      'WorkspaceId': 'mocked_app_id',
      'AppGroupName': 'mocked_app_group',
      'DataCenter': 1
    });
    expect(fs.readFileSync).toHaveBeenCalledWith('/test/project/assets/moengage/MoEngage-Config.plist', 'utf8');
  });

  test('should enable Live Activities support if configured', () => {
    // Precondition (Arrange)
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);

    const propsWithLiveActivity = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        liveActivityTargetPath: 'path/to/liveactivity'
      }
    };

    // Act
    const result: any = withMoEngageInfoPlist(mockConfig, propsWithLiveActivity);

    // Assert
    expect(result.infoPlistResults).toHaveProperty('NSSupportsLiveActivities');
    expect(result.infoPlistResults.NSSupportsLiveActivities).toBe(true);
  });

  test('should skip specific iOS configurations for tvOS platforms', () => {
    // Precondition (Arrange)
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    process.env = { ...OLD_ENV, EXPO_TV: 'true' };

    const propsWithLiveActivity = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        liveActivityTargetPath: 'path/to/liveactivity'
      }
    };

    // Act
    const result: any = withMoEngageInfoPlist(mockConfig, propsWithLiveActivity);

    // Assert
    expect(result.infoPlistResults).not.toHaveProperty('NSSupportsLiveActivities');
  });

  test('should throw error when reading plist file fails', () => {
    // Precondition (Arrange)
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('File read error');
    });

    // Act & Assert
    expect(() => {
      withMoEngageInfoPlist(mockConfig, mockProps);
    }).toThrow('Could not import MoEngage configuration: Error: File read error');

    // Verify file read was attempted
    expect(fs.readFileSync).toHaveBeenCalled();
  });

  test('should throw error when initializing MoEngage in Info.plist with missing config file', () => {
    // Precondition (Arrange)
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    // Act & Assert
    expect(() => {
      withMoEngageInfoPlist(mockConfig, mockProps);
    }).toThrow('MoEngage configuration does not exist');
    expect(fs.existsSync).toHaveBeenCalledWith(path.join('/test/project', 'assets/moengage/MoEngage-Config.plist'));
  });

  test('should import config from plist file if it exists', () => {
    // Precondition (Arrange)
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(plistContent);

    // Act
    const result: any = withMoEngageInfoPlist(mockConfig, mockProps);

    // Assert
    expect(fs.existsSync).toHaveBeenCalledWith(path.join('/test/project', 'assets/moengage/MoEngage-Config.plist'));
    expect(fs.readFileSync).toHaveBeenCalledWith(path.join('/test/project', 'assets/moengage/MoEngage-Config.plist'), 'utf8');
    expect(result.infoPlistResults.MoEngage).toEqual({
      WorkspaceId: 'mocked_app_id',
      AppGroupName: 'mocked_app_group',
      DataCenter: 1
    });
  });
});
