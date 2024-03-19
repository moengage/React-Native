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

class MoEngageInbox(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private val tag = "MoEngageInbox"

  private val context = reactContext.applicationContext
  private val pluginHelper = InboxPluginHelper()

  override fun getName(): String {
    return "MoEngageInbox"
  }

  @ReactMethod
  fun getUnClickedCount(payload: String, promise: Promise) {
    try {
      Logger.print { "$tag getUnClickedCount()" }
      val unClickedMessagesCount = pluginHelper.getUnClickedMessagesCount(context, payload)
      if (unClickedMessagesCount != null)
        promise.resolve(unClickedMessagesCount.toString())
      else promise.resolve(unClickedCountToJson(0).toString())

    } catch (t: Throwable) {
      Logger.print(LogLevel.ERROR, t) { "$tag getUClickedCount() : " }
      promise.resolve(unClickedCountToJson(0).toString())
    }
  }

  @ReactMethod
  fun fetchAllMessages(payload: String, promise: Promise) {
    try {
      val messages = pluginHelper.fetchAllMessages(context, payload) ?: run {
        Logger.print { "$tag fetchAllMessages() : No messages." }
        return
      }
      val serialisedMessages = inboxDataToJson(messages)
      if (serialisedMessages.length() == 0) {
        promise.reject("", "")
      } else {
        promise.resolve(serialisedMessages.toString())
      }
    } catch (t: Throwable) {
      Logger.print(LogLevel.ERROR, t) { "$tag fetchAllMessages() : " }
    }
  }

  @ReactMethod
  fun deleteMessage(payload: String) {
    try {
      pluginHelper.deleteMessage(context, payload)
    } catch (t: Throwable) {
      Logger.print(LogLevel.ERROR, t) { "$tag deleteMessage() : " }
    }
  }

  @ReactMethod
  fun trackMessageClicked(payload: String) {
    try {
      pluginHelper.trackMessageClicked(context, payload)
    } catch (t: Throwable) {
      Logger.print(LogLevel.ERROR, t) { "$tag trackMessageClicked() : " }
    }
  }
}
