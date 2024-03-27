import { Platform } from "react-native";

import { MoEngageLogger } from "react-native-moengage";
import  MoEReactGeofence  from './NativeMoEngageGeofence';
import { getAppIdJson } from "./utils/MoEGeofenceJsonBuilder";

var ReactMoEGeofence = {
  
  /**
   * Call this method to start Geofence tracking.
   * Note: This method also asks for location permission in iOS, if not already done
   * 
   * @param {string} appId 
   */
  startGeofenceMonitoring: function (appId: string) {
    MoEngageLogger.verbose("Will start geofence monitoring");
    MoEReactGeofence.startGeofenceMonitoring(getAppIdJson(appId));
  },

  /**
   * Call this method to stop Geofence tracking
   * Note: This API is only for Android platform and is a no-operation method for other plaforms.
   *
   * @param {string} appId 
   */
  stopGeofenceMonitoring: function (appId: string) {
    MoEngageLogger.verbose("Will stop geofence monitoring");
    MoEReactGeofence.stopGeofenceMonitoring(getAppIdJson(appId));
  }

}

export default ReactMoEGeofence;