package com.moengage.react.inbox

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.moengage.core.internal.logger.Logger
import com.moengage.core.LogLevel
import com.moengage.plugin.base.inbox.internal.InboxPluginHelper
import com.moengage.plugin.base.inbox.internal.inboxDataToJson
import com.moengage.plugin.base.inbox.internal.unClickedCountToJson

/**
 * Bridge to communicate with inbox plugin js code in old arch
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
class MoEngageInbox(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    private val bridgeHandler = MoEngageInboxHandler(reactContext)


    override fun getName() = bridgeHandler.getName()

    @ReactMethod
    fun getUnClickedCount(payload: String, promise: Promise) {
        bridgeHandler.getUnClickedCount(payload, promise)
    }

    @ReactMethod
    fun fetchAllMessages(payload: String, promise: Promise) {
        bridgeHandler.fetchAllMessages(payload, promise)
    }

    @ReactMethod
    fun deleteMessage(payload: String) {
        bridgeHandler.deleteMessage(payload)
    }

    @ReactMethod
    fun trackMessageClicked(payload: String) {
        bridgeHandler.trackMessageClicked(payload)
    }
}
