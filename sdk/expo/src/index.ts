import { ConfigPlugin } from '@expo/config-plugins';
import withMoEngageAndroid from './withMoEngageAndroid';
import withMoEngageIos from './withMoEngageIos';

const withMoEngage: ConfigPlugin = (config) => {
  config = withMoEngageAndroid(config);
  config = withMoEngageIos(config);
  return config;
};

export default withMoEngage;