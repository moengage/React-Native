/*
 * Copyright (c) 2014-2024 MoEngage Inc.
 * [full license header — copy from MoEngageCardsBridgeHandler.kt]
 */
package <rnPackage>

import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.moengage.core.LogLevel
import com.moengage.core.internal.logger.Logger
import com.moengage.plugin.base.<featureName>.internal.<featureNameCamel>PluginHelper

// Filename: <rnBridgeName>Handler.kt
internal class <rnBridgeName>Handler(private val reactContext: ReactApplicationContext) {

    private val tag = "${MODULE_TAG}<rnBridgeName>Handler"
    private val context: Context = reactContext.applicationContext
    private val pluginHelper = <featureNameCamel>PluginHelper()

    fun getName() = NAME

    // ── FIRE-AND-FORGET ──────────────────────────────────────────────────────
    fun <methodName>(payload: String) {
        try {
            Logger.print { "$tag <methodName>() : $payload" }
            pluginHelper.<methodName>(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag <methodName>() : " }
        }
    }

    // ── PROMISE-RETURNING ────────────────────────────────────────────────────
    fun <methodName>(payload: String, promise: Promise) {
        try {
            Logger.print { "$tag <methodName>() : $payload" }
            val result = pluginHelper.<methodName>(context, payload)
            promise.resolve(result)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag <methodName>() : " }
            promise.reject(t)
        }
    }

    // ── EVENT/LISTENER INIT ──────────────────────────────────────────────────
    // Only add this when nativeToHybrid events exist (if initialize not added).
    fun initialize(payload: String) {
        try {
            Logger.print { "$tag initialize() : $payload" }
            set<featureNameCamel>EventEmitter(EventEmitterImpl(reactContext))
            pluginHelper.initialize(payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag initialize() : " }
        }
    }

    companion object {
        const val NAME = "<rnBridgeName>"
    }
}
