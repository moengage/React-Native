package com.moengage.react

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Bridge to communicate with js code in old arch
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
class MoEReactBridge(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    private val bridgeHandler = MoEReactBridgeHandler(reactContext)

    override fun getName() = bridgeHandler.getName()

    @ReactMethod
    fun addListener(eventName: String) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    fun setAppStatus(payload: String) {
        bridgeHandler.setAppStatus(payload)
    }

    @ReactMethod
    fun trackEvent(payload: String) {
        bridgeHandler.trackEvent(payload)
    }

    @ReactMethod
    fun setUserAttribute(payload: String) {
        bridgeHandler.setUserAttribute(payload)
    }

    @ReactMethod
    fun logout(payload: String) {
        bridgeHandler.logout(payload)
    }

    @ReactMethod
    fun setAlias(payload: String) {
        bridgeHandler.setAlias(payload)
    }

    @ReactMethod
    fun setAppContext(payload: String) {
        bridgeHandler.setAppContext(payload)
    }

    @ReactMethod
    fun resetAppContext(payload: String) {
        bridgeHandler.resetAppContext(payload)
    }

    @ReactMethod
    fun showInApp(payload: String) {
        bridgeHandler.showInApp(payload)
    }

    @ReactMethod
    fun getSelfHandledInApp(payload: String) {
        bridgeHandler.getSelfHandledInApp(payload)
    }

    @ReactMethod
    fun passPushToken(payload: String) {
        bridgeHandler.passPushToken(payload)
    }

    @ReactMethod
    fun passPushPayload(payload: String) {
        bridgeHandler.passPushPayload(payload)
    }

    @ReactMethod
    fun initialize(payload: String) {
        bridgeHandler.initialize(payload)
    }

    @ReactMethod
    fun selfHandledCallback(payload: String) {
        bridgeHandler.selfHandledCallback(payload)
    }

    @ReactMethod
    fun optOutDataTracking(payload: String) {
        bridgeHandler.optOutTracking(payload)
    }

    @ReactMethod
    fun updateSdkState(payload: String) {
        bridgeHandler.updateSdkState(payload)
    }

    @ReactMethod
    fun onOrientationChanged() {
        bridgeHandler.onOrientationChanged()
    }

    @ReactMethod
    fun deviceIdentifierTrackingStatusUpdate(payload: String) {
        bridgeHandler.deviceIdentifierTrackingStatusUpdate(payload)
    }

    @ReactMethod
    fun setupNotificationChannels() {
        bridgeHandler.setupNotificationChannels()
    }

    @ReactMethod
    fun navigateToSettingsAndroid() {
        bridgeHandler.navigateToSettings()
    }

    @ReactMethod
    fun requestPushPermissionAndroid() {
        bridgeHandler.requestPushPermission()
    }

    @ReactMethod
    fun pushPermissionResponseAndroid(payload: String) {
        bridgeHandler.permissionResponse(payload)
    }

    @ReactMethod
    fun updatePushPermissionRequestCountAndroid(payload: String) {
        bridgeHandler.updatePushPermissionRequestCount(payload)
    }

    @ReactMethod
    fun deleteUser(payload: String, promise: Promise) {
        bridgeHandler.deleteUser(payload, promise)
    }

    @ReactMethod
    fun showNudge(payload: String) {
        bridgeHandler.showNudge(payload)
    }
}