package com.moengage.react.geofence

import com.facebook.react.bridge.ReactApplicationContext

/**
 * Bridge to communicate with React-Native Goefence Plugin in old arch
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
class MoEReactGeofence(reactContext: ReactApplicationContext) :
    NativeMoEngageGeofenceSpec(reactContext) {

    private val bridgeHandler = MoEngageGeofenceHandler(reactContext)

    override fun getName() = bridgeHandler.getName()

    override fun startGeofenceMonitoring(payload: String) {
        bridgeHandler.startGeofenceMonitoring(payload)
    }

    override fun stopGeofenceMonitoring(payload: String) {
        bridgeHandler.stopGeofenceMonitoring(payload)
    }
}