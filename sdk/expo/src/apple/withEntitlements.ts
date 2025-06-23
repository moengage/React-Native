import { ConfigPlugin, withEntitlementsPlist } from "@expo/config-plugins";
import { MoEngagePluginProps } from "../types";
import * as fs from 'fs';
import * as path from 'path';

const plist = require('plist');

export const withMoEngageEntitlements: ConfigPlugin<MoEngagePluginProps> = (config, props) => {
  return withEntitlementsPlist(config, (config) => {
    // Import configuration from plist file if specified
    try {
      const configFilePath = path.join(config.modRequest.projectRoot, props.apple.configFilePath);
      if (fs.existsSync(configFilePath)) {
        const configPlist = plist.parse(fs.readFileSync(configFilePath, 'utf8')) as { [key: string]: any };

        // Add the app group to the main application target's entitlements if rich push or push templates are enabled
        const appGroupsKey = 'com.apple.security.application-groups';
        const appGroupValue = configPlist['AppGroupName'] as string;
        if (props.apple.pushTemplatesEnabled || props.apple.richPushNotificationEnabled || props.apple.pushNotificationImpressionTrackingEnabled) {
          if (appGroupValue && appGroupValue.length > 0) {
            const existingAppGroups = config.modResults[appGroupsKey];
            if (Array.isArray(existingAppGroups)) {
              if (!existingAppGroups.includes(appGroupValue)) {
                config.modResults[appGroupsKey] = existingAppGroups.concat([appGroupValue]);
              }
            } else {
              config.modResults[appGroupsKey] = [appGroupValue];
            }
          } else {
            console.warn(`Missing AppGroupName key in MoEngage configuration`);
          }
        }

        // Add the keychain access groups to the main application target's entitlements if specified
        const keychainGroupsKey = 'keychain-access-groups';
        const keychainGroupValue = configPlist['KeychainGroupName'] as string;
        if (keychainGroupValue && keychainGroupValue.length > 0) {
          const existingKeychainGroups = config.modResults[keychainGroupsKey];
          if (Array.isArray(existingKeychainGroups)) {
            if (!existingKeychainGroups.includes(keychainGroupValue)) {
              config.modResults[keychainGroupsKey] = existingKeychainGroups.concat([keychainGroupValue]);
            }
          } else {
            config.modResults[keychainGroupsKey] = [keychainGroupValue];
          }
        }
      } else {
        console.warn(`MoEngage configuration does not exist`);
      }
    } catch (e) {
      console.warn(`Could not import MoEngage configuration: ${e}`);
    }
    return config;
  });
};
