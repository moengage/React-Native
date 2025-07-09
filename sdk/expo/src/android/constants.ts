import { StringBoolean } from "@expo/config-plugins/build/android/Manifest";
import { ManifestApplicationKey } from "./types";

export const manifestApplicationKeys: ManifestApplicationKey[] = [
    { "android:fullBackupContent": "@xml/com_moengage_backup_descriptor" },
    { "android:dataExtractionRules": "@xml/com_moengage_data_extraction_rules" }
];

/**
 * Common intent-filter for MoEngage FCM/Expo Notification services
 */
export const moEngageMessagingIntentFilter = [
  {
    action: [
      {
        $: {
          'android:name': 'com.google.firebase.MESSAGING_EVENT',
        },
      },
    ],
  },
];

/**
 * Service entry for MoEngage Push Notification handling with fcm integration
 */
export const moEngageFCMServiceName = 'com.moengage.firebase.MoEFireBaseMessagingService';
export const moEngageFCMServiceEntry = {
    $: {
        'android:name': moEngageFCMServiceName,
        'android:exported': 'false' as StringBoolean,
    },
    'intent-filter': moEngageMessagingIntentFilter,
};

/**
 * Service entry for MoEngage Push Notification handling  with expo notification integration
 */
export const moEngageExpoNotificationServiceName = 'expo.modules.moengage.MoEExpoFireBaseMessagingService';
export const moEngageExpoNotificationServiceEntry = {
    $: {
        'android:name': moEngageExpoNotificationServiceName,
        'android:exported': 'false' as StringBoolean,
    },
    'intent-filter': moEngageMessagingIntentFilter,
};

export const drawableResourcePath = './android/app/src/main/res/drawable';
export const xmlValuesResourcePath = './android/app/src/main/res/values';

export const googleFirebaseMessagingGroup = 'com.google.firebase';
export const googleFirebaseMessagingModule = 'firebase-messaging';