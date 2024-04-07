import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {

  /**
   * Initialise the MoEngage SDK, once the hybrid component is mounted
   * 
   * @param payload Stringified JSON payload
   * 
   */
  initialize: (payload: string) => void;

  /**
   * Tells the SDK whether this is a migration or a fresh installation.
   * 
   * @param payload Stringified JSON payload
   * 
   */
  setAppStatus: (payload: string) => void;

  /**
   * Tracks the specified event
   * 
   * @param payload Stringified JSON payload
   * 
   */
  trackEvent: (payload: string) => void;

  /**
   * Sets the user specific attribute.
   * 
   * @param payload Stringified JSON payload
   * 
   */
  setUserAttribute: (payload: string) => void;

  /**
   * 
   * Update user's unique id which was previously set by setUserUniqueID()
   * 
   * @param payload Stringified JSON payload
   * 
   */
  setAlias: (payload: string) => void;

  /**
   * Notifys the SDK that the user has logged out of the app.
   * 
   * @param payload Stringified JSON payload
   * 
   */
  logout: (payload: string) => void;

  /**
   * Call this method wherever InApp message has to be shown, if available
   * 
   * @param payload Stringified JSON payload
   * 
   */
  showInApp: (payload: string) => void;

  /**
   * Call This method to show the nudge
   * 
   * @param payload Stringified JSON payload
   * 
   */
  showNudge: (payload: string) => void;

  /**
   * Call this method to get the campaign info for self handled inApps
   * 
   * @param payload Stringified JSON payload
   * 
   */
  getSelfHandledInApp: (payload: string) => void;

  /**
   * Call this method to update the impressions of self handled inapps.
   * 
   * @param payload Stringified JSON payload
   * 
   */
  updateSelfHandledInAppStatus: (payload: string) => void;

  /**
   * Call this method to the current context for inApp module.
   * 
   * @param payload 
   * 
   */
  setAppContext: (payload: string) => void;

  /**
     * Call this method to the reset current context for inApp module.
     * 
     * @param payload Stringified JSON payload
     * 
     */
  resetAppContext: (payload: string) => void;
  /**
     * API to opt out/in from data tracking. 
     * 
     * @param payload Stringified JSON payload
     * 
     */
  optOutDataTracking: (payload: string) => void;

  /**
   * API to opt enable/disable the SDK.
   * 
   * @param payload Stringified JSON payload
   * 
   */
  updateSdkState: (payload: string) => void;

  /// Anroid specific

  /**
   * Pass the FCM push token to the MoEngage SDK.
   * 
   * @param payload Stringified JSON payload
   * 
   */
  passFcmPushToken: (payload: string) => void;

  /**
   * Pass push payload to the MoEngage SDK.
   * 
   * @param payload Stringified JSON payload
   * 
   */
  passFcmPushPayload: (payload: string) => void;

  /**
   * Pass the HMS PushKit push token to the MoEngage SDK.
   * 
   * @param payload Stringified JSON payload
   * 
   */
  passPushKitPushToken: (payload: string) => void;

  /**
   * Notify the MoEngage SDK about the device orientation change
   * 
   * @param payload Stringified JSON payload
   * 
   */
  onOrientationChanged: () => void;

  /**
   * API to enable Advertising Id tracking for Android.
   * 
   * @param payload Stringified JSON payload
   * 
   */
  enableAdIdTracking: (payload: string) => void;

  /**
   * API to disable Advertising Id tracking for Android.
   * 
   * @param payload Stringified JSON payload
   * 
   */
  disableAdIdTracking: (payload: string) => void;

  /**
   * API to enable Android Id tracking for Android.
   * 
   * @param payload Stringified JSON payload
   * 
   */
  enableAndroidIdTracking: (payload: string) => void;

  /**
   * API to disable Android Id tracking for Android.
   * 
   * @param payload Stringified JSON payload
   * 
   */
  disableAndroidIdTracking: (payload: string) => void;

  /**
   * 
   * 
   * @param payload Stringified JSON payload
   * 
   */
  pushPermissionResponseAndroid: (payload: string) => void;

  /**
   * 
   * @param payload Stringified JSON payload
   * 
   */
  setupNotificationChannels: () => void;

  /**
   * 
   * @param payload Stringified JSON payload
   * 
   */
  navigateToSettingsAndroid: () => void;

  /**
   * 
   * 
   * @param payload Stringified JSON payload
   * 
   */
  requestPushPermissionAndroid: () => void;

  /**
   * API to update push permission request count. The count will be incremented on every call.
   * 
   * @param payload Stringified JSON payload
   * 
   */
  updatePushPermissionRequestCountAndroid: (payload: string) => void;

  /**
   * API to enable Device Id tracking for Android.
   * 
   * @param payload Stringified JSON payload
   * 
   */
  enableDeviceIdTracking: (payload: string) => void;

  /**
   * API to disable Device Id tracking for Android.
   * 
   * @param payload Stringified JSON payload
   * 
   */
  disableDeviceIdTracking: (payload: string) => void;

  /**
   * Delete User Data From MoEngage Server
   * 
   * @param payload Stringified JSON payload
   * 
   */
  deleteUser(payload: string): Promise<Object | Error>;

  /// ios specific
  registerForPush: () => void;

  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;
}

const MoEReactBridge = TurboModuleRegistry.getEnforcing<Spec>('MoEReactBridge');
export default MoEReactBridge;

