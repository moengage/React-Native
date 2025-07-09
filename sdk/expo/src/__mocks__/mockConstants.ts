export const mockConfig = { name: 'test', modResults: {} } as any;

export const mockProps = {
  android: {
    disableMoEngageDefaultBackupFile: false,
    isExpoNotificationIntegration: false,
    shouldIncludeMoEngageFirebaseMessagingService: false,
    includeFirebaseMessagingDependencies: false,
    configFilePath: 'assets/moengage/android_initilisation_config.xml',
  },
  apple: {
    configFilePath: 'assets/moengage/MoEngage-Config.plist',
    pushNotificationImpressionTrackingEnabled: true,
    richPushNotificationEnabled: false,
    pushTemplatesEnabled: false,
    deviceTriggerEnabled: false,
    liveActivityTargetPath: '',
  },
};

export function getMockManifest() {
  return {
    '$': {
      'android:name': '.MainApplication'
    },
    service: [],
    activity: []
  };
}

export const MoEExpoFireBaseMessagingService = 'expo.modules.moengage.MoEExpoFireBaseMessagingService';
export const MoEFireBaseMessagingService = 'com.moengage.firebase.MoEFireBaseMessagingService';
export const FIREBASE_MESSAGING_DEPENDENCY = 'com.google.firebase:firebase-messaging';