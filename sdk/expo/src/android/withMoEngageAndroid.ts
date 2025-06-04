import { ConfigPlugin } from '@expo/config-plugins';
import { MoEngagePluginProps } from '../types';

const withMoEngageAndroid: ConfigPlugin<MoEngagePluginProps> = (config, _) => {
  return config;
};

export default withMoEngageAndroid;