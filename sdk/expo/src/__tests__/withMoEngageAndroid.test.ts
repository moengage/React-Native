import withMoEngageAndroid from '../android/withMoEngageAndroid';
import * as utils from '../android/utils';
import { mockConfig, mockProps, getMockManifest, MoEExpoFireBaseMessagingService, MoEFireBaseMessagingService, FIREBASE_MESSAGING_DEPENDENCY } from '../__mocks__/mockConstants';

jest.mock('@expo/config-plugins', () => {
  const actual = jest.requireActual('@expo/config-plugins');
  return {
    ...actual,
    withAndroidManifest: (config: any, callback: any) => {
      if (!config.modResults.manifest) {
        config.modResults = {
          manifest: {
            application: [config.modResults],
          },
        };
      }
      return callback(config);
    },
    withAppBuildGradle: (config: any, callback: any) => {
      if (!config.modResults) config.modResults = {};
      if (typeof config.modResults.contents !== 'string') {
        config.modResults.contents = 'dependencies {\n}';
      }
      const gradleConfig = { ...config, modResults: { ...config.modResults } };
      const result = callback(gradleConfig);
      config.modResults.contents = result.modResults.contents;
      return config;
    },
  };
});

describe('withMoEngageAndroid', () => {
  it('should run all sub-plugins and return config', () => {
    const config = withMoEngageAndroid({ ...mockConfig, modResults: getMockManifest() }, { ...mockProps });
    expect(config).toBeDefined();
  });
});

describe('withMoEngageAndroidManifest', () => {
  it('should add manifest application keys when disableMoEngageDefaultBackupFile is false', () => {
    const props = { ...mockProps, android: { ...mockProps.android, disableMoEngageDefaultBackupFile: false } };
    const inputConfig = { ...mockConfig, modResults: getMockManifest() };
    const updatedConfig = withMoEngageAndroid(inputConfig, props) as any;
    const mainApp = updatedConfig.modResults.manifest.application[0].$;
    expect(mainApp["android:fullBackupContent"]).toBeDefined();
    expect(mainApp["android:dataExtractionRules"]).toBeDefined();
  });

  it('should not add manifest application keys when disableMoEngageDefaultBackupFile is true', () => {
    const props = { ...mockProps, android: { ...mockProps.android, disableMoEngageDefaultBackupFile: true } };
    const inputConfig = { ...mockConfig, modResults: getMockManifest() };
    const updatedConfig = withMoEngageAndroid(inputConfig, props) as any;
    if (updatedConfig.modResults.manifest) {
      const mainApp = updatedConfig.modResults.manifest.application[0].$;
      expect(mainApp["android:fullBackupContent"]).toBeUndefined();
      expect(mainApp["android:dataExtractionRules"]).toBeUndefined();
    } else {
      expect(updatedConfig.modResults["android:fullBackupContent"]).toBeUndefined();
      expect(updatedConfig.modResults["android:dataExtractionRules"]).toBeUndefined();
    }
  });

  it('should add Expo Notification Service to manifest if isExpoNotificationIntegration is true', () => {
    const props = { ...mockProps, android: { ...mockProps.android, shouldIncludeMoEngageFirebaseMessagingService: true, isExpoNotificationIntegration: true } };
    const inputConfig = { ...mockConfig, modResults: getMockManifest() };
    const updatedConfig = withMoEngageAndroid(inputConfig, props) as any;
    const services = updatedConfig.modResults.manifest.application[0].service;
    expect(services.some((s: any) => s.$ && s.$['android:name'] === MoEExpoFireBaseMessagingService)).toBe(true);
  });

  it('should add MoEngage FCM Service to manifest if isExpoNotificationIntegration is false', () => {
    const props = { ...mockProps, android: { ...mockProps.android, shouldIncludeMoEngageFirebaseMessagingService: true, isExpoNotificationIntegration: false } };
    const inputConfig = { ...mockConfig, modResults: getMockManifest() };
    const updatedConfig = withMoEngageAndroid(inputConfig, props) as any;
    const services = updatedConfig.modResults.manifest.application[0].service;
    expect(services.some((s: any) => s.$ && s.$['android:name'] === MoEFireBaseMessagingService)).toBe(true);
  });
});

describe('withMoEngageInitialisationConfigResource', () => {
  it('should call copyFile for all provided icon and config paths', async () => {
    const spy = jest.spyOn(utils, 'copyFile').mockImplementation(async () => {});
    const config = require('../android/withMoEngageAndroid');
    const props = { ...mockProps, android: { ...mockProps.android, smallIconPath: 'icon.png', largeIconPath: 'icon_large.png', configFilePath: 'assets/moengage/android_initilisation_config.xml' } };
    const plugin = config['withMoEngageInitialisationConfigResource'];
    if (plugin) {
      const moddedConfig = plugin({ ...mockConfig }, props);
      const mod = moddedConfig?.mods?.android;
      if (typeof mod === 'function') {
        await mod({ ...mockConfig });
      }
      expect(spy).toHaveBeenCalledTimes(3);
    }
    spy.mockRestore();
  });

  it('should not call copyFile if no paths are provided', async () => {
    const spy = jest.spyOn(utils, 'copyFile').mockImplementation(async () => {});
    const config = require('../android/withMoEngageAndroid');
    const props = { ...mockProps, android: { ...mockProps.android, smallIconPath: undefined, largeIconPath: undefined, configFilePath: undefined } };
    const plugin = config['withMoEngageInitialisationConfigResource'];
    if (plugin) {
      const moddedConfig = plugin({ ...mockConfig }, props);
      const mod = moddedConfig?.mods?.android;
      if (typeof mod === 'function') {
        await mod({ ...mockConfig });
      }
      expect(spy).not.toHaveBeenCalled();
    }
    spy.mockRestore();
  });
});

describe('withMoEngageDependencies', () => {
  it('should add dependency if includeFirebaseMessagingDependencies is true', () => {
    const props = { ...mockProps, android: { ...mockProps.android, includeFirebaseMessagingDependencies: true } };
    const inputConfig = { ...mockConfig, modResults: getMockManifest() };
    const updatedConfig = withMoEngageAndroid(inputConfig, props) as any;
    const gradleContents = updatedConfig.modResults.contents || '';
    expect(gradleContents).toContain(FIREBASE_MESSAGING_DEPENDENCY);
  });

  it('should not add dependency if includeFirebaseMessagingDependencies is false', () => {
    const props = { ...mockProps, android: { ...mockProps.android, includeFirebaseMessagingDependencies: false } };
    const inputConfig = { ...mockConfig, modResults: getMockManifest() };
    const updatedConfig = withMoEngageAndroid(inputConfig, props) as any;
    const gradleContents = updatedConfig.modResults.contents || '';
    expect(gradleContents).not.toContain(FIREBASE_MESSAGING_DEPENDENCY);
  });
});
