import MoEngageLogger from "../logger/MoEngageLogger";

const MoEReactBridge = require("react-native").NativeModules.MoEReactBridge;

export class MoERNiOS {
  static initialize(payload: { [k: string]: any }) {
    MoEReactBridge.initialize(payload);
  }

  static setAppStatus(payload: { [k: string]: any }) {
    MoEReactBridge.setAppStatus(payload);
  }

  static trackEvent(payload: { [k: string]: any }) {
    MoEReactBridge.trackEventWithProperties(payload);
  }

  static setUserAttribute(payload: { [k: string]: any }) {
    MoEReactBridge.setUserAttribute(payload);
  }

  static setAlias(payload: { [k: string]: any }) {
    MoEReactBridge.setAlias(payload);
  }

  static logout(payload: { [k: string]: any }) {
    MoEReactBridge.logout(payload);
  }

  static showInApp(payload: { [k: string]: any }) {
    MoEReactBridge.showInApp(payload);
  }

  static showNudge(payload: { [k: string]: any }) {
    MoEReactBridge.showNudge(payload);
  }

  static getSelfHandledInApp(payload: { [k: string]: any }) {
    MoEReactBridge.getSelfHandledInApp(payload);
  }

  static selfHandledShown(payload: { [k: string]: any }) {
    MoEReactBridge.updateSelfHandledInAppStatusWithPayload(payload);
  }

  static selfHandledClicked(payload: { [k: string]: any }) {
    MoEReactBridge.updateSelfHandledInAppStatusWithPayload(payload);
  }

  static selfHandledDismissed(payload: { [k: string]: any }) {
    MoEReactBridge.updateSelfHandledInAppStatusWithPayload(payload);
  }

  static setAppContext(payload: { [k: string]: any }) {
    MoEReactBridge.setAppContext(payload);
  }

  static resetAppContext(payload: { [k: string]: any }) {
    MoEReactBridge.resetAppContext(payload);
  }

  static registerForPush() {
    MoEReactBridge.registerForPushNotification();
  }

  static disableInbox(payload: { [k: string]: any }) {
    MoEReactBridge.disableInbox(payload);
  }

  static validateSDKVersion() {
    MoEReactBridge.validateSDKVersion().catch((error: Error) => {
      MoEngageLogger.error(error.message);
    });
  }

  static startGeofenceMonitoring(payload: { [k: string]: any }) {
    MoEReactBridge.startGeofenceMonitoring(payload);
  }

  static optOutDataTracking(payload: { [k: string]: any }){
    MoERNiOS.optOutTracking(payload)
  }

  private static optOutTracking(payload: { [k: string]: any }){
    MoEReactBridge.optOutTracking(payload);
  }

  static updateSdkState(payload: { [k: string]: any }) {
    MoEReactBridge.updateSDKState(payload);
  }
}
