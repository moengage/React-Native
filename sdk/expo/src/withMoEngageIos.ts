import { withInfoPlist, ConfigPlugin } from '@expo/config-plugins';

const withMoEngageIos: ConfigPlugin = (config) => {
  return withInfoPlist(config, async (infoPlist) => {
    return infoPlist;
  });
};

export default withMoEngageIos;