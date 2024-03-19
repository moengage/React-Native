import { getAppIdJson } from "../utils/MoEGeofenceJsonBuilder";

const MoEGeofenceBridge = require("react-native").NativeModules.MoEReactGeofence;

export const startGeofenceMonitoring = (appId: string) => {
    MoEGeofenceBridge.startGeofenceMonitoring(getAppIdJson(appId));
}

export const stopGeofenceMonitoring = (appId: string) => {
    MoEGeofenceBridge.stopGeofenceMonitoring(getAppIdJson(appId));
}