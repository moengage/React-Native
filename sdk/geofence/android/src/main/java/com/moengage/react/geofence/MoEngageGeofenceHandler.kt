package com.moengage.react.geofence

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.moengage.core.internal.logger.Logger
import com.moengage.core.LogLevel
import com.moengage.plugin.base.geofence.internal.GeofencePluginHelper

/**
 * Handler class for react-native geofence bridge
 *
 * @author Abhishek Kumar
 * @since Todo: Add version
 */
internal class MoEngageGeofenceHandler(reactContext: ReactApplicationContext) {

    private val tag = "MoEngageGeofenceHandler"

    private val context = reactContext.applicationContext
    private val pluginHelper = GeofencePluginHelper()

    fun getName() = NAME

    fun startGeofenceMonitoring(payload: String) {
        try {
            Logger.print { "$tag startGeofenceMonitoring()" }
            pluginHelper.startGeofenceMonitoring(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag startGeofenceMonitoring() : " }
        }
    }

    fun stopGeofenceMonitoring(payload: String) {
        try {
            Logger.print { "$tag stopGeofenceMonitoring()" }
            pluginHelper.stopGeofenceMonitoring(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag stopGeofenceMonitoring() : " }
        }
    }

    companion object {
        const val NAME = "MoEReactGeofence"
    }
}
