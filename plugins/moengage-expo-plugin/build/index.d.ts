import { ConfigPlugin } from '@expo/config-plugins';
export interface MoEngagePluginProps {
    /**
     * Android-specific configuration options
     */
    android?: {
        /**
         * Path to the Android initialization config XML file (optional)
         * Default: "assets/moengage/android_initilisation_config.xml"
         */
        configFilePath?: string;
        /**
         * Path to small notification icon for Android
         */
        smallIconPath?: string;
        /**
         * Path to large notification icon for Android
         */
        largeIconPath?: string;
        /**
         * Whether to disable MoEngage default backup file (optional)
         * Default: false
         */
        disableMoEngageDefaultBackupFile?: boolean;
    };
    /**
     * iOS-specific configuration options
     */
    iOS?: {
        /**
         * Path to the iOS initialization config PLIST file (optional)
         * Default: "assets/moengage/MoEngage-Config.plist"
         */
        configFilePath?: string;
        /**
         * Whether to track push notification impressions (optional)
         * Default: true
         */
        pushNotificationImpressionTracking?: boolean;
        /**
         * Whether to enable rich push notifications (optional)
         * Default: false
         */
        richPushNotification?: boolean;
        /**
         * Whether to enable device triggers (optional)
         * Default: false
         */
        deviceTriggerEnabled?: boolean;
        /**
         * Path to the live activity target (optional)
         */
        liveActivityTargetPath?: string;
    };
}
declare const _default: ConfigPlugin<MoEngagePluginProps>;
export default _default;
