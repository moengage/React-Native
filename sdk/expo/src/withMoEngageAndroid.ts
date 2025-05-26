import { withAndroidManifest, ConfigPlugin } from '@expo/config-plugins';

const withMoEngageAndroid: ConfigPlugin = (config) => {
  return withAndroidManifest(config, async (androidManifest) => {
    return androidManifest;
  });
};

export default withMoEngageAndroid;