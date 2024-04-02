/*
 * Copyright (c) 2014-2024 MoEngage Inc.
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

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext

/**
 * Bridge to communicate with React-Native Cards Plugin in new arch
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
class MoEngageCardsBridge(reactContext: ReactApplicationContext) :
    NativeMoEngageCardsSpec(reactContext) {

    private val bridgeHandler = MoEngageCardsBridgeHandler(reactContext)

    override fun getName() = bridgeHandler.getName()

    override fun addListener(eventName: String) {
    }

    override fun removeListeners(count: Double) {
    }

    override fun initialize(payload: String) {
        bridgeHandler.initialize(payload)
    }

    override fun refreshCards(payload: String) {
        bridgeHandler.refreshCards(payload)
    }

    override fun onCardSectionLoaded(payload: String) {
        bridgeHandler.onCardSectionLoaded(payload)
    }

    override fun onCardSectionUnLoaded(payload: String) {
        bridgeHandler.onCardSectionUnLoaded(payload)
    }

    override fun getCardsCategories(payload: String, promise: Promise) {
        bridgeHandler.getCardsCategories(payload, promise)
    }

    override fun getCardsInfo(payload: String, promise: Promise) {
        bridgeHandler.getCardsInfo(payload, promise)
    }

    override fun cardClicked(payload: String) {
        bridgeHandler.cardClicked(payload)
    }

    override fun cardDelivered(payload: String) {
        bridgeHandler.cardDelivered(payload)
    }

    override fun cardShown(payload: String) {
        bridgeHandler.cardShown(payload)
    }

    override fun getCardsForCategory(payload: String, promise: Promise) {
        bridgeHandler.getCardsForCategory(payload, promise)
    }

    override fun deleteCards(payload: String) {
        bridgeHandler.deleteCards(payload)
    }

    override fun isAllCategoryEnabled(payload: String, promise: Promise) {
        bridgeHandler.isAllCategoryEnabled(payload, promise)
    }

    override fun getNewCardsCount(payload: String, promise: Promise) {
        bridgeHandler.getNewCardsCount(payload, promise)
    }

    override fun getUnClickedCardsCount(payload: String, promise: Promise) {
        bridgeHandler.getUnClickedCardsCount(payload, promise)
    }

    override fun fetchCards(payload: String, promise: Promise) {
        bridgeHandler.fetchCards(payload, promise)
    }
}