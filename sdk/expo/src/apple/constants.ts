/**
 * Constants used in the MoEngage iOS implementation
 *
 * This file contains all the constants needed for configuring the MoEngage SDK for iOS,
 * including target names, file lists, and pod dependencies.
 */

/**
 * Target names for the extension targets in Xcode
 * These names are used when creating extension targets in the Xcode project
 * and must match the names used in entitlements and Info.plist files
 */
export const MOENGAGE_IOS_RICH_PUSH_TARGET = 'MoEngageExpoRichPush';
export const MOENGAGE_IOS_PUSH_TEMPLATE_TARGET = 'MoEngageExpoPushTemplates';
export const MOENGAGE_IOS_LIVE_ACTIVITY_TARGET = 'MoEngageExpoLiveActivity';

/**
 * Files required for the Rich Push Notification Service Extension
 * These files are copied from the plugin's resources to the Xcode project
 * and added to the Rich Push target
 */
export const MOENGAGE_IOS_RICH_PUSH_FILES = [
  'NotificationService.swift',
  `${MOENGAGE_IOS_RICH_PUSH_TARGET}-Info.plist`,
  `${MOENGAGE_IOS_RICH_PUSH_TARGET}.entitlements`
];

/**
 * Files required for the Push Templates Notification Content Extension
 * These files are copied from the plugin's resources to the Xcode project
 * and added to the Push Templates target
 */
export const MOENGAGE_IOS_PUSH_TEMPLATE_FILES = [
  'MainInterface.storyboard',
  'NotificationViewController.swift',
  `${MOENGAGE_IOS_PUSH_TEMPLATE_TARGET}-Info.plist`,
  `${MOENGAGE_IOS_PUSH_TEMPLATE_TARGET}.entitlements`
];

/**
 * CocoaPods dependencies for each feature
 * These pod specifications are added to the Podfile for each target
 * that requires the functionality
 */
export const MOENGAGE_IOS_NOTIFICATION_SERVICE_POD = 'MoEngage-iOS-SDK/RichNotification';  // For Rich Push Notification Service Extension
export const MOENGAGE_IOS_PUSH_TEMPLATE_POD = 'MoEngage-iOS-SDK/RichNotification';  // For Push Templates Notification Content Extension
export const MOENGAGE_IOS_DEVICE_TRIGGER_POD = 'MoEngage-iOS-SDK/RealTimeTrigger';  // For Device-based campaign triggers
export const MOENGAGE_IOS_LIVE_ACTIVITY_POD = 'MoEngage-iOS-SDK/LiveActivity';  // For LiveActivity support
