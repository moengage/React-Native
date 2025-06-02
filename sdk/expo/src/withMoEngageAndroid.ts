import { withAndroidManifest, ConfigPlugin } from '@expo/config-plugins';
import { MoEngagePluginProps } from './types';

const withMoEngageAndroid: ConfigPlugin<MoEngagePluginProps> = (config, props) => {
  console.log(props)
  return withAndroidManifest(config, async (androidManifest) => {
    return androidManifest;
  });
};

export default withMoEngageAndroid;