/**
 * MoEngage Android configuration options
 */
export interface MoEngageAndroidConfig {
  /**
   * Path to the Android configuration XML file
   * @default "assets/moengage/android_initilisation_config.xml"
   */
  configFilePath: string;

  /**
   * Path to the small notification icon
   */
  smallIconPath?: string;

  /**
   * Path to the large notification icon
   */
  largeIconPath?: string;

  /**
   * Whether to disable MoEngage default backup file
   * @default false
   */
  disableMoEngageDefaultBackupFile?: boolean;

  /**
   * Whether using the expo notification package for push notifications or not.
   * @default false
   */
  isExpoNotificationIntegration?: boolean;

  /**
   * Whether to include MoEngage FirebaseMessagingService in the AndroidManifest.xml
   * @default false
   */
  shouldIncludeMoEngageFirebaseMessagingService?: boolean;

  /**
   * Whether to include Firebase Messaging dependencies in the project
   * @default false
   */
  includeFirebaseMessagingDependencies?: boolean;
}

/**
 * MoEngage iOS configuration options
 */
export interface MoEngageIosConfig {
  /**
   * Path to the MoEngage configuration plist file.
   * The data in this plist file is added to the MoEngage key in application's Info.plist
   * @default "assets/moengage/MoEngage-Config.plist"
   */
  configFilePath: string;

  /**
   * Whether to enable push notification impression tracking
   * @default true
   */
  pushNotificationImpressionTrackingEnabled: boolean;

  /**
   * Whether to enable rich push notifications
   * @default false
   */
  richPushNotificationEnabled: boolean;

  /**
   * Whether to enable push templates
   * @default false
   */
  pushTemplatesEnabled: boolean;

  /**
   * Whether to enable device triggers
   * @default false
   */
  deviceTriggerEnabled: boolean;

  /**
   * Path to the Live Activity target
   */
  liveActivityTargetPath?: string;
}

/**
 * MoEngage plugin configuration
 */
export interface MoEngagePluginProps {
  /**
   * Android-specific configuration options
   */
  android: MoEngageAndroidConfig;

  /**
   * iOS-specific configuration options
   */
  apple: MoEngageIosConfig;
}