import { NativeEventEmitter } from "react-native";

const AppReactBridge = require("react-native").NativeModules.AppReactBridge;
let AppEventEmitter = new NativeEventEmitter(AppReactBridge);

export function updateAppId(appId: String) {
    AppReactBridge.updateAppId(appId);
}

export function getEmitter(): NativeEventEmitter {
    return AppEventEmitter;
}