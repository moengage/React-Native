import { ConfigPlugin, withDangerousMod } from "@expo/config-plugins";
import { MoEngagePluginProps } from "../types";
import * as fs from 'fs';
import * as path from 'path';
import {
  MOENGAGE_IOS_RICH_PUSH_TARGET,
  MOENGAGE_IOS_PUSH_TEMPLATE_TARGET,
  MOENGAGE_IOS_LIVE_ACTIVITY_TARGET,
  MOENGAGE_IOS_RICH_PUSH_FILES,
  MOENGAGE_IOS_PUSH_TEMPLATE_FILES,
  MOENGAGE_IOS_NOTIFICATION_SERVICE_POD,
  MOENGAGE_IOS_PUSH_TEMPLATE_POD,
  MOENGAGE_IOS_DEVICE_TRIGGER_POD,
  MOENGAGE_IOS_LIVE_ACTIVITY_POD
} from './constants';

const plist = require('plist');

/**
 * MoEngage Expo plugin for iOS - Dangerous modifications
 *
 * This plugin handles file operations that are not directly exposed by the Expo Config Plugin API,
 * including copying Rich Push, Push Templates, and LiveActivity files, and updating the Podfile
 * to include the necessary MoEngage pods for each target.
 *
 * @param config - The Expo config object
 * @param props - The MoEngage plugin properties
 * @returns The updated config object
 */
export const withMoEngageDangerousMod: ConfigPlugin<MoEngagePluginProps> = (config, props) => {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      if (process.env['EXPO_TV']) {
        // Skip modifications for tvOS
        console.log(`Skipping extension targets copy for tvOS`);
        return config;
      }

      const applicationPods: string[] = []
      const projectRoot = config.modRequest.projectRoot;
      const { apple } = props;
      const shouldAddRichPushExtension = apple.richPushNotificationEnabled || apple.pushNotificationImpressionTrackingEnabled || apple.pushTemplatesEnabled;

      /**
       * Extract the KeychainGroupName from the MoEngage configuration file
       *
       * The keychain group is needed for secure data sharing between the main app
       * and extension targets. If present, it's added to the entitlements files
       * for the extension targets.
       */
      let keychainGroupValue = ''
      try {
        const configFilePath = path.join(config.modRequest.projectRoot, props.apple.configFilePath);
        if (fs.existsSync(configFilePath)) {
          const configPlist = plist.parse(fs.readFileSync(configFilePath, 'utf8')) as { [key: string]: any };
          keychainGroupValue = configPlist['KeychainGroupName'] as string;
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
       * Set up the Rich Push Notification Service Extension
       *
       * This extension handles rich push notifications with media attachments and
       * custom notification UI. We:
       * 1. Create the extension directory if it doesn't exist
       * 2. Copy template files from the plugin's resources
       * 3. Update entitlements with keychain access if configured
       * 4. Modify the Podfile to include the MoEngage rich notification dependency
       */
      if (shouldAddRichPushExtension) {
        // Copy Rich Push files to project path.
        const absoluteSource = require.resolve('react-native-expo-moengage/apple/RichPush/NotificationService.swift');
        const sourcePath = path.dirname(absoluteSource);
        const destinationPath = `${projectRoot}/ios/${MOENGAGE_IOS_RICH_PUSH_TARGET}`;
        if (!fs.existsSync(`${destinationPath}`)) {
          fs.mkdirSync(`${destinationPath}`, { recursive: true });
        }
        for (const file of MOENGAGE_IOS_RICH_PUSH_FILES) {
          // Copy keychain group to extension entitlements
          if (keychainGroupValue && keychainGroupValue.length > 0 && file.endsWith('.entitlements')) {
            const entitlements = plist.parse(fs.readFileSync(`${sourcePath}/${file}`, 'utf8'));
            entitlements['keychain-access-groups'] = [keychainGroupValue]
            fs.writeFileSync(`${destinationPath}/${file}`, plist.build(entitlements))
            continue
          }
          fs.copyFileSync(`${sourcePath}/${file}`, `${destinationPath}/${file}`);
        }

        // Modify Podfile to include `MoEngageRichNotification`.
        const podfilePath = `${projectRoot}/ios/Podfile`;
        if (fs.existsSync(podfilePath)) {
          const podfile = fs.readFileSync(podfilePath, 'utf8');
          if (!podfile.includes(MOENGAGE_IOS_RICH_PUSH_TARGET) || !podfile.includes(MOENGAGE_IOS_NOTIFICATION_SERVICE_POD)) {
            const notificationServiceTarget =
              [
                ``,
                `target '${MOENGAGE_IOS_RICH_PUSH_TARGET}' do`,
                `  use_frameworks! :linkage => podfile_properties['ios.useFrameworks'].to_sym if podfile_properties['ios.useFrameworks']`,
                `  use_frameworks! :linkage => ENV['USE_FRAMEWORKS'].to_sym if ENV['USE_FRAMEWORKS']`,
                `  pod '${MOENGAGE_IOS_NOTIFICATION_SERVICE_POD}'`,
                `end`
              ].join('\n');
            fs.appendFileSync(podfilePath, notificationServiceTarget);
          }
        }
      }

      /**
       * Set up the Push Templates Notification Content Extension
       *
       * This extension enables custom notification UI templates for push notifications.
       * The setup process includes:
       * 1. Creating the extension directory if it doesn't exist
       * 2. Copying template files from the plugin's resources
       * 3. Updating entitlements with keychain access if configured
       * 4. Modifying the Podfile to include the MoEngage push template dependency
       */
      if (apple.pushTemplatesEnabled) {
        // Copy Push Template files to project path.
        const absoluteSource = require.resolve('react-native-expo-moengage/apple/PushTemplates/NotificationViewController.swift');
        const sourcePath = path.dirname(absoluteSource);
        const destinationPath = `${projectRoot}/ios/${MOENGAGE_IOS_PUSH_TEMPLATE_TARGET}`;
        if (!fs.existsSync(`${destinationPath}`)) {
          fs.mkdirSync(`${destinationPath}`, { recursive: true });
        }
        for (const file of MOENGAGE_IOS_PUSH_TEMPLATE_FILES) {
          // Copy keychain group to extension entitlements
          if (keychainGroupValue && keychainGroupValue.length > 0 && file.endsWith('.entitlements')) {
            const entitlements = plist.parse(fs.readFileSync(`${sourcePath}/${file}`, 'utf8'));
            entitlements['keychain-access-groups'] = [keychainGroupValue]
            fs.writeFileSync(`${destinationPath}/${file}`, plist.build(entitlements))
            continue
          }
          fs.copyFileSync(`${sourcePath}/${file}`, `${destinationPath}/${file}`);
        }

        // Modify Podfile to include `MoEngageRichNotification`.
        const podfilePath = `${projectRoot}/ios/Podfile`;
        if (fs.existsSync(podfilePath)) {
          const podfile = fs.readFileSync(podfilePath, 'utf8');
          if (!podfile.includes(MOENGAGE_IOS_PUSH_TEMPLATE_TARGET) || !podfile.includes(MOENGAGE_IOS_PUSH_TEMPLATE_POD)) {
            const pushTemplateTarget =
              [
                ``,
                `target '${MOENGAGE_IOS_PUSH_TEMPLATE_TARGET}' do`,
                `  use_frameworks! :linkage => podfile_properties['ios.useFrameworks'].to_sym if podfile_properties['ios.useFrameworks']`,
                `  use_frameworks! :linkage => ENV['USE_FRAMEWORKS'].to_sym if ENV['USE_FRAMEWORKS']`,
                `  pod '${MOENGAGE_IOS_PUSH_TEMPLATE_POD}'`,
                `end`
              ].join('\n');
            fs.appendFileSync(podfilePath, pushTemplateTarget);
          }
        }
      }

      /**
       * Set up Live Activity support
       *
       * Live Activities allow apps to display persistent, interactive notifications
       * on the lock screen and in the Dynamic Island on supported devices.
       *
       * This section:
       * 1. Adds the MoEngageLiveActivity pod to the main app target
       * 2. Creates a LiveActivity extension target in the Podfile if needed
       * 3. Configures the pod dependencies for the LiveActivity extension
       */
      if (apple.liveActivityTargetPath && apple.liveActivityTargetPath.length) {
        // Add MoEngageLiveActivity pod to the Podfile
        applicationPods.push(`  pod '${MOENGAGE_IOS_LIVE_ACTIVITY_POD}'`)
        const podfilePath = path.join(projectRoot, 'ios', 'Podfile');
        if (fs.existsSync(podfilePath)) {
          const podfile = fs.readFileSync(podfilePath, 'utf8');

          if (!podfile.includes(MOENGAGE_IOS_LIVE_ACTIVITY_TARGET)) {
            const liveActivityTarget = [
              ``,
              `target '${MOENGAGE_IOS_LIVE_ACTIVITY_TARGET}' do`,
              `  use_frameworks! :linkage => podfile_properties['ios.useFrameworks'].to_sym if podfile_properties['ios.useFrameworks']`,
              `  use_frameworks! :linkage => ENV['USE_FRAMEWORKS'].to_sym if ENV['USE_FRAMEWORKS']`,
              `  pod '${MOENGAGE_IOS_LIVE_ACTIVITY_POD}'`,
              `end`
            ].join('\n');

            fs.appendFileSync(podfilePath, liveActivityTarget);
            console.log(`Added MoEngageLiveActivity pod to Podfile for ${MOENGAGE_IOS_LIVE_ACTIVITY_TARGET} target`);
          }
        }
      }

      /**
       * Set up Device Trigger support
       *
       * Device Triggers allow campaigns to be triggered based on device events,
       * without requiring server communication. This is useful for real-time
       * engagement based on user actions within the app.
       *
       * If enabled, we add the MoEngage RealTimeTrigger pod to the main application.
       */
      if (apple.deviceTriggerEnabled) {
        applicationPods.push(`  pod '${MOENGAGE_IOS_DEVICE_TRIGGER_POD}'`)
      }

      /**
       * Update the main application's Podfile with MoEngage dependencies
       *
       * This section adds any accumulated MoEngage pods to the main application target
       * in the Podfile. It:
       * 1. Finds the main application target section in the Podfile
       * 2. Locates a suitable insertion point before existing dependencies
       * 3. Inserts the MoEngage pod declarations
       */
      if (applicationPods && applicationPods.length) {
        const podfilePath = `${projectRoot}/ios/Podfile`;
        if (fs.existsSync(podfilePath)) {
          const podfile = fs.readFileSync(podfilePath, 'utf8');
          if (!podfile.includes(MOENGAGE_IOS_DEVICE_TRIGGER_POD)) {
            // Find the main target and add the pod there
            const lines = podfile.split('\n');
            let mainTargetIndex = -1;

            // Find the main application target
            for (let i = 0; i < lines.length; i++) {
              if (lines[i]?.includes('target') && lines[i]?.includes('do') &&
                !lines[i]?.includes(MOENGAGE_IOS_RICH_PUSH_TARGET) &&
                !lines[i]?.includes(MOENGAGE_IOS_PUSH_TEMPLATE_TARGET)) {
                mainTargetIndex = i;
                break;
              }
            }

            if (mainTargetIndex !== -1) {
              // Find the end of the dependency section
              let dependenciesEndIndex = -1;
              for (let i = mainTargetIndex; i < lines.length; i++) {
                if (lines[i]?.includes('use_native_modules') ||
                  lines[i]?.includes('use_react_native') ||
                  lines[i]?.includes('post_install')) {
                  dependenciesEndIndex = i;
                  break;
                }
              }

              if (dependenciesEndIndex !== -1) {
                // Insert the application pods before the end of the target
                lines.splice(dependenciesEndIndex, 0, ...applicationPods);
                fs.writeFileSync(podfilePath, lines.join('\n'));
              }
            }
          }
        }
      }

      return config;
    },
  ]);
};
