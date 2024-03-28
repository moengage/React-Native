package com.moengage.react.geofence

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.moengage.core.internal.logger.Logger
import com.moengage.core.LogLevel
import com.moengage.plugin.base.geofence.internal.GeofencePluginHelper

/**
 * Bridge to communicate with js code in old arch
 * 
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
class MoEngageGeofence(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    private val bridgeHandler = MoEngageGeofenceHandler(reactContext)

    override fun getName() = bridgeHandler.getName()

    @ReactMethod
    fun startGeofenceMonitoring(payload: String) {
        bridgeHandler.startGeofenceMonitoring(payload)
    }

    @ReactMethod
    fun stopGeofenceMonitoring(payload: String) {
        bridgeHandler.stopGeofenceMonitoring(payload)
    }
}
