import { ConfigPlugin, createRunOncePlugin } from '@expo/config-plugins';
import withMoEngageAndroid from './android/withMoEngageAndroid';
import { withMoEngageIos } from './apple';
import { MoEngagePluginProps } from './types';

const defaultProps: MoEngagePluginProps = {
  android: {
    disableMoEngageDefaultBackupFile: false,
    isExpoNotificationIntegration: false,
    shouldIncludeMoEngageFirebaseMessagingService: false,
    includeFirebaseMessagingDependencies: false,
    configFilePath: 'assets/moengage/android_initilisation_config.xml',
  },
  apple: {
    configFilePath: 'assets/moengage/MoEngage-Config.plist',
    pushNotificationImpressionTrackingEnabled: true,
    richPushNotificationEnabled: false,
    pushTemplatesEnabled: false,
    deviceTriggerEnabled: false,
    liveActivityTargetPath: '',
  },
};

/**
 * Configure MoEngage SDK in your Expo app
 */
const withMoEngage: ConfigPlugin<MoEngagePluginProps | undefined> = (config, props) => {
  // Apply default values or handle undefined props
  const pluginProps: MoEngagePluginProps = props ? {
    ...defaultProps,
    ...props,
    android: {
      ...defaultProps.android,
      ...props.android,
    },
    apple: {
      ...defaultProps.apple,
      ...props.apple,
    },
  } : defaultProps
  config = withMoEngageAndroid(config, pluginProps);
  config = withMoEngageIos(config, pluginProps);
  return config;
};

const pkg = require('../package.json');

export default createRunOncePlugin(
  withMoEngage,
  pkg.name,
  pkg.version
);
