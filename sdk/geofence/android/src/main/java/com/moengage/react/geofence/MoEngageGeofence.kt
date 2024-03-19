package com.moengage.react.geofence

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.moengage.core.internal.logger.Logger
import com.moengage.core.LogLevel
import com.moengage.plugin.base.geofence.internal.GeofencePluginHelper

class MoEngageGeofence(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private val tag = "MoEngageGeofence"

  private val context = reactContext.applicationContext
  private val pluginHelper = GeofencePluginHelper()

  override fun getName(): String {
    return "MoEngageGeofence"
  }

  @ReactMethod
  fun startGeofenceMonitoring(payload: String) {
    try {
      Logger.print { "$tag startGeofenceMonitoring()" }
      pluginHelper.startGeofenceMonitoring(context, payload)
    } catch (t: Throwable) {
      Logger.print(LogLevel.ERROR, t) { "$tag startGeofenceMonitoring() : " }
    }
  }

  @ReactMethod
  fun stopGeofenceMonitoring(payload: String) {
    try {
      Logger.print { "$tag stopGeofenceMonitoring()" }
      pluginHelper.stopGeofenceMonitoring(context, payload)
    } catch (t: Throwable) {
      Logger.print(LogLevel.ERROR, t) { "$tag stopGeofenceMonitoring() : " }
    }
  }
}
