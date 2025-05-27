import {
  ConfigPlugin,
  withAppDelegate,
  withInfoPlist,
  withXcodeProject,
  withDangerousMod
} from '@expo/config-plugins';
import { MoEngagePluginProps } from '.';
import fs from 'fs';
import path from 'path';
import plist from '@expo/plist';

export const withMoEngageIOS: ConfigPlugin<MoEngagePluginProps> = (config, props) => {
  // Add MoEngage configuration to Info.plist
  config = withInfoPlist(config, (config) => {
    const iOS = props.iOS || {};

    // Create MoEngage dictionary if it doesn't exist
    if (!config.modResults.MoEngage) {
      config.modResults.MoEngage = {};
    }
    
    // Cast to any to avoid TypeScript errors with spreading
    const moEngageConfig = config.modResults.MoEngage as Record<string, any>;
    
    // Set iOS-specific parameters from the contract
    if (iOS.pushNotificationImpressionTracking !== undefined) {
      moEngageConfig.PUSH_NOTIFICATION_IMPRESSION_TRACKING = iOS.pushNotificationImpressionTracking;
    }

    if (iOS.richPushNotification !== undefined) {
      moEngageConfig.RICH_PUSH_NOTIFICATION = iOS.richPushNotification;
    }

    if (iOS.deviceTriggerEnabled !== undefined) {
      moEngageConfig.DEVICE_TRIGGER_ENABLED = iOS.deviceTriggerEnabled;
    }

    // Update the Info.plist
    config.modResults.MoEngage = moEngageConfig;

    // For push notifications
    const existingTypes = config.modResults.UIBackgroundModes || [];
    if (!existingTypes.includes('remote-notification')) {
      config.modResults.UIBackgroundModes = [...existingTypes, 'remote-notification'];
    }

    return config;
  });

  // Setup app delegate to initialize MoEngage
  config = withAppDelegate(config, (config) => {
    const appDelegate = config.modResults;
    
    // Import needed headers
    if (!appDelegate.contents.includes('#import <MoEngageSDK/MoEngageSDK.h>')) {
      appDelegate.contents = appDelegate.contents.replace(
        '#import "AppDelegate.h"',
        '#import "AppDelegate.h"\n#import <MoEngageSDK/MoEngageSDK.h>'
      );
    }

    // Add didFinishLaunchingWithOptions implementation if not present
    if (!appDelegate.contents.includes('MoEngageSDKConfig')) {
      const launchOptionsRegex = /(\s*return\s+YES\s*;\s*})/g;
      
      // Use initialization with plist file since we don't have appId
      const moengageInitCode = `
  // Initialize MoEngage from config file
  [[MoEngageInitializer sharedInstance] initializeDefaultSDKWithLaunchOptions:launchOptions];
\n$1`;
      
      appDelegate.contents = appDelegate.contents.replace(
        launchOptionsRegex,
        moengageInitCode
      );
    }
    
    // Add user notification delegate methods if needed
    if (!appDelegate.contents.includes('userNotificationCenter:didReceiveNotificationResponse:')) {
      const importRegex = /#import <React\/RCTRootView.h>/g;
      const userNotificationImport = `#import <React/RCTRootView.h>
#import <UserNotifications/UserNotifications.h>

@interface AppDelegate () <UNUserNotificationCenterDelegate>
@end`;
      
      appDelegate.contents = appDelegate.contents.replace(importRegex, userNotificationImport);
      
      // Add UNUserNotificationCenterDelegate implementation
      const implementationEndRegex = /@end/g;
      const userNotificationDelegateMethods = `

#pragma mark - UNUserNotificationCenterDelegate Methods
- (void)userNotificationCenter:(UNUserNotificationCenter *)center 
didReceiveNotificationResponse:(UNNotificationResponse *)response 
         withCompletionHandler:(void (^)(void))completionHandler {
  [[MoEngage sharedInstance] userNotificationCenter:center 
                     didReceiveNotificationResponse:response 
                              withCompletionHandler:completionHandler];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center 
       willPresentNotification:(UNNotification *)notification 
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler {
  [[MoEngage sharedInstance] userNotificationCenter:center 
                            willPresentNotification:notification 
                              withCompletionHandler:completionHandler];
}

@end`;
      
      appDelegate.contents = appDelegate.contents.replace(implementationEndRegex, userNotificationDelegateMethods);
    }

    return config;
  });

  // Configure Xcode project for MoEngage dependencies and Live Activity target
  config = withXcodeProject(config, async (config) => {
    // Add Live Activity target if specified
    if (props.iOS?.liveActivityTargetPath) {
      // This would require a more complex implementation using the Xcode APIs
      console.log(`Live Activity target path specified: ${props.iOS.liveActivityTargetPath}`);
      console.log('Note: Live Activity integration requires manual steps in Xcode after prebuild');
    }
    
    return config;
  });

  return config;
};