package com.moengage.react.inbox

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext

/**
 * Bridge to communicate with inbox plugin js code in new arch
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
class MoEngageInbox(reactContext: ReactApplicationContext) :
    NativeMoEngageInboxSpec(reactContext) {

    private val bridgeHandler = MoEngageInboxHandler(reactContext)

    override fun getName() = bridgeHandler.name

    override fun getUnClickedCount(payload: String, promise: Promise) {
        bridgeHandler.getUnClickedCount(payload, promise)
    }

    override fun fetchAllMessages(payload: String, promise: Promise) {
        bridgeHandler.fetchAllMessages(payload, promise)
    }

    override fun deleteMessage(payload: String) {
        bridgeHandler.deleteMessage(payload)
    }

    override fun trackMessageClicked(payload: String) {
        bridgeHandler.trackMessageClicked(payload)
    }
}
