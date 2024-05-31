const AppReactBridge = require("react-native").NativeModules.AppReactBridge;

export function updateAppId(appId: String) {
    AppReactBridge.updateAppId(appId);
}