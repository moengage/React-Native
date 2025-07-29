import { ConfigPlugin, withInfoPlist } from "@expo/config-plugins";
import { MoEngagePluginProps } from "../types";
import * as fs from 'fs';
import * as path from 'path';

const plist = require('plist');

/**
 * MoEngage Expo plugin for iOS - Info.plist modifications
 *
 * This plugin configures the Info.plist file with MoEngage settings, including:
 * 1. Importing configuration from the MoEngage plist file
 * 2. Setting up notification service extensions
 * 3. Configuring required app settings for MoEngage SDK
 *
 * @param config - The Expo config object
 * @param props - The MoEngage plugin properties
 * @returns The updated config with Info.plist modifications
 */
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
        const message = `MoEngage configuration does not exist`;
        console.error(message);
        throw new Error(message);
      }
    } catch (e) {
      const message = `Could not import MoEngage configuration: ${e}`;
      console.error(message);
      throw new Error(message);
    }

    /**
     * Set up Live Activities support in the Info.plist if enabled
     *
     * This adds the NSSupportsLiveActivities key to Info.plist, which is required
     * for the app to support Live Activities on iOS. We only enable this if:
     * 1. The app is not a tvOS app (Live Activities aren't supported on tvOS)
     * 2. A Live Activity target path has been specified in the plugin configuration
     */
    if (!process.env['EXPO_TV'] && apple.liveActivityTargetPath && apple.liveActivityTargetPath.length) {
        config.modResults['NSSupportsLiveActivities'] = true;
    }

    return config;
  });
};
