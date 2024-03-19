import { Platform } from "react-native";

import { MoEngageLogger } from "react-native-moengage";
import * as MoEGeofenceRNiOS from "./platform/MoEGeofenceRNiOS";
import { MoEGeofenceRNAndroid } from "./platform/MoEGeofenceRNAndroid";

const PLATFORM_ANDROID = "android";
const PLATFORM_iOS = "ios";

var ReactMoEGeofence = {
  
  /**
   * Call this method to start Geofence tracking.
   * Note: This method also asks for location permission in iOS, if not already done
   * 
   * @param {string} appId 
   */
  startGeofenceMonitoring: function (appId: string) {
    MoEngageLogger.verbose("Will start geofence monitoring");
    if (Platform.OS == PLATFORM_iOS) {
      MoEGeofenceRNiOS.startGeofenceMonitoring(appId);
    } else if (Platform.OS == PLATFORM_ANDROID) {
      MoEGeofenceRNAndroid.startGeofenceMonitoring(appId);
    }
  },

  /**
   * Call this method to stop Geofence tracking
   * Note: This API is only for Android platform and is a no-operation method for other plaforms.
   *
   * @param {string} appId 
   */
  stopGeofenceMonitoring: function (appId: string) {
    MoEngageLogger.verbose("Will stop geofence monitoring");
    if (Platform.OS == PLATFORM_ANDROID) {
      MoEGeofenceRNAndroid.stopGeofenceMonitoring(appId);
    } else if (Platform.OS == PLATFORM_iOS) {
      MoEGeofenceRNiOS.stopGeofenceMonitoring(appId)
    } 
  }

}

export default ReactMoEGeofence;