import * as apple from '../../src/apple';
import * as appleInfoPlist from '../../src/apple/withInfoPlist';
import * as appleEntitlements from '../../src/apple/withEntitlements';
import * as appleXcodeProject from '../../src/apple/withXcodeProject';
import * as appleDangerousMod from '../../src/apple/withDangerousMod';
import * as fs from 'fs';

// Mock the file system module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  readdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
  copyFileSync: jest.fn(),
  appendFileSync: jest.fn()
}));

// Mock the individual plugin modifiers
jest.mock('../../src/apple/withInfoPlist', () => jest.requireActual('../../src/apple/withInfoPlist'));
jest.mock('../../src/apple/withEntitlements', () => jest.requireActual('../../src/apple/withEntitlements'));
jest.mock('../../src/apple/withXcodeProject', () => jest.requireActual('../../src/apple/withXcodeProject'));
jest.mock('../../src/apple/withDangerousMod', () => jest.requireActual('../../src/apple/withDangerousMod'));

// Restore the original implementation of the mocked function after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe('Modifiers application', () => {
  // Mock implementations before each test
  beforeEach(() => {
    // Precondition (Arrange) - setup mocks for each test
    jest.spyOn(appleInfoPlist, 'withMoEngageInfoPlist').mockImplementation((config) => {
      return {
        ...config,
        infoPlistModified: true
      }
    });
    jest.spyOn(appleEntitlements, 'withMoEngageEntitlements').mockImplementation((config) => {
      return {
        ...config,
        entitlementsModified: true
      }
    });
    jest.spyOn(appleXcodeProject, 'withMoEngageXcodeProject').mockImplementation((config) => {
      return {
        ...config,
        xcodeProjectModified: true
      }
    });
    jest.spyOn(appleDangerousMod, 'withMoEngageDangerousMod').mockImplementation((config) => {
      return {
        ...config,
        dangerousModApplied: true
      }
    });
  });

  test('calls all modifiers in the correct order', () => {
    // Precondition (Arrange)
    const mockConfig: any = {
      name: 'TestApp',
      slug: 'test-app', // Required by ExpoConfig
      owner: 'owner',
      version: '1.0.0',
    };

    const mockProps = {
      android: {
        configFilePath: 'assets/moengage/android_initialization_config.xml'
      },
      apple: {
        configFilePath: 'path/to/config.plist',
        pushNotificationImpressionTrackingEnabled: false,
        richPushNotificationEnabled: true,
        pushTemplatesEnabled: false,
        deviceTriggerEnabled: true,
        liveActivityTargetPath: 'path/to/liveactivity'
      }
    };

    // Act
    const result = apple.withMoEngageIos(mockConfig, mockProps);

    // Assert
    expect(result).toBeDefined();
    expect(apple.withMoEngageInfoPlist).toHaveBeenCalledWith(mockConfig, mockProps);
    expect(apple.withMoEngageEntitlements).toHaveBeenCalledWith(
      { ...mockConfig, infoPlistModified: true },
      mockProps
    );
    expect(apple.withMoEngageXcodeProject).toHaveBeenCalledWith(
      { ...mockConfig, infoPlistModified: true, entitlementsModified: true },
      mockProps
    );
    expect(apple.withMoEngageDangerousMod).toHaveBeenCalledWith(
      { ...mockConfig, infoPlistModified: true, entitlementsModified: true, xcodeProjectModified: true },
      mockProps
    );

    // Verify the final result has all modifications applied
    expect(result).toEqual({
      name: 'TestApp',
      slug: 'test-app',
      owner: 'owner',
      version: '1.0.0',
      infoPlistModified: true,
      entitlementsModified: true,
      xcodeProjectModified: true,
      dangerousModApplied: true
    });
  });

  test('calls all modifiers in the correct order with minimal props', () => {
    // Precondition (Arrange)
    const mockConfig = {
      name: 'TestApp',
      slug: 'test-app', // Required by ExpoConfig
      owner: 'owner',
      version: '1.0.0',
    };

    const mockProps = {
      android: {
        configFilePath: 'assets/moengage/android_initialization_config.xml'
      },
      apple: {
        configFilePath: 'path/to/config.plist',
        pushNotificationImpressionTrackingEnabled: false,
        richPushNotificationEnabled: false,
        pushTemplatesEnabled: false,
        deviceTriggerEnabled: false
      }
    };

    // Act
    const result = apple.withMoEngageIos(mockConfig, mockProps);

    // Assert
    expect(result).toBeDefined();
    expect(apple.withMoEngageInfoPlist).toHaveBeenCalledWith(mockConfig, mockProps);
    expect(apple.withMoEngageEntitlements).toHaveBeenCalledWith(
      { ...mockConfig, infoPlistModified: true },
      mockProps
    );
    expect(apple.withMoEngageXcodeProject).toHaveBeenCalledWith(
      { ...mockConfig, infoPlistModified: true, entitlementsModified: true },
      mockProps
    );
    expect(apple.withMoEngageDangerousMod).toHaveBeenCalledWith(
      { ...mockConfig, infoPlistModified: true, entitlementsModified: true, xcodeProjectModified: true },
      mockProps
    );

    // Result should match the expected output after all modifiers
    expect(result).toEqual({
      name: 'TestApp',
      slug: 'test-app',
      owner: 'owner',
      version: '1.0.0',
      infoPlistModified: true,
      entitlementsModified: true,
      xcodeProjectModified: true,
      dangerousModApplied: true
    });
  });

  test('constants and individual modifiers are exported correctly', () => {
    // Precondition (Arrange)
    // No setup needed - testing exports

    // Assert
    expect(apple.constants).toBeDefined();
    expect(apple.withMoEngageInfoPlist).toBeDefined();
    expect(apple.withMoEngageEntitlements).toBeDefined();
    expect(apple.withMoEngageXcodeProject).toBeDefined();
    expect(apple.withMoEngageDangerousMod).toBeDefined();
    expect(apple.default).toBe(apple.withMoEngageIos);
  });
});

describe('Apple Integration', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    // Default file existence mocks
    jest.spyOn(fs, 'existsSync').mockImplementation((path) => {
      if (`${path}`.includes('MoEngage-Config.plist')) {
        return true;
      }
      return false;
    });
    jest.spyOn(fs, 'readFileSync').mockImplementation((path, _) => {
      if (`${path}`.includes('MoEngage-Config.plist')) {
        return '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n<key>WorkspaceId</key>\n<string>mocked_app_id</string>\n<key>AppGroupName</key>\n<string>mocked_app_group</string>\n<key>DataCenter</key>\n<integer>1</integer>\n</dict>\n</plist>';
      }
      return '';
    });
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  test('integrates MoEngage with full iOS features enabled', () => {
    // Precondition (Arrange)
    const mockConfig: any = {
      name: 'TestApp',
      modRequest: {
        projectRoot: '/test/project',
        platformRoot: '/test/project/ios',
        platform: 'ios',
        projectName: 'TestApp'
      }
    };

    const mockProps = {
      android: {
        configFilePath: 'assets/moengage/android_initilisation_config.xml'
      },
      apple: {
        configFilePath: 'assets/moengage/MoEngage-Config.plist',
        pushNotificationImpressionTrackingEnabled: true,
        richPushNotificationEnabled: true,
        pushTemplatesEnabled: true,
        deviceTriggerEnabled: true,
        liveActivityTargetPath: 'LiveActivity'
      }
    };

    const topEntries = [
      'LiveActivity.swift',
      'LiveActivity.m',
      'LiveActivity.c',
      'LiveActivity.h',
      'LiveActivity.cpp',
      'Info.plist',
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

    // Act
    const result = apple.withMoEngageIos(mockConfig, mockProps);

    // Assert - check that all components were properly configured
    expect(result).toBeDefined();

    // 1. Verify InfoPlist modifications
    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('MoEngage-Config.plist'));
    expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('MoEngage-Config.plist'), 'utf8');

    // 2. Verify entitlements were properly configured
    // This is hard to test directly since we're using the actual implementation
    // but we can check that the configuration has progressed through all phases

    // 3. Verify Xcode project modifications
    // Check that file operations occurred for rich notifications
    expect(fs.copyFileSync).toHaveBeenCalled();
  });

  test('integrates MoEngage with minimal iOS features', () => {
    // Precondition (Arrange)
    const mockConfig: any = {
      name: 'TestApp',
      modRequest: {
        projectRoot: '/test/project',
        platformRoot: '/test/project/ios',
        platform: 'ios',
        projectName: 'TestApp'
      }
    };

    const mockProps = {
      android: {
        configFilePath: 'assets/moengage/android_initilisation_config.xml'
      },
      apple: {
        configFilePath: 'assets/moengage/MoEngage-Config.plist',
        pushNotificationImpressionTrackingEnabled: true,
        richPushNotificationEnabled: false,
        pushTemplatesEnabled: false,
        deviceTriggerEnabled: false
      }
    };

    // Act
    const result = apple.withMoEngageIos(mockConfig, mockProps);

    // Assert - check that only basic configuration was applied
    expect(result).toBeDefined();
    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('MoEngage-Config.plist'));

    // File operations still happen with minimal configuration
    expect(fs.copyFileSync).toHaveBeenCalled();
  });

  test('handles missing configuration file', () => {
    // Precondition (Arrange)
    const mockConfig: any = {
      name: 'TestApp',
      modRequest: {
        projectRoot: '/test/project',
        platformRoot: '/test/project/ios',
        platform: 'ios',
        projectName: 'TestApp'
      }
    };

    const mockProps = {
      android: {
        configFilePath: 'assets/moengage/android_initilisation_config.xml'
      },
      apple: {
        configFilePath: 'assets/moengage/MoEngage-Config.plist',
        pushNotificationImpressionTrackingEnabled: true,
        richPushNotificationEnabled: true,
        pushTemplatesEnabled: false,
        deviceTriggerEnabled: false
      }
    };

    // Mock that the config file doesn't exist
    jest.spyOn(fs, 'existsSync').mockImplementation(() => false);

    // Act & Assert
    expect(() => {
      apple.withMoEngageIos(mockConfig, mockProps);
    }).toThrow('MoEngage configuration does not exist');

    // Should check for file but not read it
    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('MoEngage-Config.plist'));
    expect(fs.readFileSync).not.toHaveBeenCalled();
  });

  test('skips modifications for tvOS platforms', () => {
    // Precondition (Arrange)
    process.env = { ...OLD_ENV, EXPO_TV: 'true' };

    const mockConfig: any = {
      name: 'TestApp',
      modRequest: {
        projectRoot: '/test/project',
        platformRoot: '/test/project/ios',
        platform: 'ios',
        projectName: 'TestApp'
      }
    };

    const mockProps = {
      android: {
        configFilePath: 'assets/moengage/android_initilisation_config.xml'
      },
      apple: {
        configFilePath: 'assets/moengage/MoEngage-Config.plist',
        pushNotificationImpressionTrackingEnabled: true,
        richPushNotificationEnabled: true,
        pushTemplatesEnabled: true,
        deviceTriggerEnabled: true
      }
    };

    // Act
    const result = apple.withMoEngageIos(mockConfig, mockProps);

    // Assert
    expect(result).toBeDefined();
    // For tvOS we should get back the original config without modifications
    expect(result).toEqual(mockConfig);
  });

  test('handles malformed plist file gracefully', () => {
    // Precondition (Arrange)
    const mockConfig: any = {
      name: 'TestApp',
      modRequest: {
        projectRoot: '/test/project'
      },
      modResults: {}
    };

    const mockProps = {
      android: {
        configFilePath: 'android/config.xml'
      },
      apple: {
        configFilePath: 'assets/moengage/MoEngage-Config.plist',
        pushNotificationImpressionTrackingEnabled: true,
        richPushNotificationEnabled: false,
        pushTemplatesEnabled: false,
        deviceTriggerEnabled: false
      }
    };

    // Mock a malformed plist file
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue('malformed plist content');

    // Act & Assert
    // The function should throw an error with malformed plist content
    expect(() => {
      apple.withMoEngageInfoPlist(mockConfig, mockProps);
    }).toThrow('Could not import MoEngage configuration');
  });

  test('handles relative path navigation in config file path', () => {
    // Arrange
    const mockConfig: any = {
      name: 'TestApp',
      modRequest: {
        projectRoot: '/test/project'
      },
      modResults: {}
    };

    const mockProps = {
      android: {
        configFilePath: 'android/config.xml'
      },
      apple: {
        // Use a relative path with navigation
        configFilePath: './assets/../assets/moengage/./MoEngage-Config.plist',
        pushNotificationImpressionTrackingEnabled: true,
        richPushNotificationEnabled: false,
        pushTemplatesEnabled: false,
        deviceTriggerEnabled: false
      }
    };

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockImplementation((_path, _) => {
      return '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n<key>WorkspaceId</key>\n<string>mocked_app_id</string>\n<key>AppGroupName</key>\n<string>mocked_app_group</string>\n<key>DataCenter</key>\n<integer>1</integer>\n</dict>\n</plist>';
    });

    // Act
    apple.withMoEngageInfoPlist(mockConfig, mockProps);

    // Assert
    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringMatching(/MoEngage-Config\.plist$/));
    expect(mockConfig.infoPlistResults).toHaveProperty('MoEngage');
  });

  test('handles empty configuration properties', () => {
    // Arrange
    const mockConfig: any = {
      name: 'TestApp',
      modRequest: {
        projectRoot: '/test/project'
      },
      modResults: {}
    };

    const mockProps = {
      android: {
        configFilePath: 'android/config.xml'
      },
      apple: {
        configFilePath: 'assets/moengage/MoEngage-Config.plist',
        pushNotificationImpressionTrackingEnabled: true,
        richPushNotificationEnabled: false,
        // Missing optional properties should be handled gracefully
        // pushTemplatesEnabled: undefined,
        // deviceTriggerEnabled: undefined,
        // liveActivityTargetPath: undefined
      } as any
    };

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);

    // Act - should not throw errors due to missing properties
    expect(() => {
      apple.withMoEngageIos(mockConfig, mockProps);
    }).not.toThrow();
  });

  test('does not add duplicate app groups in entitlements', () => {
    // Arrange
    const appGroup = 'mocked_app_group';

    const mockConfig: any = {
      name: 'TestApp',
      modRequest: {
        projectRoot: '/test/project'
      },
      entitlementsPlistResults: {
        'com.apple.security.application-groups': [appGroup] // Already exists
      }
    };

    const mockProps = {
      android: {
        configFilePath: 'android/config.xml'
      },
      apple: {
        configFilePath: 'assets/moengage/MoEngage-Config.plist',
        pushNotificationImpressionTrackingEnabled: true,
        richPushNotificationEnabled: true,
        pushTemplatesEnabled: false,
        deviceTriggerEnabled: false
      }
    };

    // Act
    apple.withMoEngageEntitlements(mockConfig, mockProps);

    // Assert - the app group should only appear once
    expect(mockConfig.entitlementsPlistResults['com.apple.security.application-groups']).toContain(appGroup);
    expect(mockConfig.entitlementsPlistResults['com.apple.security.application-groups'].filter((g: string) => g === appGroup).length).toBe(1);
  });
});
