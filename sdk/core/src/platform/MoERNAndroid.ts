import MoEngageLogger from "../logger/MoEngageLogger";
import { MoEngagePermissionType } from "../models/MoEngagePermissionType";
import UserDeletionData from "../models/UserDeletionData";
import { getUserDeletionData } from "../moeParser/MoEngagePayloadParser";
import { getPermissionResponseJson } from "../utils/MoEJsonBuilder";

const MoEReactBridge = require("react-native").NativeModules.MoEReactBridge;

export class MoERNAndroid {
  static initialize(payload: { [k: string]: any }) {
    MoEReactBridge.initialize(JSON.stringify(payload));
  }

  static trackEvent(payload: { [k: string]: any }) {
    MoEReactBridge.trackEvent(JSON.stringify(payload))
  }

  static setAppStatus(payload: { [k: string]: any }) {
    MoEReactBridge.setAppStatus(JSON.stringify(payload));
  }

  static setUserAttribute(payload: { [k: string]: any }) {
    MoEReactBridge.setUserAttribute(JSON.stringify(payload));
  }

  static setAlias(payload: { [k: string]: any }) {
    MoEReactBridge.setAlias(JSON.stringify(payload));
  }

  static logout(payload: { [k: string]: any }) {
    MoEReactBridge.logout(JSON.stringify(payload));
  }

  static showInApp(payload: { [k: string]: any }) {
    MoEReactBridge.showInApp(JSON.stringify(payload));
  }

  static getSelfHandledInApp(payload: { [k: string]: any }) {
    MoEReactBridge.getSelfHandledInApp(JSON.stringify(payload));
  }

  static selfHandledShown(payload: { [k: string]: any }) {
    MoERNAndroid.selfHandledCallback(payload);
  }

  static selfHandledClicked(payload: { [k: string]: any }) {
    MoERNAndroid.selfHandledCallback(payload);
  }

  static selfHandledDismissed(payload: { [k: string]: any }) {
    MoERNAndroid.selfHandledCallback(payload);
  }

  private static selfHandledCallback(payload: { [k: string]: any }) {
    MoEReactBridge.selfHandledCallback(JSON.stringify(payload));
  }

  static setAppContext(payload: { [k: string]: any }) {
    MoEReactBridge.setAppContext(JSON.stringify(payload));
  }

  static resetAppContext(payload: { [k: string]: any }) {
    MoEReactBridge.resetAppContext(JSON.stringify(payload));
  }

  static passFcmPushToken(payload: { [k: string]: any }) {
    MoERNAndroid.passPushToken(payload)
  }

  static passFcmPushPayload(pushPayload: { [k: string]: any }) {
    MoERNAndroid.passPushPayload(pushPayload)
  }

  private static passPushToken(payload: { [k: string]: any }) {
    MoEReactBridge.passPushToken(JSON.stringify(payload));
  }

  private static passPushPayload(payload: { [k: string]: any }) {
    MoEReactBridge.passPushPayload(JSON.stringify(payload));
  }

  static optOutDataTracking(payload: { [k: string]: any }) {
    MoERNAndroid.optOutTracking(payload)
  }

  private static optOutTracking(payload: { [k: string]: any }) {
    MoEReactBridge.optOutTracking(JSON.stringify(payload));
  }

  static validateSDKVersion() {
    MoEReactBridge.validateSdkVersion().catch((error: Error) => {
      MoEngageLogger.error(error.message);
    });
  }

  static passPushKitPushToken(payload: { [k: string]: any }) {
    MoERNAndroid.passPushToken(payload)
  }

  static updateSdkState(payload: { [k: string]: any }) {
    MoEReactBridge.updateSdkState(JSON.stringify(payload));
  }

  static onOrientationChanged() {
    MoEReactBridge.onOrientationChanged()
  }

  static enableAdIdTracking(payload: { [k: string]: any }) {
    MoEReactBridge.deviceIdentifierTrackingStatusUpdate(JSON.stringify(payload))
  }

  static disableAdIdTracking(payload: { [k: string]: any }) {
    MoEReactBridge.deviceIdentifierTrackingStatusUpdate(JSON.stringify(payload))
  }

  static enableAndroidIdTracking(payload: { [k: string]: any }) {
    MoEReactBridge.deviceIdentifierTrackingStatusUpdate(JSON.stringify(payload))
  }

  static disableAndroidIdTracking(payload: { [k: string]: any }) {
    MoEReactBridge.deviceIdentifierTrackingStatusUpdate(JSON.stringify(payload))
  }

  static permissionResponse(isGranted: boolean, permissionType: MoEngagePermissionType) {
    MoEReactBridge.permissionResponse(JSON.stringify(getPermissionResponseJson(isGranted, permissionType)));
  }

  static setupNotificationChannels() {
    MoEReactBridge.setupNotificationChannels();
  }

  static navigateToSettings() {
    MoEReactBridge.navigateToSettings()
  }

  static requestPushPermission() {
    MoEReactBridge.requestPushPermission();
  }

  static updatePushPermissionRequestCount(payload: { [k: string]: any }) {
    MoEReactBridge.updatePushPermissionRequestCount(JSON.stringify(payload));
  }

  static enableDeviceIdTracking(payload: { [k: string]: any }) {
    MoEReactBridge.deviceIdentifierTrackingStatusUpdate(JSON.stringify(payload))
  }

  static disableDeviceIdTracking(payload: { [k: string]: any }) {
    MoEReactBridge.deviceIdentifierTrackingStatusUpdate(JSON.stringify(payload))
  }

  /**
   * API which connects with Android Native bridge to delete the current User 
   * from MoEngage Server. 
   * 
   * @param payload in required format to delete user
   * @returns instance of {@link UserDeletionData}
   * @since 8.6.0
   */
  static async deleteUser(payload: { [k: string]: any }): Promise<UserDeletionData> {
    const deleteUserPayload = await MoEReactBridge.deleteUser(JSON.stringify(payload));
    return getUserDeletionData(deleteUserPayload);
  }

  /**
   * Try to show a non-intrusive In-App nudge
   * @since Todo: Add Version
   */
  static showNudge(payload: { [k: string]: any }) {
    MoEReactBridge.showNudge(JSON.stringify(payload));
  }
}