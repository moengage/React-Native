/*
 * Copyright (c) 2014-2023 MoEngage Inc.
 *
 * All rights reserved.
 *
 *  Use of source code or binaries contained within MoEngage SDK is permitted only to enable use of the MoEngage platform by customers of MoEngage.
 *  Modification of source code and inclusion in mobile apps is explicitly allowed provided that all other conditions are met.
 *  Neither the name of MoEngage nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *  Redistribution of source code or binaries is disallowed except with specific prior written permission. Any such redistribution must retain the above copyright notice, this list of conditions and the following disclaimer.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

package com.moengage.react.cards

import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.moengage.core.LogLevel
import com.moengage.core.internal.logger.Logger
import com.moengage.plugin.base.cards.CardsPluginHelper
import com.moengage.plugin.base.cards.internal.cardListToJson
import com.moengage.plugin.base.cards.internal.setCardsEventEmitter
import org.json.JSONObject

/**
 * Bridge to communicate with React-Native Cards Plugin
 *
 * @author Abhishek Kumar
 * @since 1.0.0
 */
class MoEngageCardsBridge(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val tag = "${MODULE_TAG}MoEngageCardsBridge"

    private val context: Context = reactContext.applicationContext
    private val cardsPluginHelper = CardsPluginHelper()

    override fun getName(): String {
        return "MoEngageCardsBridge"
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
    fun initialize(payload: String) {
        try {
            Logger.print { "$tag initialize() : $payload" }
            setCardsEventEmitter(EventEmitterImpl(reactContext))
            cardsPluginHelper.initialise(payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag initialize() : " }
        }
    }

    @ReactMethod
    fun refreshCards(payload: String) {
        try {
            Logger.print { "$tag refreshCards() : $payload" }
            cardsPluginHelper.refreshCards(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag refreshCards() : " }
        }
    }

    @ReactMethod
    fun onCardSectionLoaded(payload: String) {
        try {
            Logger.print { "$tag onCardSectionLoaded() : $payload" }
            cardsPluginHelper.onCardSectionLoaded(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag onCardSectionLoaded() : " }
        }
    }

    @ReactMethod
    fun onCardSectionUnLoaded(payload: String) {
        try {
            Logger.print { "$tag onCardSectionUnLoaded() : $payload" }
            cardsPluginHelper.onCardSectionUnLoaded(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag onCardSectionUnLoaded() : " }
        }
    }

    @ReactMethod
    fun getCardsCategories(payload: String, promise: Promise) {
        try {
            Logger.print { "$tag getCardsCategories() : $payload" }
            val categories = cardsPluginHelper.getCardsCategories(context, payload)
            promise.resolve(categories)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag getCardsCategories() : " }
            promise.reject(t)
        }
    }

    @ReactMethod
    fun getCardsInfo(payload: String, promise: Promise) {
        try {
            Logger.print { "$tag getCardsInfo() : $payload" }
            val cardsInfo = cardsPluginHelper.getCardsInfo(context, payload)
            promise.resolve(cardsInfo)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag getCardsInfo() : " }
            promise.reject(t)
        }
    }

    @ReactMethod
    fun cardClicked(payload: String) {
        try {
            Logger.print { "$tag cardClicked() : $payload" }
            cardsPluginHelper.cardClicked(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag cardClicked() : " }
        }
    }

    @ReactMethod
    fun cardDelivered(payload: String) {
        try {
            Logger.print { "$tag cardDelivered() : $payload" }
            cardsPluginHelper.cardDelivered(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag cardDelivered() : " }
        }
    }

    @ReactMethod
    fun cardShown(payload: String) {
        try {
            Logger.print { "$tag cardShown() : $payload" }
            cardsPluginHelper.cardShown(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag cardShown() : " }
        }
    }

    @ReactMethod
    fun getCardsForCategory(payload: String, promise: Promise) {
        try {
            Logger.print { "$tag getCardsForCategory() : $payload" }
            val cards = cardsPluginHelper.getCardsForCategory(context, payload)
            promise.resolve(cards)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag getCardsForCategory() : " }
            promise.reject(t)
        }
    }

    @ReactMethod
    fun deleteCards(payload: String) {
        try {
            Logger.print { "$tag deleteCards() : $payload" }
            cardsPluginHelper.deleteCards(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag deleteCards() : " }
        }
    }

    @ReactMethod
    fun isAllCategoryEnabled(payload: String, promise: Promise) {
        try {
            Logger.print { "$tag isAllCategoryEnabled() : $payload" }
            val isAllCategoryEnabled = cardsPluginHelper.isAllCategoryEnabled(context, payload)
            promise.resolve(isAllCategoryEnabled)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag isAllCategoryEnabled() : " }
            promise.reject(t)
        }
    }

    @ReactMethod
    fun getNewCardsCount(payload: String, promise: Promise) {
        try {
            Logger.print { "$tag getNewCardsCount() : $payload" }
            val newCardsCountResult = cardsPluginHelper.getNewCardsCount(context, payload)
            promise.resolve(newCardsCountResult)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag getNewCardsCount() : " }
            promise.reject(t)
        }
    }

    @ReactMethod
    fun getUnClickedCardsCount(payload: String, promise: Promise) {
        try {
            Logger.print { "$tag getUnClickedCardsCount() : $payload" }
            val unClickedCardsCount = cardsPluginHelper.getUnClickedCardsCount(context, payload)
            promise.resolve(unClickedCardsCount)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag getUnClickedCardsCount() : " }
            promise.reject(t)
        }
    }

    @ReactMethod
    fun fetchCards(payload: String, promise: Promise) {
        try {
            Logger.print { "$tag fetchCards() : $payload" }
            val accountMetaPayload = JSONObject(payload)
            cardsPluginHelper.fetchCards(context, payload) { cardsData ->
                val response = JSONObject()
                response.put(ARGUMENT_ACCOUNT_META, accountMetaPayload)
                val cardData = JSONObject()
                cardData.put(ARGUMENT_CARDS, cardListToJson(cardsData?.cards ?: emptyList()))
                response.put(ARGUMENT_DATA, cardData)

                promise.resolve(response.toString())
            }
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag fetchCards() : " }
            promise.reject(t)
        }
    }
}