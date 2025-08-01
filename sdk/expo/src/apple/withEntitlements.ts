import { ConfigPlugin, withEntitlementsPlist } from "@expo/config-plugins";
import { MoEngagePluginProps } from "../types";
import * as fs from 'fs';
import * as path from 'path';

const plist = require('plist');

/**
 * MoEngage Expo plugin for iOS - Entitlements modifications
 *
 * This plugin configures the app's entitlements file to enable MoEngage features by:
 * 1. Reading the AppGroupName from the MoEngage configuration file
 * 2. Adding app groups to entitlements for push notifications and extensions
 * 3. Setting up keychain sharing if configured
 * 4. Adding any other required entitlements for MoEngage features
 *
 * @param config - The Expo config object
 * @param props - The MoEngage plugin properties
 * @returns The updated config with modified entitlements
 */
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
            const message = `Missing AppGroupName key in MoEngage configuration`;
            console.error(message);
            throw new Error(message);
          }
        }

        // Add the keychain access groups to the main application target's entitlements if specified
        const keychainGroupsKey = 'keychain-access-groups';
        const keychainGroupValue = configPlist['KeychainGroupName'] as string;
        const isStorageEncryptionEnabled = configPlist['IsStorageEncryptionEnabled'] as boolean;
        if (isStorageEncryptionEnabled && (!keychainGroupValue || keychainGroupValue.length == 0)) {
          const message = `KeychainGroupName in "${configFilePath}" is required when IsStorageEncryptionEnabled is true`;
          console.error(message);
          throw new Error(message);
        }

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
        const message = `MoEngage configuration does not exist`;
        console.error(message);
        throw new Error(message);
      }
    } catch (e) {
      const message = `Could not import MoEngage configuration: ${e}`;
      console.error(message);
      throw new Error(message);
    }
    return config;
  });
};
