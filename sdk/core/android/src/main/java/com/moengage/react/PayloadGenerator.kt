package com.moengage.react

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.moengage.platform.internal.logger.Logger
import com.moengage.core.model.AccountMeta
import com.moengage.inapp.model.ClickData
import com.moengage.inapp.model.InAppData
import com.moengage.inapp.model.SelfHandledCampaignData
import com.moengage.plugin.base.internal.*
import com.moengage.plugin.base.internal.model.PermissionResult
import com.moengage.plugin.base.internal.model.PushPayload
import com.moengage.plugin.base.internal.model.events.push.TokenEvent
import com.moengage.plugin.base.internal.model.events.LogoutCompleteEvent
import com.moengage.plugin.base.internal.model.events.authentication.AuthenticationErrorEvent

/**
 * @author Umang Chamaria
 * Date: 2020/07/29
 */
internal class PayloadGenerator {

    private val tag = "${MODULE_TAG}PayloadGenerator"

    fun pushPayloadToWriteableMap(payload: PushPayload): WritableMap {
        val map = Arguments.createMap()
        val pushJson = pushPayloadToJson(payload)
        Logger.record { "$tag pushPayloadToWriteableMap() : $pushJson" }
        map.putString(ARGUMENT_PAYLOAD, pushJson.toString())
        return map
    }

    fun tokenToWriteableMap(pushToken: TokenEvent) : WritableMap{
        val map = Arguments.createMap()
        val tokenJson = tokenEventToJson(pushToken)
        Logger.record { "$tag tokenToWriteableMap() : $tokenJson" }
        map.putString(ARGUMENT_PAYLOAD, tokenJson.toString())
        return map
    }

    fun inAppNavigationToWriteableMap(clickData: ClickData): WritableMap {
        val map = Arguments.createMap()
        val json = clickDataToJson(clickData)
        Logger.record { "$tag inAppNavigationToWriteableMap() : $json" }
        map.putString(ARGUMENT_PAYLOAD, json.toString())
        return map
    }

    fun inAppDataToWriteableMap(inAppData: InAppData): WritableMap {
        val map = Arguments.createMap()
        val json = inAppDataToJson(inAppData)
        Logger.record { "$tag inAppDataToWriteableMap() : $json" }
        map.putString(ARGUMENT_PAYLOAD, json.toString())
        return map
    }

    fun selfHandledDataToWriteableMap(
        accountMeta: AccountMeta,
        data: SelfHandledCampaignData?
    ): WritableMap {
        Logger.record { "$tag selfHandledDataToWriteableMap() : $data" }
        val map = Arguments.createMap()
        val json = selfHandledDataToJson(accountMeta, data)
        map.putString(ARGUMENT_PAYLOAD, json.toString())
        return map
    }

    fun permissionResultToWriteableMap(result: PermissionResult): WritableMap {
        val map = Arguments.createMap()
        val json = permissionResultToJson(result)
        Logger.record { "$tag permissionResultToWriteableMap() : Payload Json: $json" }
        map.putString(ARGUMENT_PAYLOAD, json.toString())
        return map
    }

    fun authenticationErrorToWritableMap(event: AuthenticationErrorEvent): WritableMap {
        val map = Arguments.createMap()
        val resultJson = authenticationErrorToJson(event)
        Logger.record { "$tag authenticationErrorToWritableMap() : Payload Json: $resultJson" }
        map.putString(ARGUMENT_PAYLOAD, resultJson.toString())
        return map
    }

    fun logoutResultToWritableMap(event: LogoutCompleteEvent): WritableMap {
        val map = Arguments.createMap()
        val resultJson = logoutCompleteEventToJson(event)
        Logger.record { "$tag logoutResultToWritableMap() : Payload Json: $resultJson" }
        map.putString(ARGUMENT_PAYLOAD, resultJson.toString())
        return map
    }
}