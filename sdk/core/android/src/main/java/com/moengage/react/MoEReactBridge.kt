package com.moengage.react

import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.moengage.core.LogLevel
import com.moengage.core.MoECoreHelper
import com.moengage.core.internal.logger.Logger
import com.moengage.core.internal.utils.getSdkVersion
import com.moengage.core.listeners.AppBackgroundListener
import com.moengage.plugin.base.internal.PluginHelper
import com.moengage.plugin.base.internal.setEventEmitter
import com.moengage.plugin.base.internal.userDeletionDataToJson

/**
 * @author Umang Chamaria
 */
class MoEReactBridge(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val tag = "${MODULE_TAG}MoEReactBridge"

    private val context: Context = reactContext.applicationContext
    private val pluginHelper = PluginHelper()
    private val moeSdkVersion = getSdkVersion()

    private val backgroundStateListener =
        AppBackgroundListener { _, _ -> pluginHelper.onFrameworkDetached() }

    override fun getName(): String {
        return "MoEReactBridge"
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
        try {
            Logger.print { "$tag setAppStatus() : Payload: $payload" }
            pluginHelper.setAppStatus(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag setAppStatus() : " }
        }
    }

    @ReactMethod
    fun trackEvent(payload: String) {
        try {
            Logger.print { "$tag trackEvent() : Payload: $payload" }
            pluginHelper.trackEvent(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag trackEvent() : " }
        }
    }

    @ReactMethod
    fun setUserAttribute(payload: String) {
        try {
            Logger.print { "$tag setUserAttribute() : Payload: $payload" }
            pluginHelper.setUserAttribute(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag setUserAttribute() : " }
        }
    }

    @ReactMethod
    fun logout(payload: String) {
        try {
            Logger.print { "$tag logout() : " }
            pluginHelper.logout(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag logout() : " }
        }
    }

    @ReactMethod
    fun setAlias(payload: String) {
        try {
            Logger.print { "$tag setAlias() : Payload: $payload" }
            pluginHelper.setAlias(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag setAlias() : " }
        }
    }

    @ReactMethod
    fun setAppContext(payload: String) {
        try {
            Logger.print { "$tag setAppContext() : Payload: $payload" }
            pluginHelper.setAppContext(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag setAppContext() : " }
        }
    }

    @ReactMethod
    fun resetAppContext(payload: String) {
        try {
            Logger.print { "$tag resetAppContext() : $payload" }
            pluginHelper.resetAppContext(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag resetAppContext() : " }
        }
    }

    @ReactMethod
    fun showInApp(payload: String) {
        try {
            Logger.print { "$tag showInApp() : $payload" }
            pluginHelper.showInApp(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag showInApp() : " }
        }
    }

    @ReactMethod
    fun getSelfHandledInApp(payload: String) {
        try {
            Logger.print { "$tag getSelfHandledInApp() : $payload" }
            pluginHelper.getSelfHandledInApp(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag getSelfHandledInApp() : " }
        }
    }

    @ReactMethod
    fun passPushToken(payload: String) {
        try {
            Logger.print { "$tag passPushToken() : $payload" }
            pluginHelper.passPushToken(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag passPushToken() : " }
        }
    }

    @ReactMethod
    fun passPushPayload(payload: String) {
        try {
            Logger.print { "$tag passPushPayload() : $payload" }
            pluginHelper.passPushPayload(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag passPushPayload() : " }
        }
    }

    @ReactMethod
    fun initialize(payload: String) {
        try {
            Logger.print { "$tag initialize() : " }
            pluginHelper.initialise(payload)
            setEventEmitter(EventEmitterImpl(reactContext))
            if (GlobalCache.lifecycleAwareCallbackEnabled) {
                MoECoreHelper.addAppBackgroundListener(backgroundStateListener)
            }
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag initialize() : " }
        }
    }

    @ReactMethod
    fun selfHandledCallback(payload: String) {
        try {
            Logger.print { "$tag selfHandledCallback() : $payload" }
            pluginHelper.selfHandledCallback(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag selfHandledCallback() : " }
        }
    }

    @ReactMethod
    fun optOutTracking(payload: String) {
        try {
            pluginHelper.optOutTracking(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag optOutTracking() : " }
        }
    }

    @ReactMethod
    fun validateSdkVersion(promise: Promise) {
        Logger.print { "$tag validateSdkVersion() : Validating Version" }
        if (moeSdkVersion > 130000) {
            Logger.print(LogLevel.ERROR) { "$tag validateSdkVersion() : invalid version" }
            promise.reject("error", "Use SDK version 12.x.xx")
        } else {
            Logger.print { "$tag validateSdkVersion() : valid version" }
            promise.resolve("valid version");
        }
    }

    @ReactMethod
    fun updateSdkState(payload: String) {
        try {
            Logger.print { "$tag updateSdkState() : $payload" }
            pluginHelper.storeFeatureStatus(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag updateSdkState() : " }
        }
    }

    @ReactMethod
    fun onOrientationChanged() {
        try {
            Logger.print { "$tag onOrientationChanged() : " }
            pluginHelper.onConfigurationChanged()
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag onOrientationChanged() : " }
        }
    }

    @ReactMethod
    fun deviceIdentifierTrackingStatusUpdate(payload: String) {
        try {
            Logger.print { "$tag deviceIdentifierTrackingStatusUpdate() : $payload" }
            pluginHelper.deviceIdentifierTrackingStatusUpdate(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag deviceIdentifierTrackingStatusUpdate() : " }
        }
    }

    @ReactMethod
    fun setupNotificationChannels() {
        try {
            pluginHelper.setUpNotificationChannels(context)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag setupNotificationChannel() :" }
        }
    }

    @ReactMethod
    fun navigateToSettings() {
        try {
            pluginHelper.navigateToSettings(context)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag navigateToSettings() :" }
        }
    }

    @ReactMethod
    fun requestPushPermission() {
        try {
            pluginHelper.requestPushPermission(context)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag requestPushPermission() :" }
        }
    }

    @ReactMethod
    fun permissionResponse(payload: String) {
        try {
            Logger.print { "$tag permissionResponse() : Payload: $payload" }
            pluginHelper.permissionResponse(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag permissionResponse() :" }
        }
    }

    @ReactMethod
    fun updatePushPermissionRequestCount(payload: String) {
        try {
            Logger.print { "$tag updatePushPermissionRequestCount() : Payload: $payload" }
            pluginHelper.updatePushPermissionRequestCount(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag updatePushPermissionRequestCount() :" }
        }
    }

    /**
     * API to delete the user from MoEngage Server

     * @param payload - required key-value pair
     * @param promise - promise object which will be resolved based on success / failure
     * @since 8.6.0
     */
    @ReactMethod
    fun deleteUser(payload: String, promise: Promise) {
        try {
            Logger.print { "$tag deleteUser() : Payload: $payload" }
            pluginHelper.deleteUser(context, payload) { userDeletionData ->
                promise.resolve(userDeletionDataToJson(userDeletionData).toString())
            }
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag deleteUser() :" }
            promise.reject(t)
        }
    }
}