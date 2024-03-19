import { getAppIdJson } from "../utils/MoEGeofenceJsonBuilder";

const MoEGeofenceBridge = require("react-native").NativeModules.MoEngageGeofence;

export class MoEGeofenceRNAndroid {
  
  static startGeofenceMonitoring(appId:string) {
    MoEGeofenceBridge.startGeofenceMonitoring(JSON.stringify(getAppIdJson(appId)));
  }

  static stopGeofenceMonitoring(appId:string) {
    MoEGeofenceBridge.stopGeofenceMonitoring(JSON.stringify(getAppIdJson(appId)));
  }
}