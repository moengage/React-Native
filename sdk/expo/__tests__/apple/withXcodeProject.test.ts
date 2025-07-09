import { withMoEngageXcodeProject } from '../../src/apple/withXcodeProject';
import { MoEngagePluginProps } from '../../src/types';
import * as fs from 'fs';
import * as constants from '../../src/apple/constants';

// Mock the file system module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
  copyFileSync: jest.fn(),
  readdirSync: jest.fn()
}));

describe('withMoEngageXcodeProject', () => {
  // Create a mock XcodeProject
  const createMockXcodeProject = () => {
    const mockGroups = {key: {}};
    const mockBuildConfigurations = {
      'config1': {
        buildSettings: {
          SWIFT_VERSION: '5.0',
          CODE_SIGN_STYLE: 'Automatic',
          CODE_SIGN_IDENTITY: 'Apple Developer',
          OTHER_CODE_SIGN_FLAGS: '-f flags',
          PROVISIONING_PROFILE_SPECIFIER: 'Apple Developer',
          DEVELOPMENT_TEAM: 'ABC123'
        }
      },
      'config2': {
        buildSettings: {
          SWIFT_VERSION: '5.0',
          CODE_SIGN_STYLE: 'Manual',
          CODE_SIGN_IDENTITY: 'Apple Developer',
          OTHER_CODE_SIGN_FLAGS: '-f flags',
          PROVISIONING_PROFILE_SPECIFIER: 'Apple Developer',
          DEVELOPMENT_TEAM: 'ABC123'
        }
      }
    };

    return {
      hash: {
        project: {
          objects: {
            PBXGroup: mockGroups,
            PBXTargetDependency: {},
            PBXContainerItemProxy: {},
            XCBuildConfiguration: mockBuildConfigurations
          }
        }
      }
    } as any;
  };

  let mockConfig = {
    name: 'TestApp',
    slug: 'test-app',
    ios: {
      bundleIdentifier: 'com.test.app'
    },
    modRequest: {
      projectRoot: '/test/project'
    },
    xcodeResults: createMockXcodeProject()
  };

  const mockProps: MoEngagePluginProps = {
    android: {
      configFilePath: 'assets/moengage/android_initialization_config.xml'
    },
    apple: {
      configFilePath: 'assets/moengage/MoEngage-Config.plist',
      pushNotificationImpressionTrackingEnabled: false,
      richPushNotificationEnabled: false,
      pushTemplatesEnabled: false,
      deviceTriggerEnabled: false
    }
  };

  const OLD_ENV = process.env;
  const plistContent = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n<key>WorkspaceId</key>\n<string>mocked_app_id</string>\n<key>AppGroupName</key>\n<string>mocked_app_group</string>\n<key>DataCenter</key>\n<integer>1</integer>\n</dict>\n</plist>';

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    mockConfig = {
      name: 'TestApp',
      slug: 'test-app',
      ios: {
        bundleIdentifier: 'com.test.app'
      },
      modRequest: {
        projectRoot: '/test/project'
      },
      xcodeResults: createMockXcodeProject()
    };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  test('should skip modifications for tvOS', () => {
    // Precondition (Arrange)
    process.env = { ...OLD_ENV, EXPO_TV: 'true' };

    // Act
    const result: any = withMoEngageXcodeProject(mockConfig, mockProps);

    // Assert
    expect(result.xcodeResults.addFile).not.toHaveBeenCalled();
    expect(result.xcodeResults.addPbxGroup).not.toHaveBeenCalled();
    expect(result.xcodeResults.addBuildPhase).not.toHaveBeenCalled();
    expect(result.xcodeResults.addFramework).not.toHaveBeenCalled();
    expect(result.xcodeResults.addTarget).not.toHaveBeenCalled();
    expect(result.xcodeResults.addToPbxGroup).not.toHaveBeenCalled();
  });

  test('should not modify Xcode project when no extensions are enabled', () => {
    // Precondition (Arrange)
    // Default mockConfig and mockProps are already set up with no extensions enabled
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(plistContent);

    // Act
    const result: any = withMoEngageXcodeProject(mockConfig, mockProps);

    // Assert
    expect(result.xcodeResults.addFile).not.toHaveBeenCalled();
    expect(result.xcodeResults.addPbxGroup).not.toHaveBeenCalled();
    expect(result.xcodeResults.addBuildPhase).not.toHaveBeenCalled();
    expect(result.xcodeResults.addFramework).not.toHaveBeenCalled();
    expect(result.xcodeResults.addTarget).not.toHaveBeenCalled();
    expect(result.xcodeResults.addToPbxGroup).not.toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  test('should add rich push notification target when richPushNotificationEnabled is true', () => {
    // Precondition (Arrange)
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(plistContent);

    // Configure mock to simulate target doesn't exist yet
    mockConfig.xcodeResults.pbxGroupByName = jest.fn()
    jest.spyOn(mockConfig.xcodeResults, 'pbxGroupByName').mockReturnValueOnce(null);

    const propsWithRichPush = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        richPushNotificationEnabled: true
      }
    };

    // Act
    const result: any = withMoEngageXcodeProject(mockConfig, propsWithRichPush);

    // Assert
    expect(result).toBeDefined();
    expect(result.xcodeResults.pbxGroupByName).toHaveBeenCalledWith(constants.MOENGAGE_IOS_RICH_PUSH_TARGET);
    expect(result.xcodeResults.addTarget).toHaveBeenCalledWith(
      constants.MOENGAGE_IOS_RICH_PUSH_TARGET,
      'app_extension',
      constants.MOENGAGE_IOS_RICH_PUSH_TARGET,
      `com.test.app.${constants.MOENGAGE_IOS_RICH_PUSH_TARGET}`
    );
    expect(result.xcodeResults.addPbxGroup).toHaveBeenCalledWith(
      constants.MOENGAGE_IOS_RICH_PUSH_FILES,
      constants.MOENGAGE_IOS_RICH_PUSH_TARGET,
      constants.MOENGAGE_IOS_RICH_PUSH_TARGET
    );
  });

  test('should add push templates target when pushTemplatesEnabled is true', () => {
    // Precondition (Arrange)
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(plistContent);

    // Configure mock to simulate targets don't exist yet
    mockConfig.xcodeResults.pbxGroupByName = jest.fn()
    jest.spyOn(mockConfig.xcodeResults, 'pbxGroupByName')
      .mockReturnValueOnce(null) // Rich push target doesn't exist
      .mockReturnValueOnce(null); // Push templates target doesn't exist

    const propsWithPushTemplates = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        pushTemplatesEnabled: true
      }
    };

    // Act
    const result: any = withMoEngageXcodeProject(mockConfig, propsWithPushTemplates);

    // Assert
    expect(result).toBeDefined();
    // Should add both rich push target and push templates target
    expect(result.xcodeResults.addTarget).toHaveBeenCalledTimes(2);
    expect(result.xcodeResults.addTarget).toHaveBeenCalledWith(
      constants.MOENGAGE_IOS_PUSH_TEMPLATE_TARGET,
      'app_extension',
      constants.MOENGAGE_IOS_PUSH_TEMPLATE_TARGET,
      `com.test.app.${constants.MOENGAGE_IOS_PUSH_TEMPLATE_TARGET}`
    );
    expect(result.xcodeResults.addPbxGroup).toHaveBeenCalledWith(
      constants.MOENGAGE_IOS_PUSH_TEMPLATE_FILES,
      constants.MOENGAGE_IOS_PUSH_TEMPLATE_TARGET,
      constants.MOENGAGE_IOS_PUSH_TEMPLATE_TARGET
    );
  });

  test('should not add targets that already exist', () => {
    // Precondition (Arrange)
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(plistContent);

    // Configure mock to simulate targets already exist
    mockConfig.xcodeResults.pbxGroupByName = jest.fn()
    jest.spyOn(mockConfig.xcodeResults, 'pbxGroupByName')
      .mockReturnValueOnce({ uuid: `com.test.app.${constants.MOENGAGE_IOS_RICH_PUSH_TARGET}` }) // Rich push target exists
      .mockReturnValueOnce({ uuid: `com.test.app.${constants.MOENGAGE_IOS_PUSH_TEMPLATE_TARGET}` }); // Push templates target exists

    const propsWithBothEnabled = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        richPushNotificationEnabled: true,
        pushTemplatesEnabled: true
      }
    };

    // Act
    const result: any = withMoEngageXcodeProject(mockConfig, propsWithBothEnabled);

    // Assert
    expect(result).toBeDefined();
    // Should not add any targets
    expect(result.xcodeResults.addTarget).not.toHaveBeenCalled();
  });

  test.each(['Info.plist', 'MoEngageExpoLiveActivity-Info.plist', 'LiveActivity-Info.plist'])(
    'set up live activity target with %s',
    (plist) => {
    // Precondition (Arrange)
    const propsWithLiveActivity = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        liveActivityTargetPath: 'assets/moengage/LiveActivity'
      }
    };

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(plistContent);

    const topEntries = [
      'LiveActivity.swift',
      'LiveActivity.m',
      'LiveActivity.c',
      'LiveActivity.h',
      'LiveActivity.cpp',
      plist,
      'LiveActivity.entitlements',
      'LiveActivity.xcstrings'
    ].map(file => {
      return { name: file, isDirectory: () => false };
    }) as unknown as fs.Dirent<Buffer<ArrayBufferLike>>[];
    const assets = {
      name: 'LiveActivity.xcassets', isDirectory: () => true
    } as unknown as fs.Dirent<Buffer<ArrayBufferLike>>;
    const nested = {
      name: 'Nested', isDirectory: () => true
    } as unknown as fs.Dirent<Buffer<ArrayBufferLike>>;
    const nestedAssets = {
      name: 'Nested.xcassets', isDirectory: () => true
    } as unknown as fs.Dirent<Buffer<ArrayBufferLike>>;
    const nestedEntries = [
      'Nested.swift',
      'Nested.m',
      'Nested.c',
      'Nested.h',
      'Nested.cpp',
      'Nested.xcstrings'
    ].map(file => {
      return { name: file, isDirectory: () => false };
    }) as unknown as fs.Dirent<Buffer<ArrayBufferLike>>[];
    jest.spyOn(fs, 'readdirSync')
      .mockReturnValueOnce([assets, nested, ...topEntries])
      .mockReturnValueOnce([nestedAssets, ...nestedEntries]);

    // Configure mock to simulate target doesn't exist yet
    mockConfig.xcodeResults.pbxGroupByName = jest.fn()
    jest.spyOn(mockConfig.xcodeResults, 'pbxGroupByName').mockReturnValueOnce(null);

    // Act
    const result: any = withMoEngageXcodeProject(mockConfig, propsWithLiveActivity);

    // Assert
    expect(result).toBeDefined();
    expect(result.xcodeResults.pbxGroupByName).toHaveBeenCalledWith(constants.MOENGAGE_IOS_LIVE_ACTIVITY_TARGET);
    expect(result.xcodeResults.addTarget).toHaveBeenCalledWith(
      constants.MOENGAGE_IOS_LIVE_ACTIVITY_TARGET,
      'app_extension',
      constants.MOENGAGE_IOS_LIVE_ACTIVITY_TARGET,
      `com.test.app.${constants.MOENGAGE_IOS_LIVE_ACTIVITY_TARGET}`
    );

    // Should add the necessary frameworks for live activity
    expect(result.xcodeResults.addBuildPhase).toHaveBeenCalledWith(
      ['SwiftUI.framework', 'WidgetKit.framework', 'ActivityKit.framework'],
      'PBXFrameworksBuildPhase',
      'Frameworks',
      `com.test.app.${constants.MOENGAGE_IOS_LIVE_ACTIVITY_TARGET}`
    );
  });

  test('should throw error for invalid plist content', () => {
    // Precondition (Arrange)
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue('invalid-plist-content'); // Will give empty object

    const propsWithRichPush = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        richPushNotificationEnabled: true
      }
    };

    // Act & Assert
    expect(() => {
      withMoEngageXcodeProject(mockConfig, propsWithRichPush);
    }).toThrow('Could not import MoEngage configuration')
  });

  test('should handle errors when reading config file', () => {
    // Precondition (Arrange)
    const mockConfig = {
      name: 'TestApp',
      slug: 'test-app',
      ios: {
        bundleIdentifier: 'com.test.app'
      },
      modRequest: {
        projectRoot: '/test/project'
      },
      xcodeResults: createMockXcodeProject()
    };

    const mockProps = {
      android: {
        configFilePath: 'android/config.xml'
      },
      apple: {
        configFilePath: 'assets/moengage/MoEngage-Config.plist',
        pushNotificationImpressionTrackingEnabled: false,
        richPushNotificationEnabled: true,
        pushTemplatesEnabled: false,
        deviceTriggerEnabled: false
      }
    };

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('File read error');
    });

    // Act & Assert
    expect(() => {
      withMoEngageXcodeProject(mockConfig, mockProps);
    }).toThrow('Could not import MoEngage configuration: Error: File read error');
  });

  test('should throw error when AppGroupName is missing in config file', () => {
    // Precondition (Arrange)
    const plistWithoutAppGroup = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n<key>WorkspaceId</key>\n<string>mocked_app_id</string>\n<key>DataCenter</key>\n<integer>1</integer>\n</dict>\n</plist>';

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(plistWithoutAppGroup);

    const propsWithRichPush = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        richPushNotificationEnabled: true
      }
    };

    // Act & Assert
    expect(() => {
      withMoEngageXcodeProject(mockConfig, propsWithRichPush);
    }).toThrow('Missing AppGroupName key in MoEngage configuration');
  });

  test('should throw error when config file is missing', () => {
    // Precondition (Arrange)
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    const propsWithRichPush = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        richPushNotificationEnabled: true
      }
    };

    // Act & Assert
    expect(() => {
      withMoEngageXcodeProject(mockConfig, propsWithRichPush);
    }).toThrow('MoEngage configuration does not exist');
  });

  test('should throw error when LiveActivity path read fails', () => {
    // Precondition (Arrange)
    const propsWithLiveActivity = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        liveActivityTargetPath: 'assets/moengage/LiveActivity',
        configFilePath: 'assets/moengage/MoEngage-Config.plist'
      }
    };

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(plistContent);

    // Mock readdirSync to throw an error
    jest.spyOn(fs, 'readdirSync').mockImplementation(() => {
      throw new Error('Permission denied');
    });

    // Configure mock to simulate target doesn't exist yet
    mockConfig.xcodeResults.pbxGroupByName = jest.fn()
    jest.spyOn(mockConfig.xcodeResults, 'pbxGroupByName').mockReturnValueOnce(null);

    // Act & Assert
    expect(() => {
      withMoEngageXcodeProject(mockConfig, propsWithLiveActivity);
    }).toThrow('Error finding files in Live Activity path: Error: Permission denied');
  });
});
