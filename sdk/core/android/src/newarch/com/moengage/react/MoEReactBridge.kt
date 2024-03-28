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

    private val moEReactBridgeHandler = MoEReactBridgeHandler(reactContext)

    override fun getName(): String {
        return moEReactBridgeHandler.getName()
    }

    override fun addListener(eventType: String) {
    }

    override fun removeListeners(count: Double) {
    }

    override fun initialize(payload: String) {
        moEReactBridgeHandler.initialize(payload)
    }

    override fun setAppStatus(payload: String) {
        moEReactBridgeHandler.setAppStatus(payload)
    }

    override fun trackEvent(payload: String) {
        moEReactBridgeHandler.trackEvent(payload)
    }

    override fun setUserAttribute(payload: String) {
        moEReactBridgeHandler.setUserAttribute(payload)
    }

    override fun setAlias(payload: String) {
        moEReactBridgeHandler.setAlias(payload)
    }

    override fun logout(payload: String) {
        moEReactBridgeHandler.logout(payload)
    }

    override fun showInApp(payload: String) {
        moEReactBridgeHandler.showInApp(payload)
    }

    override fun showNudge(payload: String) {
        moEReactBridgeHandler.showNudge(payload)
    }

    override fun getSelfHandledInApp(payload: String) {
        moEReactBridgeHandler.getSelfHandledInApp(payload)
    }

    override fun updateSelfHandledInAppStatus(payload: String) {
        moEReactBridgeHandler.selfHandledCallback(payload)
    }

    override fun setAppContext(payload: String) {
        moEReactBridgeHandler.setAppContext(payload)
    }

    override fun resetAppContext(payload: String) {
        moEReactBridgeHandler.resetAppContext(payload)
    }

    override fun optOutDataTracking(payload: String) {
        moEReactBridgeHandler.optOutTracking(payload)
    }

    override fun updateSdkState(payload: String) {
        moEReactBridgeHandler.updateSdkState(payload)
    }

    override fun passFcmPushToken(payload: String) {
        moEReactBridgeHandler.passPushToken(payload)
    }

    override fun passFcmPushPayload(payload: String) {
        moEReactBridgeHandler.passPushPayload(payload)
    }

    override fun passPushKitPushToken(payload: String) {
        moEReactBridgeHandler.passPushToken(payload)
    }

    override fun onOrientationChanged() {
        moEReactBridgeHandler.onOrientationChanged()
    }

    override fun pushPermissionResponseAndroid(payload: String) {
        moEReactBridgeHandler.permissionResponse(payload)
    }

    override fun setupNotificationChannels() {
        moEReactBridgeHandler.setupNotificationChannels()
    }

    override fun navigateToSettingsAndroid() {
        moEReactBridgeHandler.navigateToSettings()
    }

    override fun requestPushPermissionAndroid() {
        moEReactBridgeHandler.requestPushPermission()
    }

    override fun updatePushPermissionRequestCountAndroid(payload: String) {
        moEReactBridgeHandler.updatePushPermissionRequestCount(payload)
    }

    override fun deviceIdentifierTrackingStatusUpdate(payload: String) {
        moEReactBridgeHandler.deviceIdentifierTrackingStatusUpdate(payload)
    }

    override fun deleteUser(payload: String, promise: Promise) {
        moEReactBridgeHandler.deleteUser(payload, promise)
    }

    override fun registerForPush() {
        // iOS only
    }

    override fun disableInbox(payload: String) {
        // iOS only
    }
}