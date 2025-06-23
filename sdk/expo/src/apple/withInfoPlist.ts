import { ConfigPlugin, withInfoPlist } from "@expo/config-plugins";
import { MoEngagePluginProps } from "../types";
import * as fs from 'fs';
import * as path from 'path';

const plist = require('plist');

export const withMoEngageInfoPlist: ConfigPlugin<MoEngagePluginProps> = (config, props) => {
  return withInfoPlist(config, (config) => {
    const { apple } = props;

    // Initialize MoEngage configuration in Info.plist
    config.modResults['MoEngage'] = config.modResults['MoEngage'] || {};

    // Import configuration from plist file if specified
    try {
      const configFilePath = path.join(config.modRequest.projectRoot, apple.configFilePath);
      if (fs.existsSync(configFilePath)) {
        const configPlist = plist.parse(fs.readFileSync(configFilePath, 'utf8'));

        // Merge the configuration from the plist file with existing MoEngage settings
        config.modResults['MoEngage'] = {
          ...config.modResults['MoEngage'] as { [key: string]: any },
          ...configPlist
        };
      } else {
        console.warn(`MoEngage configuration does not exist`);
      }
    } catch (e) {
      console.warn(`Could not import MoEngage configuration: ${e}`);
    }

    // Set up Live Activities support if enabled
    if (!process.env['EXPO_TV'] && apple.liveActivityTargetPath && apple.liveActivityTargetPath.length) {
        config.modResults['NSSupportsLiveActivities'] = true;
    }

    return config;
  });
};
