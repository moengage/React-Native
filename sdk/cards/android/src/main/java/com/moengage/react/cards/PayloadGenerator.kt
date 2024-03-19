package com.moengage.react.cards

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.moengage.core.internal.logger.Logger
import com.moengage.plugin.base.cards.internal.cardsSyncToJson
import com.moengage.plugin.base.cards.internal.model.events.CardsSyncEvent

/**
 * Generate the payload to communicate with React-Native Cards Plugin
 *
 * @author Abhishek Kumar
 * @since 1.0.0
 */
internal class PayloadGenerator {

    private val tag = "${MODULE_TAG}PayloadGenerator"

    fun cardsSyncToWritableMap(event: CardsSyncEvent): WritableMap {
        val map = Arguments.createMap()
        val syncCompleteJson = cardsSyncToJson(event.syncCompleteData, event.accountMeta)
        Logger.print { "$tag cardsSyncToWritableMap() : $event" }
        map.putString(ARGUMENT_PAYLOAD, syncCompleteJson.toString())
        return map
    }
}