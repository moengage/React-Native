package com.moengage.react.cards

import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.moengage.core.LogLevel
import com.moengage.core.internal.logger.Logger
import com.moengage.plugin.base.cards.internal.CardsEventEmitter
import com.moengage.plugin.base.cards.internal.model.events.CardEventType
import com.moengage.plugin.base.cards.internal.model.events.CardsEvent
import com.moengage.plugin.base.cards.internal.model.events.CardsSyncEvent

/**
 * EventEmitter For Cards Plugin
 *
 * @author Abhishek Kumar
 * @since 1.0.0
 */
class EventEmitterImpl(private val reactContext: ReactContext) : CardsEventEmitter {

    private val tag = "${MODULE_TAG}_EventEmitterImpl"

    override fun emit(event: CardsEvent) {
        try {
            when (event) {
                is CardsSyncEvent -> emitCardSyncEvent(event)
                else -> Logger.print(LogLevel.ERROR) { "$tag emit() Unknown Event: $event" }
            }
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "emit(): $event" }
        }
    }

    private fun emitCardSyncEvent(event: CardsSyncEvent) {
        try {
            val syncCompleteData = event.syncCompleteData
            if (syncCompleteData == null) {
                Logger.print(LogLevel.ERROR) { "emitCardSyncEvent(): $event : Sync CompleteData is null" }
            }
            val syncCompletePayload = PayloadGenerator().cardsSyncToWritableMap(event)
            val method = eventMapping[event.cardEventType] ?: return
            emit(method, syncCompletePayload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag emitCardSyncEvent(): $event" }
        }
    }

    private fun emit(eventName: String, params: WritableMap) {
        try {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag emit() : " }
        }
    }
}

val eventMapping = mapOf(
    CardEventType.APP_OPEN_SYNC to EVENT_APP_OPEN_CARDS_SYNC,
    CardEventType.INBOX_OPEN_SYNC to EVENT_METHOD_INBOX_OPEN_CARDS_SYNC,
    CardEventType.PULL_TO_REFRESH_SYNC to EVENT_PULL_TO_REFRESH_CARDS_SYNC,
)