import { withAndroidManifest, ConfigPlugin } from '@expo/config-plugins';
import { MoEngagePluginProps } from './types';
import { MoEngageLogger } from 'react-native-moengage';

const withMoEngageAndroid: ConfigPlugin<MoEngagePluginProps> = (config, props) => {
  MoEngageLogger.debug('withMoEngageAndroid', props);
  return withAndroidManifest(config, async (androidManifest) => {
    return androidManifest;
  });
};

export default withMoEngageAndroid;