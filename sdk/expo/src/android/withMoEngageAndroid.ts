import { withAndroidManifest, ConfigPlugin, AndroidConfig, withDangerousMod, withAppBuildGradle } from '@expo/config-plugins';
import {
  drawableResourcePath,
  manifestApplicationKeys,
  xmlValuesResourcePath,
  moEngageFCMServiceEntry,
  moEngageFCMServiceName,
  moEngageExpoNotificationServiceEntry,
  moEngageExpoNotificationServiceName,
  googleFirebaseMessagingGroup,
  googleFirebaseMessagingModule
} from './constants';
import { MoEngagePluginProps } from '../types';
import { addServiceToManifestIfNotExist, copyFile, addDependencyToGradle } from './utils';

const packageJsonFile = require('../../package.json');

const withMoEngageAndroid: ConfigPlugin<MoEngagePluginProps> = (config, props) => {
  console.log('Running withMoEngageAndroid');
  config = withMoEngageAndroidManifest(config, props);
  config = withMoEngageInitialisationConfigResource(config, props);
  config = withMoEngageDependencies(config, props);
  return config;
};


/**
 * Update the AndroidManifest.xml file with MoEngage specific configurations.
 */
const withMoEngageAndroidManifest: ConfigPlugin<MoEngagePluginProps> = (config, props) => {
  console.log('Running withMoEngageAndroidManifest');
  if (!props.android.disableMoEngageDefaultBackupFile) {
    withAndroidManifest(config, config => {
      const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
      console.log('Adding manifest application keys');
      manifestApplicationKeys.forEach(item => {
        const key = Object.keys(item)[0];
        if (key !== undefined) {
          const value = (item as any)[key];
          if (!mainApplication.$) {
            const androidName = (mainApplication as any)["android:name"] || "";
            mainApplication.$ = { "android:name": androidName };
          }
          
          if (!(key in mainApplication.$)) {
            mainApplication.$[key] = value;
          }
        }
      });

      return config;
    });
  }

  if (props.android.shouldIncludeMoEngageFirebaseMessagingService) {
    withAndroidManifest(config, config => {
      const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
      if (props.android.isExpoNotificationIntegration) {
        console.log('Adding Expo Notification Service to manifest');
        addServiceToManifestIfNotExist(
          mainApplication, 
          moEngageExpoNotificationServiceEntry, 
          moEngageExpoNotificationServiceName
        );
      } else {
        console.log('Adding MoEngage FCM Service to manifest');
        addServiceToManifestIfNotExist(
          mainApplication,
          moEngageFCMServiceEntry,
          moEngageFCMServiceName
        );
      }

      return config;
    });
  }

  return config;
};


/**
 * Copy all the required resources for MoEngage initialisation to native Android module.
 */
const withMoEngageInitialisationConfigResource: ConfigPlugin<MoEngagePluginProps> = (config, props) => {
  console.log('Running withMoEngageInitialisationConfigResource');
  return withDangerousMod(config, [
    'android',
    async (config) => {
      if (props.android.smallIconPath !== undefined) {
        console.log('Copying small icon:', props.android.smallIconPath);
        await copyFile(props.android.smallIconPath, drawableResourcePath);
      }
      if (props.android.largeIconPath !== undefined) {
        console.log('Copying large icon:', props.android.largeIconPath);
        await copyFile(props.android.largeIconPath, drawableResourcePath);
      }
      
      console.log('Copying config file:', props.android.configFilePath);
      await copyFile(props.android.configFilePath, xmlValuesResourcePath);
      return config;
    },
  ]);
};

/**
 * Add required dependencies to app/build.gradle
 */
const withMoEngageDependencies: ConfigPlugin<MoEngagePluginProps> = (config, props) => {
  if (props.android.includeFirebaseMessagingDependencies) {
    const firebaseMessagingVersion = packageJsonFile.dependencyVersions.firebaseMessaging;
    console.log('Adding Firebase Messaging dependency:', firebaseMessagingVersion);
    return withAppBuildGradle(config, gradleConfig => {
      gradleConfig.modResults.contents = addDependencyToGradle(
        gradleConfig.modResults.contents,
        googleFirebaseMessagingGroup,
        googleFirebaseMessagingModule,
        firebaseMessagingVersion
      );
      return gradleConfig;
    });
  }

  return config;
};

export default withMoEngageAndroid;