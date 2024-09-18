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
   * Call this method to get the multiple eligible Self Handled Campaigns.
   * @param payload : Stringified JSON payload
   * @returns Stringified list of Self Handled campaigns
   */
  getSelfHandledInApps: (payload: string) => Promise<string>;

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
   * @param payload Stringfied JSON with data as FCM token
   */
  passFcmPushToken: (payload: string) => void;

  /**
   * Pass push payload to the MoEngage SDK.
   *
   * @param payload Stringified JSON with data as Push Notification Payload
   */
  passFcmPushPayload: (payload: string) => void;

  /**
   * Pass the HMS PushKit push token to the MoEngage SDK.
   *
   * @param payload Stringified JSON with data as Push Kit token
   */
  passPushKitPushToken: (payload: string) => void;

  /**
   * Notify the MoEngage SDK about the device orientation change
   */
  onOrientationChanged: () => void;

  /**
   * Notify the SDK when the push permission is granted from user
   *
   * @param payload Stringified JSON with data as permission state
   */
  pushPermissionResponseAndroid: (payload: string) => void;

  /**
   * API to create the MoEngage default notification channel
   */
  setupNotificationChannels: () => void;

  /**
   * API to redirect user to Notification permission page
   */
  navigateToSettingsAndroid: () => void;

  /**
   * API to request the push permission on Android 13 and above.
   */
  requestPushPermissionAndroid: () => void;

  /**
   * Updates the Notification request attempt count, the request attempt count will be incremented by the passed fresh count.
   *
   * @param payload Stringified JSON with data as incremented count
   */
  updatePushPermissionRequestCountAndroid: (payload: string) => void;

  /**
   * 
   * Update the Device identifier tracking status
   * 
   * @param payload Stringified JSON with data as tracking status
   */
  deviceIdentifierTrackingStatusUpdate:(payload: string) => void;

  /**
   * Delete User Data From MoEngage Server
   *
   * @param payload Stringified JSON payload
   *
   */
  deleteUser(payload: string): Promise<Object | Error>;

  /// ios specific
  registerForPush: () => void;


  /**
   * Registers for iOS Provisional Push.
   */
  registerForProvisionalPush: () => void;

  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;
}

const MoEReactBridge = TurboModuleRegistry.getEnforcing<Spec>('MoEReactBridge');
export default MoEReactBridge;

