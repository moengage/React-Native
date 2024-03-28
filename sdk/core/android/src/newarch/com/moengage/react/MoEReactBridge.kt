package com.moengage.react

import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class MoEReactBridge(reactContext: ReactApplicationContext) : NativeMoEngageSpec(reactContext) {

    private val moEReactBridgeHandler = MoEReactBridgeHandler(reactContext)

    override fun getName(): String {
        return moEReactBridgeHandler.getName()
    }

    override fun initialize(payload: String) {
        moEReactBridgeHandler.initialize(payload)
    }

    override fun setAppStatus(payload: String) {
        moEReactBridgeHandler.setAppStatus(payload)
    }

    override
    fun trackEvent(payload: String) {
        moEReactBridgeHandler.trackEvent(payload)
    }

    override
    fun setUserAttribute(payload: String) {
        moEReactBridgeHandler.setUserAttribute(payload)
    }

    override
    fun setAlias(payload: String) {
        moEReactBridgeHandler.setAlias(payload)
    }

    override
    fun logout(payload: String) {
        moEReactBridgeHandler.logout(payload)
    }

    override
    fun showInApp(payload: String) {
        moEReactBridgeHandler.showInApp(payload)
    }

    override
    fun showNudge(payload: String) {
        moEReactBridgeHandler.showNudge(payload)
    }

    override
    fun getSelfHandledInApp(payload: String) {
        moEReactBridgeHandler.getSelfHandledInApp(payload)
    }

    override
    fun updateSelfHandledInAppStatus(payload: String) {
        // iOS only
    }

    override
    fun setAppContext(payload: String) {
        moEReactBridgeHandler.setAppContext(payload)
    }

    override
    fun resetAppContext(payload: String) {
        moEReactBridgeHandler.resetAppContext(payload)
    }

    override
    fun disableInbox(payload: String) {
        // iOS only
    }

    override
    fun optOutDataTracking(payload: String) {
        moEReactBridgeHandler.optOutTracking(payload)
    }

    override
    fun updateSdkState(payload: String) {
        moEReactBridgeHandler.updateSdkState(payload)
    }

    override
    fun passFcmPushToken(payload: String) {
        moEReactBridgeHandler.passPushToken(payload)
    }

    override
    fun passFcmPushPayload(payload: String) {
        moEReactBridgeHandler.passPushPayload(payload)
    }

    override
    fun passPushKitPushToken(payload: String) {
        
    }

    override
    fun onOrientationChanged() {
        moEReactBridgeHandler.onOrientationChanged()
    }

    override
    fun enableAdIdTracking(payload: String) {
        
    }

    override
    fun disableAdIdTracking(payload: String) {
        
    }

    override
    fun enableAndroidIdTracking(payload: String) {
        
    }

    override
    fun disableAndroidIdTracking(payload: String) {
    }

    override
    fun pushPermissionResponseAndroid(payload: String) {
//        moEReactBridgeHandler.updatePushPermissionRequestCount(payload)
    }

    override
    fun setupNotificationChannels() {
        moEReactBridgeHandler.setupNotificationChannels()
    }

    override
    fun navigateToSettingsAndroid() {
        moEReactBridgeHandler.navigateToSettings()
    }

    override
    fun requestPushPermissionAndroid() {
        moEReactBridgeHandler.requestPushPermission()
    }

    override
    fun updatePushPermissionRequestCountAndroid(payload: String) {
        moEReactBridgeHandler.updatePushPermissionRequestCount(payload)
    }

    override
    fun enableDeviceIdTracking(payload: String) {
        
    }

    override
    fun disableDeviceIdTracking(payload: String) {
    }

    override
    fun deleteUser(payload: String, promise: Promise) {
    }

    override
    fun registerForPush() {
    }

    override
    fun addListener(eventType: String) {
    }

    override
    fun removeListeners(count: Double) {
    }
}