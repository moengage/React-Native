package com.moengage.react

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod


class MoEReactBridge(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val val moEReactBridgeHandler = MoEReactBridgeHandler(reactContext)

    override fun getName(): String {
        return moEReactBridgeHandler.getName()
    }

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
        moEReactBridgeHandler.setAppStatus(payload)
    }

    @ReactMethod
    fun trackEvent(payload: String) {
        moEReactBridgeHandler.trackEvent(payload)
    }

    @ReactMethod
    fun setUserAttribute(payload: String) {
        moEReactBridgeHandler.setUserAttribute(payload)
    }

    @ReactMethod
    fun logout(payload: String) {
        moEReactBridgeHandler.logout(payload)
    }

    @ReactMethod
    fun setAlias(payload: String) {
        moEReactBridgeHandler.setAlias(payload)
    }

    @ReactMethod
    fun setAppContext(payload: String) {
        moEReactBridgeHandler.setAppContext(payload)
    }

    @ReactMethod
    fun resetAppContext(payload: String) {
        moEReactBridgeHandler.resetAppContext(payload)
    }

    @ReactMethod
    fun showInApp(payload: String) {
        moEReactBridgeHandler.showInApp(payload)
    }

    @ReactMethod
    fun getSelfHandledInApp(payload: String) {
       moEReactBridgeHandler.getSelfHandledInApp(payload)
    }

    @ReactMethod
    fun passPushToken(payload: String) {
        moEReactBridgeHandler.passPushToken(payload)
    }

    @ReactMethod
    fun passPushPayload(payload: String) {
        moEReactBridgeHandler.passPushPayload(payload)
    }

    @ReactMethod
    fun initialize(payload: String) {
        moEReactBridgeHandler.initialize(payload)
    }

    @ReactMethod
    fun selfHandledCallback(payload: String) {
        moEReactBridgeHandler.selfHandledCallback(payload)
    }

    @ReactMethod
    fun optOutTracking(payload: String) {
        moEReactBridgeHandler.optOutTracking(payload)
    }

    @ReactMethod
    fun validateSdkVersion(promise: Promise) {
       moEReactBridgeHandler.validateSdkVersion(promise)
    }

    @ReactMethod
    fun updateSdkState(payload: String) {
        moEReactBridgeHandler.updateSdkState(payload)
    }

    @ReactMethod
    fun onOrientationChanged() {
        moEReactBridgeHandler.onOrientationChanged(payload)
    }

    @ReactMethod
    fun deviceIdentifierTrackingStatusUpdate(payload: String) {
        moEReactBridgeHandler.deviceIdentifierTrackingStatusUpdate(payload)
    }

    @ReactMethod
    fun setupNotificationChannels() {
        moEReactBridgeHandler.setupNotificationChannels()
    }

    @ReactMethod
    fun navigateToSettings() {
        moEReactBridgeHandler.navigateToSettings()
    }

    @ReactMethod
    fun requestPushPermission() {
        moEReactBridgeHandler.requestPushPermission()
    }

    @ReactMethod
    fun permissionResponse(payload: String) {
        moEReactBridgeHandler.permissionResponse(payload)
    }

    @ReactMethod
    fun updatePushPermissionRequestCount(payload: String) {
        moEReactBridgeHandler.updatePushPermissionRequestCount(payload)
    }

    @ReactMethod
    fun deleteUser(payload: String, promise: Promise) {
        moEReactBridgeHandler.deleteUser(payload, promise)
    }
}