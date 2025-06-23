import { withMoEngageEntitlements } from '../../src/apple/withEntitlements';
import * as fs from 'fs';
import * as path from 'path';

// Mock the file system module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn()
}));

describe('Entitlements configuration', () => {
  let mockConfig: any;

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

  const plistContent = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n<key>WorkspaceId</key>\n<string>mocked_app_id</string>\n<key>AppGroupName</key>\n<string>mocked_app_group</string>\n<key>DataCenter</key>\n<integer>1</integer>\n<key>KeychainGroupName</key>\n<string>mocked_keychain</string>\n</dict>\n</plist>';

  beforeEach(() => {
    jest.clearAllMocks();
    mockConfig = {
      name: 'TestApp',
      slug: 'test-app',
      modRequest: {
        projectRoot: '/test/project'
      }
    };
  });

  test('should not modify entitlements if config file does not exist', () => {
    // Precondition (Arrange)
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    // Act
    const result: any = withMoEngageEntitlements(mockConfig, mockProps);

    // Assert
    expect(result.entitlementsPlistResults).toEqual({});
    expect(fs.existsSync).toHaveBeenCalledWith('/test/project/assets/moengage/MoEngage-Config.plist');
  });

  test('should add app group to entitlements if push features are enabled', () => {
    // Precondition (Arrange)
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(plistContent);

    const propsWithPushEnabled = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        richPushNotificationEnabled: true
      }
    };

    // Act
    const result: any = withMoEngageEntitlements(mockConfig, propsWithPushEnabled);

    // Assert
    expect(result.entitlementsPlistResults).toHaveProperty(['com.apple.security.application-groups']);
    expect(result.entitlementsPlistResults['com.apple.security.application-groups']).toEqual(['mocked_app_group']);
  });

  test('should add app group to existing app groups if push features are enabled', () => {
    // Precondition (Arrange)
    mockConfig.entitlementsPlistResults = {
      'com.apple.security.application-groups': ['existing.group']
    };
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(plistContent);

    const propsWithPushEnabled = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        pushTemplatesEnabled: true
      }
    };

    // Act
    const result: any = withMoEngageEntitlements(mockConfig, propsWithPushEnabled);

    // Assert
    expect(result.entitlementsPlistResults['com.apple.security.application-groups']).toEqual(['existing.group', 'mocked_app_group']);
  });

  test('should not duplicate app group entries', () => {
    // Precondition (Arrange)
    mockConfig.entitlementsPlistResults = {
      'com.apple.security.application-groups': ['mocked_app_group', 'other.group']
    };
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(plistContent);

    const propsWithPushEnabled = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        pushNotificationImpressionTrackingEnabled: true
      }
    };

    // Act
    const result: any = withMoEngageEntitlements(mockConfig, propsWithPushEnabled);

    // Assert
    expect(result.entitlementsPlistResults['com.apple.security.application-groups']).toEqual(['mocked_app_group', 'other.group']);
  });

  test('should add keychain access groups if specified in config', () => {
    // Precondition (Arrange)
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(`${plistContent}`);

    // Act
    const result: any = withMoEngageEntitlements(mockConfig, mockProps);

    // Assert
    expect(result.entitlementsPlistResults).toHaveProperty('keychain-access-groups');
    expect(result.entitlementsPlistResults['keychain-access-groups']).toEqual(['mocked_keychain']);
  });

  test('should add keychain access group to existing keychain groups', () => {
    // Precondition (Arrange)
    mockConfig.entitlementsPlistResults = {
      'keychain-access-groups': ['existing.keychain']
    };
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(`${plistContent}`);

    // Act
    const result: any = withMoEngageEntitlements(mockConfig, mockProps);

    // Assert
    expect(result.entitlementsPlistResults['keychain-access-groups']).toEqual(['existing.keychain', 'mocked_keychain']);
  });

  test('should not duplicate keychain group entries', () => {
    // Precondition (Arrange)
    mockConfig.entitlementsPlistResults = {
      'keychain-access-groups': ['mocked_keychain', 'other.keychain']
    };
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(`${plistContent}`);

    // Act
    const result: any = withMoEngageEntitlements(mockConfig, mockProps);

    // Assert
    expect(result.entitlementsPlistResults['keychain-access-groups']).toEqual(['mocked_keychain', 'other.keychain']);
  });

  test('should handle errors when reading plist file', () => {
    // Precondition (Arrange)
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('File read error');
    });

    // Act
    const result: any = withMoEngageEntitlements(mockConfig, mockProps);

    // Assert
    expect(result.entitlementsPlistResults).toEqual({});
  });

  test('should warn when AppGroupName is missing for push features', () => {
    // Precondition (Arrange)
    const plistContent = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n<key>WorkspaceId</key>\n<string>mocked_app_id</string>\n<key>DataCenter</key>\n<integer>1</integer>\n<</dict>\n</plist>';
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(`${plistContent}`);
    
    const propsWithPushEnabled = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        pushTemplatesEnabled: true
      }
    };

    // Act
    const result: any = withMoEngageEntitlements(mockConfig, propsWithPushEnabled);
    
    // Assert
    expect(result.entitlementsPlistResults['com.apple.security.application-groups']).toBeUndefined();
  });

  test('should add app group to entitlements when rich push notification is enabled', () => {
    const propsWithRichPushEnabled = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        pushNotificationImpressionTrackingEnabled: false,
        richPushNotificationEnabled: true,
        pushTemplatesEnabled: false,
        deviceTriggerEnabled: false
      }
    };

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(`${plistContent}`);

    // Act
    withMoEngageEntitlements(mockConfig, propsWithRichPushEnabled);

    // Assert
    expect(fs.existsSync).toHaveBeenCalledWith(path.join('/test/project', 'assets/moengage/MoEngage-Config.plist'));
    expect(fs.readFileSync).toHaveBeenCalledWith(path.join('/test/project', 'assets/moengage/MoEngage-Config.plist'), 'utf8');
    expect(mockConfig.entitlementsPlistResults['com.apple.security.application-groups']).toContain('mocked_app_group');
    expect(mockConfig.entitlementsPlistResults['keychain-access-groups']).toContain('mocked_keychain');
  });

  test('should add app group to entitlements when push templates are enabled', () => {
    const propsWithTemplatesEnabled = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        pushNotificationImpressionTrackingEnabled: false,
        richPushNotificationEnabled: false,
        pushTemplatesEnabled: true,
        deviceTriggerEnabled: false
      }
    };

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(`${plistContent}`);

    // Act
    withMoEngageEntitlements(mockConfig, propsWithTemplatesEnabled);

    // Assert
    expect(mockConfig.entitlementsPlistResults['com.apple.security.application-groups']).toContain('mocked_app_group');
    expect(mockConfig.entitlementsPlistResults['keychain-access-groups']).toContain('mocked_keychain');
  });

  test('should add app group to entitlements when push notification impression tracking is enabled', () => {
    // Arrange
    const propsWithPushEnabled = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        pushNotificationImpressionTrackingEnabled: true,
        richPushNotificationEnabled: false,
        pushTemplatesEnabled: false,
        deviceTriggerEnabled: false
      }
    };

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(`${plistContent}`);

    // Act
    withMoEngageEntitlements(mockConfig, propsWithPushEnabled);

    // Assert
    expect(mockConfig.entitlementsPlistResults['com.apple.security.application-groups']).toContain('mocked_app_group');
    expect(mockConfig.entitlementsPlistResults['keychain-access-groups']).toContain('mocked_keychain');
  });

  test('should handle errors when config file does not exist', () => {
    // Arrange
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    // Act
    withMoEngageEntitlements(mockConfig, mockProps);

    // Assert
    expect(mockConfig.entitlementsPlistResults['com.apple.security.application-groups']).toBeUndefined();
    expect(mockConfig.entitlementsPlistResults['keychain-access-groups']).toBeUndefined();
  });
});
