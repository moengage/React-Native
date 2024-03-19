package com.moengage.react

import android.os.Bundle
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.common.LifecycleState
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.moe.pushlibrary.activities.MoEActivity
import com.moengage.core.LogLevel
import com.moengage.core.PUSH_NOTIFICATION_NAVIGATION_ACTIVITY_NAME
import com.moengage.core.PUSH_NOTIFICATION_NAVIGATION_DEEPLINK_LEGACY
import com.moengage.core.internal.logger.Logger
import com.moengage.plugin.base.internal.EventEmitter
import com.moengage.plugin.base.internal.model.events.Event
import com.moengage.plugin.base.internal.model.events.EventType
import com.moengage.plugin.base.internal.model.events.inapp.InAppActionEvent
import com.moengage.plugin.base.internal.model.events.inapp.InAppLifecycleEvent
import com.moengage.plugin.base.internal.model.events.inapp.InAppSelfHandledEvent
import com.moengage.plugin.base.internal.model.events.push.PermissionEvent
import com.moengage.plugin.base.internal.model.events.push.PushClickedEvent
import com.moengage.plugin.base.internal.model.events.push.TokenEvent
import com.moengage.pushbase.NAVIGATION_TYPE_RICH_LANDING
import com.moengage.pushbase.NAVIGATION_TYPE_SCREEN_NAME
import com.moengage.pushbase.NAV_ACTION
import com.moengage.pushbase.model.action.NavigationAction


/**
 * @author Umang Chamaria
 * Date: 28/07/20
 */
class EventEmitterImpl(private val reactContext: ReactContext) : EventEmitter {
    private val tag = "${MODULE_TAG}EventEmitterImpl"

    override fun emit(event: Event) {
        try {
            Logger.print { "$tag emit() : $event" }
            when (event.eventType) {
                EventType.PUSH_CLICKED -> emitPushClicked(event as PushClickedEvent)
                EventType.PUSH_TOKEN_GENERATED -> emitPushToken(event as TokenEvent)
                EventType.INAPP_CLOSED, EventType.INAPP_SHOWN -> emitInAppLifecycle(event as InAppLifecycleEvent)
                EventType.INAPP_CUSTOM_ACTION, EventType.INAPP_NAVIGATION -> emitInAppAction(
                    event as InAppActionEvent
                )
                EventType.INAPP_SELF_HANDLED_AVAILABLE -> emitInAppSelfHandled(event as InAppSelfHandledEvent)
                EventType.PERMISSION -> emitPermissionResult(event as PermissionEvent)
            }
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag emit() : " }
        }
    }

    private fun emitInAppAction(event: InAppActionEvent) {
        Logger.print { "$tag emitInAppNavigation() : $event" }
        val eventName = eventMapping[event.eventType] ?: return
        val payload = PayloadGenerator().inAppNavigationToWriteableMap(event.clickData)
        emit(eventName, payload)
    }

    private fun emitInAppLifecycle(event: InAppLifecycleEvent) {
        Logger.print { "$tag emitInAppLifecycle() : $event" }
        val eventName = eventMapping[event.eventType] ?: return
        val payload = PayloadGenerator().inAppDataToWriteableMap(event.inAppData)
        emit(eventName, payload)
    }

    private fun emitInAppSelfHandled(event: InAppSelfHandledEvent) {
        Logger.print { "$tag emitInAppSelfHandled() : $event" }
        val eventName = eventMapping[event.eventType] ?: return
        val payload =
            PayloadGenerator().selfHandledDataToWriteableMap(event.accountMeta, event.data)
        emit(eventName, payload)
    }

    private fun emitPushClicked(event: PushClickedEvent) {
        Logger.print { "$tag emitPushClicked() : $event" }
        val eventName = eventMapping[event.eventType] ?: return
        val payload = PayloadGenerator().pushPayloadToWriteableMap(event.payload)
        emit(eventName, payload)
    }

    private fun emitPushToken(tokenEvent: TokenEvent) {
        Logger.print { "$tag emitPushToken() : $tokenEvent" }
        val eventName = eventMapping[tokenEvent.eventType] ?: return
        val payload = PayloadGenerator().tokenToWriteableMap(tokenEvent)
        emit(eventName, payload)
    }

    private fun emit(eventName: String, params: WritableMap) {
        try {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag emit() : " }
        }
    }

    private fun emitPermissionResult(event: PermissionEvent) {
        Logger.print { "$tag emitPermissionResult() : Event $event" }
        val eventName = eventMapping[event.eventType] ?: return
        val payload = PayloadGenerator().permissionResultToWriteableMap(event.result)
        emit(eventName, payload)
    }
}

val eventMapping = mapOf<EventType, String>(
    EventType.PUSH_CLICKED to "MoEPushClicked",
    EventType.INAPP_SHOWN to "MoEInAppCampaignShown",
    EventType.INAPP_NAVIGATION to "MoEInAppCampaignClicked",
    EventType.INAPP_CLOSED to "MoEInAppCampaignDismissed",
    EventType.INAPP_CUSTOM_ACTION to "MoEInAppCampaignCustomAction",
    EventType.INAPP_SELF_HANDLED_AVAILABLE to "MoEInAppCampaignSelfHandled",
    EventType.PUSH_TOKEN_GENERATED to "MoEPushTokenGenerated",
    EventType.PERMISSION to "MoEPermissionResult"
)
