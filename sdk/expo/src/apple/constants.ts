/**
 * Constants used in the MoEngage iOS implementation
 */

// Target names for the various extensions
export const MOENGAGE_IOS_RICH_PUSH_TARGET = 'MoEngageExpoRichPush';
export const MOENGAGE_IOS_PUSH_TEMPLATE_TARGET = 'MoEngageExpoPushTemplates';
export const MOENGAGE_IOS_LIVE_ACTIVITY_TARGET = 'MoEngageExpoLiveActivity';

// Files required for the rich push target
export const MOENGAGE_IOS_RICH_PUSH_FILES = [
  'NotificationService.swift',
  `${MOENGAGE_IOS_RICH_PUSH_TARGET}-Info.plist`,
  `${MOENGAGE_IOS_RICH_PUSH_TARGET}.entitlements`
];

// Files required for the push templates target
export const MOENGAGE_IOS_PUSH_TEMPLATE_FILES = [
  'MainInterface.storyboard',
  'NotificationViewController.swift',
  `${MOENGAGE_IOS_PUSH_TEMPLATE_TARGET}-Info.plist`,
  `${MOENGAGE_IOS_PUSH_TEMPLATE_TARGET}.entitlements`
];

// CocoaPods to install
export const MOENGAGE_IOS_NOTIFICATION_SERVICE_POD = 'MoEngage-iOS-SDK/RichNotification';
export const MOENGAGE_IOS_PUSH_TEMPLATE_POD = 'MoEngage-iOS-SDK/RichNotification';
export const MOENGAGE_IOS_DEVICE_TRIGGER_POD = 'MoEngage-iOS-SDK/RealTimeTrigger';
export const MOENGAGE_IOS_LIVE_ACTIVITY_POD = 'MoEngage-iOS-SDK/LiveActivity';
