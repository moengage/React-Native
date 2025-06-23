import { withMoEngageDangerousMod } from '../../src/apple/withDangerousMod';
import * as fs from 'fs';
import * as path from 'path';
import * as constants from '../../src/apple/constants';

// Mock the file system module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  copyFileSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  appendFileSync: jest.fn()
}));

describe('Dangerous modifications', () => {
  let mockConfig: any;
  const OLD_ENV = process.env;

  const mockProps = {
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

  const plistContent = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n<key>WorkspaceId</key>\n<string>mocked_app_id</string>\n<key>AppGroupName</key>\n<string>mocked_app_group</string>\n<key>DataCenter</key>\n<integer>1</integer>\n<key>KeychainGroupName</key>\n<string>mocked_keychain</string>\n</dict>\n</plist>';

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
    // Reset environment variable
    process.env = OLD_ENV;
  });

  test('should skip modifications for tvOS', () => {
    // Precondition (Arrange)
    process.env = { ...OLD_ENV, EXPO_TV: 'true' };
    const mockProps = {
      android: {
        configFilePath: 'assets/moengage/android_initialization_config.xml'
      },
      apple: {
        configFilePath: 'assets/moengage/MoEngage-Config.plist',
        pushNotificationImpressionTrackingEnabled: true,
        richPushNotificationEnabled: true,
        pushTemplatesEnabled: true,
        deviceTriggerEnabled: true,
        liveActivityTargetPath: 'assets/moengage/LiveActivity'
      }
    };
    
    // Act
    const result = withMoEngageDangerousMod({...mockConfig}, mockProps);
    
    // Assert
    expect(result).toEqual(mockConfig);
    expect(fs.mkdirSync).not.toHaveBeenCalled();
    expect(fs.copyFileSync).not.toHaveBeenCalled();
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  test('should create notification service extension when push impression tracking enabled', () => {
    // Precondition (Arrange)
    jest.spyOn(fs, 'existsSync')
      .mockReturnValueOnce(true)  // For config file
      .mockReturnValueOnce(false) // For rich push directory
      .mockReturnValueOnce(true); // For Podfile
    jest.spyOn(fs, 'readFileSync')
      .mockReturnValueOnce(plistContent) // For config file
      .mockReturnValueOnce(entitlementsContent) // For entitlements file
      .mockReturnValueOnce(podfileContent); // For Podfile

    const propsWithRichPush = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        pushNotificationImpressionTrackingEnabled: true
      }
    };

    // Act
    const result = withMoEngageDangerousMod(mockConfig, propsWithRichPush);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(mockConfig); // Verify the function returns the config
    expect(fs.mkdirSync).toHaveBeenCalledWith(`/test/project/ios/${constants.MOENGAGE_IOS_RICH_PUSH_TARGET}`, { recursive: true });
    expect(fs.copyFileSync).toHaveBeenCalledTimes(constants.MOENGAGE_IOS_RICH_PUSH_FILES.length -  1); // Exclude entitlements file
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `/test/project/ios/${constants.MOENGAGE_IOS_RICH_PUSH_TARGET}/${constants.MOENGAGE_IOS_RICH_PUSH_TARGET}.entitlements`,
      expect.stringContaining('keychain-access-groups')
    );
    expect(fs.appendFileSync).toHaveBeenCalledWith(
      '/test/project/ios/Podfile',
      expect.stringContaining(`pod '${constants.MOENGAGE_IOS_NOTIFICATION_SERVICE_POD}'`)
    );
  });

  test('should create notification service extension when rich push enabled', () => {
    // Precondition (Arrange)
    jest.spyOn(fs, 'existsSync')
      .mockReturnValueOnce(true) // For config file
      .mockReturnValueOnce(false) // For rich push directory
      .mockReturnValueOnce(true); // For Podfile
    jest.spyOn(fs, 'readFileSync')
      .mockReturnValueOnce(plistContent) // For config file
      .mockReturnValueOnce(entitlementsContent) // For entitlements file
      .mockReturnValueOnce(podfileContent); // For Podfile

    const propsWithRichPush = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        richPushNotificationEnabled: true
      }
    };

    // Act
    const result = withMoEngageDangerousMod(mockConfig, propsWithRichPush);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(mockConfig); // Verify the function returns the config
    expect(fs.mkdirSync).toHaveBeenCalledWith(`/test/project/ios/${constants.MOENGAGE_IOS_RICH_PUSH_TARGET}`, { recursive: true });
    expect(fs.copyFileSync).toHaveBeenCalledTimes(constants.MOENGAGE_IOS_RICH_PUSH_FILES.length -  1); // Exclude entitlements file
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `/test/project/ios/${constants.MOENGAGE_IOS_RICH_PUSH_TARGET}/${constants.MOENGAGE_IOS_RICH_PUSH_TARGET}.entitlements`,
      expect.stringContaining('keychain-access-groups')
    );
    expect(fs.appendFileSync).toHaveBeenCalledWith(
      '/test/project/ios/Podfile',
      expect.stringContaining(`pod '${constants.MOENGAGE_IOS_NOTIFICATION_SERVICE_POD}'`)
    );
  });

  test('should create push template extension when pushTemplatesEnabled is true', () => {
    // Precondition (Arrange)
    jest.spyOn(fs, 'existsSync')
      .mockReturnValueOnce(true) // For config file
      .mockReturnValueOnce(false) // For rich push directory
      .mockReturnValueOnce(true) // For Podfile
      .mockReturnValueOnce(false) // For push templates directory
      .mockReturnValueOnce(true); // For Podfile

    jest.spyOn(fs, 'readFileSync')
      .mockReturnValueOnce(plistContent) // For config file
      .mockReturnValueOnce(entitlementsContent) // For entitlements file
      .mockReturnValueOnce(podfileContent) // For Podfile
      .mockReturnValueOnce(entitlementsContent) // For entitlements file
      .mockReturnValueOnce(podfileContent); // For Podfile

    const propsWithPushTemplates = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        pushTemplatesEnabled: true
      }
    };

    // Act
    const result = withMoEngageDangerousMod(mockConfig, propsWithPushTemplates);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(mockConfig);
    expect(fs.mkdirSync).toHaveBeenCalledWith(`/test/project/ios/${constants.MOENGAGE_IOS_RICH_PUSH_TARGET}`, { recursive: true });
    expect(fs.mkdirSync).toHaveBeenCalledWith(`/test/project/ios/${constants.MOENGAGE_IOS_PUSH_TEMPLATE_TARGET}`, { recursive: true });
    expect(fs.copyFileSync).toHaveBeenCalledTimes(constants.MOENGAGE_IOS_RICH_PUSH_FILES.length + constants.MOENGAGE_IOS_PUSH_TEMPLATE_FILES.length - 2); // Exclude entitlements files
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `/test/project/ios/${constants.MOENGAGE_IOS_RICH_PUSH_TARGET}/${constants.MOENGAGE_IOS_RICH_PUSH_TARGET}.entitlements`,
      expect.stringContaining('keychain-access-groups')
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `/test/project/ios/${constants.MOENGAGE_IOS_PUSH_TEMPLATE_TARGET}/${constants.MOENGAGE_IOS_PUSH_TEMPLATE_TARGET}.entitlements`,
      expect.stringContaining('keychain-access-groups')
    );
    expect(fs.appendFileSync).toHaveBeenCalledWith(
      '/test/project/ios/Podfile',
      expect.stringContaining(`pod '${constants.MOENGAGE_IOS_PUSH_TEMPLATE_POD}'`)
    );
    expect(fs.appendFileSync).toHaveBeenCalledWith(
      '/test/project/ios/Podfile',
      expect.stringContaining(`pod '${constants.MOENGAGE_IOS_PUSH_TEMPLATE_POD}'`)
    );
  });

  test('should handle live activity setup', () => {
    // Precondition (Arrange)
    const propsWithLiveActivity = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        liveActivityTargetPath: 'LiveActivityExtension'
      }
    };

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync')
      .mockReturnValueOnce(plistContent) // For config file
      .mockReturnValueOnce(podfileContent) // For Podfile
      .mockReturnValueOnce(podfileContent); // For Podfile

    // Act
    const result = withMoEngageDangerousMod(mockConfig, propsWithLiveActivity);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(mockConfig);
    expect(fs.existsSync).toHaveBeenCalledWith(path.join('/test/project', 'assets/moengage/MoEngage-Config.plist'));
    expect(fs.readFileSync).toHaveBeenCalledWith(path.join('/test/project', 'assets/moengage/MoEngage-Config.plist'), 'utf8');
    expect(fs.appendFileSync).toHaveBeenCalledWith(
      '/test/project/ios/Podfile',
      expect.stringContaining(`pod '${constants.MOENGAGE_IOS_LIVE_ACTIVITY_POD}'`)
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      '/test/project/ios/Podfile',
      expect.stringContaining(`pod '${constants.MOENGAGE_IOS_LIVE_ACTIVITY_POD}'`)
    );
  });

  test('should handle device trigger setup', () => {
    // Precondition (Arrange)
    const propsWithDeviceTrigger = {
      ...mockProps,
      apple: {
        ...mockProps.apple,
        deviceTriggerEnabled: true
      }
    };

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(podfileContent);

    // Act
    const result = withMoEngageDangerousMod(mockConfig, propsWithDeviceTrigger);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(mockConfig);
    expect(fs.existsSync).toHaveBeenCalledWith(path.join('/test/project', 'assets/moengage/MoEngage-Config.plist'));
    expect(fs.readFileSync).toHaveBeenCalledWith(path.join('/test/project', 'assets/moengage/MoEngage-Config.plist'), 'utf8');
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      '/test/project/ios/Podfile',
      expect.stringContaining(`pod '${constants.MOENGAGE_IOS_DEVICE_TRIGGER_POD}'`)
    );
  });

  test('should handle missing config file', () => {
    // Precondition (Arrange)
    const mockProps = {
      android: {
        configFilePath: 'android/config.xml'
      },
      apple: {
        configFilePath: 'assets/moengage/MoEngage-Config.plist',
        pushNotificationImpressionTrackingEnabled: true,
        richPushNotificationEnabled: true,
        pushTemplatesEnabled: true,
        deviceTriggerEnabled: true,
        liveActivityTargetPath: 'LiveActivityExtension'
      }
    };

    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    // Act
    const result = withMoEngageDangerousMod(mockConfig, mockProps);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(mockConfig);
    expect(fs.existsSync).toHaveBeenCalledWith(path.join('/test/project', mockProps.apple.configFilePath));
    // Verify that no further file operations were performed since the config file doesn't exist
    expect(fs.readFileSync).not.toHaveBeenCalled();
  });

  test('should handle errors when reading config file', () => {
    // Precondition (Arrange)
    const mockProps = {
      android: {
        configFilePath: 'android/config.xml'
      },
      apple: {
        configFilePath: 'assets/moengage/MoEngage-Config.plist',
        pushNotificationImpressionTrackingEnabled: true,
        richPushNotificationEnabled: true,
        pushTemplatesEnabled: true,
        deviceTriggerEnabled: true,
        liveActivityTargetPath: 'LiveActivityExtension'
      }
    };

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
      throw new Error('File read error');
    });

    // Act
    const result = withMoEngageDangerousMod(mockConfig, mockProps);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(mockConfig);
    expect(fs.existsSync).toHaveBeenCalledWith(path.join('/test/project', mockProps.apple.configFilePath));
    // Verify that error was handled gracefully
    expect(fs.readFileSync).toHaveBeenCalledWith(path.join('/test/project', mockProps.apple.configFilePath), 'utf8');
    // Verify no further operations were performed after the error
    expect(fs.writeFileSync).toHaveBeenCalledWith('/test/project/ios/Podfile', expect.stringContaining('pod \'MoEngage-iOS-SDK/LiveActivity\''));
  });
});

const entitlementsContent = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>com.apple.security.app-sandbox</key>
	<true/>
	<key>com.apple.security.network.client</key>
	<true/>
	<key>com.apple.security.application-groups</key>
	<array>
		<string>$(MOENGAGE_APP_GROUP)</string>
	</array>
</dict>
</plist>
`;

const podfileContent = `
require File.join(File.dirname(\`node --print "require.resolve('expo/package.json')"\`), "scripts/autolinking")
require File.join(File.dirname(\`node --print "require.resolve('react-native/package.json')"\`), "scripts/react_native_pods")

require 'json'
podfile_properties = JSON.parse(File.read(File.join(__dir__, 'Podfile.properties.json'))) rescue {}

ENV['RCT_NEW_ARCH_ENABLED'] = '0' if podfile_properties['newArchEnabled'] == 'false'
ENV['EX_DEV_CLIENT_NETWORK_INSPECTOR'] = podfile_properties['EX_DEV_CLIENT_NETWORK_INSPECTOR']

platform :ios, podfile_properties['ios.deploymentTarget'] || '15.1'
install! 'cocoapods',
  :deterministic_uuids => false

prepare_react_native_project!

target 'MoEngageExpoSampleApp' do
  use_expo_modules!

  if ENV['EXPO_USE_COMMUNITY_AUTOLINKING'] == '1'
    config_command = ['node', '-e', "process.argv=['', '', 'config'];require('@react-native-community/cli').run()"];
  else
    config_command = [
      'npx',
      'expo-modules-autolinking',
      'react-native-config',
      '--json',
      '--platform',
      'ios'
    ]
  end
  
  config = use_native_modules!(config_command)

  use_frameworks! :linkage => podfile_properties['ios.useFrameworks'].to_sym if podfile_properties['ios.useFrameworks']
  use_frameworks! :linkage => ENV['USE_FRAMEWORKS'].to_sym if ENV['USE_FRAMEWORKS']

  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => podfile_properties['expo.jsEngine'] == nil || podfile_properties['expo.jsEngine'] == 'hermes',
    # An absolute path to your application root.
    :app_path => "#{Pod::Config.instance.installation_root}/..",
    :privacy_file_aggregation_enabled => podfile_properties['apple.privacyManifestAggregationEnabled'] != 'false',
  )

  post_install do |installer|
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
      :ccache_enabled => podfile_properties['apple.ccacheEnabled'] == 'true',
    )

    # This is necessary for Xcode 14, because it signs resource bundles by default
    # when building for devices.
    installer.target_installation_results.pod_target_installation_results
      .each do |pod_name, target_installation_result|
      target_installation_result.resource_bundle_targets.each do |resource_bundle_target|
        resource_bundle_target.build_configurations.each do |config|
          config.build_settings['CODE_SIGNING_ALLOWED'] = 'NO'
        end
      end
    end
  end
end
`
