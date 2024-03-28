package com.moengage.react

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext

/**
 * Bridge to communicate with js code in new arch
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
class MoEReactBridge(reactContext: ReactApplicationContext) : NativeMoEngageSpec(reactContext) {

    private val bridgeHandler = MoEReactBridgeHandler(reactContext)

    override fun getName() = bridgeHandler.getName()

    override fun addListener(eventType: String) {
    }

    override fun removeListeners(count: Double) {
    }

    override fun initialize(payload: String) {
        bridgeHandler.initialize(payload)
    }

    override fun setAppStatus(payload: String) {
        bridgeHandler.setAppStatus(payload)
    }

    override fun trackEvent(payload: String) {
        bridgeHandler.trackEvent(payload)
    }

    override fun setUserAttribute(payload: String) {
        bridgeHandler.setUserAttribute(payload)
    }

    override fun setAlias(payload: String) {
        bridgeHandler.setAlias(payload)
    }

    override fun logout(payload: String) {
        bridgeHandler.logout(payload)
    }

    override fun showInApp(payload: String) {
        bridgeHandler.showInApp(payload)
    }

    override fun showNudge(payload: String) {
        bridgeHandler.showNudge(payload)
    }

    override fun getSelfHandledInApp(payload: String) {
        bridgeHandler.getSelfHandledInApp(payload)
    }

    override fun updateSelfHandledInAppStatus(payload: String) {
        bridgeHandler.selfHandledCallback(payload)
    }

    override fun setAppContext(payload: String) {
        bridgeHandler.setAppContext(payload)
    }

    override fun resetAppContext(payload: String) {
        bridgeHandler.resetAppContext(payload)
    }

    override fun optOutDataTracking(payload: String) {
        bridgeHandler.optOutTracking(payload)
    }

    override fun updateSdkState(payload: String) {
        bridgeHandler.updateSdkState(payload)
    }

    override fun passFcmPushToken(payload: String) {
        bridgeHandler.passPushToken(payload)
    }

    override fun passFcmPushPayload(payload: String) {
        bridgeHandler.passPushPayload(payload)
    }

    override fun passPushKitPushToken(payload: String) {
        bridgeHandler.passPushToken(payload)
    }

    override fun onOrientationChanged() {
        bridgeHandler.onOrientationChanged()
    }

    override fun pushPermissionResponseAndroid(payload: String) {
        bridgeHandler.permissionResponse(payload)
    }

    override fun setupNotificationChannels() {
        bridgeHandler.setupNotificationChannels()
    }

    override fun navigateToSettingsAndroid() {
        bridgeHandler.navigateToSettings()
    }

    override fun requestPushPermissionAndroid() {
        bridgeHandler.requestPushPermission()
    }

    override fun updatePushPermissionRequestCountAndroid(payload: String) {
        bridgeHandler.updatePushPermissionRequestCount(payload)
    }

    override fun deviceIdentifierTrackingStatusUpdate(payload: String) {
        bridgeHandler.deviceIdentifierTrackingStatusUpdate(payload)
    }

    override fun deleteUser(payload: String, promise: Promise) {
        bridgeHandler.deleteUser(payload, promise)
    }

    override fun registerForPush() {
        // iOS only
    }

    override fun disableInbox(payload: String) {
        // iOS only
    }
}