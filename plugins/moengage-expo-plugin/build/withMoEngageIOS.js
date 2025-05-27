"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withMoEngageIOS = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const plist_1 = __importDefault(require("@expo/plist"));
const withMoEngageIOS = (config, props) => {
    // Add MoEngage configuration to Info.plist
    config = (0, config_plugins_1.withInfoPlist)(config, (config) => {
        const iOS = props.iOS || {};
        // Create MoEngage dictionary if it doesn't exist
        if (!config.modResults.MoEngage) {
            config.modResults.MoEngage = {};
        }
        // Cast to any to avoid TypeScript errors with spreading
        const moEngageConfig = config.modResults.MoEngage;
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
        // Extract data from custom configuration file if specified
        if (iOS.configFilePath) {
            try {
                const projectRoot = config.modRequest.projectRoot;
                const sourcePath = path_1.default.join(projectRoot, iOS.configFilePath);
                if (fs_1.default.existsSync(sourcePath)) {
                    // Parse the plist file
                    const configFileContent = fs_1.default.readFileSync(sourcePath, 'utf8');
                    const parsedPlist = plist_1.default.parse(configFileContent);
                    // Extract MoEngage configuration if it exists in the plist
                    if (parsedPlist.MoEngage) {
                        // Merge the configuration from the plist file with our existing config
                        Object.assign(moEngageConfig, parsedPlist.MoEngage);
                    }
                    else {
                        // If there's no MoEngage key, use the entire plist content
                        Object.assign(moEngageConfig, parsedPlist);
                    }
                    console.log(`Successfully extracted MoEngage configuration from ${iOS.configFilePath}`);
                }
                else {
                    console.warn(`MoEngage iOS config file not found at: ${sourcePath}`);
                }
            }
            catch (error) {
                console.error(`Error parsing MoEngage iOS config file: ${error}`);
            }
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
    config = (0, config_plugins_1.withAppDelegate)(config, (config) => {
        const appDelegate = config.modResults;
        // Import needed headers
        if (!appDelegate.contents.includes('#import <MoEngageSDK/MoEngageSDK.h>')) {
            appDelegate.contents = appDelegate.contents.replace('#import "AppDelegate.h"', '#import "AppDelegate.h"\n#import <MoEngageSDK/MoEngageSDK.h>');
        }
        // Add didFinishLaunchingWithOptions implementation if not present
        if (!appDelegate.contents.includes('MoEngageSDKConfig')) {
            const launchOptionsRegex = /(\s*return\s+YES\s*;\s*})/g;
            // Use initialization with plist file since we don't have appId
            const moengageInitCode = `
  // Initialize MoEngage from config file
  [[MoEngageInitializer sharedInstance] initializeDefaultSDKWithLaunchOptions:launchOptions];
\n$1`;
            appDelegate.contents = appDelegate.contents.replace(launchOptionsRegex, moengageInitCode);
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
    config = (0, config_plugins_1.withXcodeProject)(config, (config) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // Add Live Activity target if specified
        if ((_a = props.iOS) === null || _a === void 0 ? void 0 : _a.liveActivityTargetPath) {
            // This would require a more complex implementation using the Xcode APIs
            console.log(`Live Activity target path specified: ${props.iOS.liveActivityTargetPath}`);
            console.log('Note: Live Activity integration requires manual steps in Xcode after prebuild');
        }
        return config;
    }));
    return config;
};
exports.withMoEngageIOS = withMoEngageIOS;
