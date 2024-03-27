import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {

  initialize:(payload: string) => void;
  setAppStatus:(payload: string) => void;
  trackEvent:(payload: string) => void;
  setUserAttribute:(payload: string) => void;
  setAlias:(payload: string) => void;
  logout:(payload: string) => void;
  showInApp:(payload: string) => void;
  showNudge:(payload: string) => void;
  getSelfHandledInApp:(payload: string) => void;
  updateSelfHandledInAppStatus:(payload: string) => void;
  setAppContext:(payload: string) => void;
  resetAppContext:(payload: string) => void;
  disableInbox:(payload: string) => void;
  optOutDataTracking:(payload: string) => void;
  updateSdkState:(payload: string) => void;

  /// Anroid specific
  passFcmPushToken:(payload: string) => void;
  passFcmPushPayload:(payload: string) => void;
  passPushKitPushToken:(payload: string) => void;
  onOrientationChanged:() => void;
  enableAdIdTracking:(payload: string) => void;
  disableAdIdTracking:(payload: string) => void;
  enableAndroidIdTracking:(payload: string) => void;
  disableAndroidIdTracking:(payload: string) => void;
  pushPermissionResponseAndroid:(payload: string) => void;
  setupNotificationChannels:() => void;
  navigateToSettingsAndroid:() => void;
  requestPushPermissionAndroid:() => void;
  updatePushPermissionRequestCountAndroid:(payload: string) => void;
  enableDeviceIdTracking:(payload: string) => void;
  disableDeviceIdTracking:(payload: string) => void;
  deleteUser(payload: string): Promise<Object | Error> ;

  /// ios specific
  registerForPush:() => void;

  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;
}

const MoEReactBridge = TurboModuleRegistry.getEnforcing<Spec>('MoEReactBridge');
export default MoEReactBridge;

