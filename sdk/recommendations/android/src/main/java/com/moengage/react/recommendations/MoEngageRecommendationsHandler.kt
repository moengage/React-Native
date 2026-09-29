/*
 * Copyright (c) 2026 MoEngage, Inc.
 * All rights reserved.
 * Use of source code or binaries contained within MoEngage's SDKs is permitted only to enable use of the MoEngage platform by customers of MoEngage. The Licensee may not:
 * - permit any third party to use the Software;
 * - modify or translate the Software except as otherwise permitted;
 * - reverse engineer, decompile, or disassemble the Software;
 * - copy the Software, except as expressly provided above; or
 * - remove or obscure any proprietary rights notices or labels on the Software.
 * - Licensee may not transfer the Software or any rights under this Agreement without the Licensor's prior written consent.
 * - MoEngage owns the Software and all intellectual property rights embodied therein, including copyrights and valuable trade secrets embodied in the Software. The Licensee shall not alter or remove this copyright notice.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF THE USER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

package com.moengage.react.recommendations

import android.content.Context
import com.facebook.react.bridge.Promise
import com.moengage.plugin.base.recommendations.RecommendationsHelper
import com.moengage.plugin.base.recommendations.RecommendationsListener
import com.moengage.platform.internal.logger.Logger
import com.moengage.platform.internal.logger.PlatformLogLevel

/**
 * Class to handle all the requests from [MoEReactRecommendations].
 */
internal class MoEngageRecommendationsHandler(private val context: Context) {

    private val tag = "MoEngageRecommendationsHandler"
    private val pluginHelper = RecommendationsHelper()

    fun getName() = NAME

    fun fetchRecommendations(payload: String, promise: Promise) {
        try {
            Logger.record { "$tag fetchRecommendations(): $payload" }
            pluginHelper.fetchRecommendations(
                context,
                payload,
                object : RecommendationsListener {
                    override fun onSuccess(result: String) {
                        promise.resolve(result)
                    }

                    override fun onFailure(reason: String, message: String) {
                        Logger.record { "$tag fetchRecommendations(): failed with reason: $reason and message: $message" }
                        promise.reject(reason, message)
                    }
                })
        } catch (t: Throwable) {
            Logger.record(PlatformLogLevel.ERROR, t) { "$tag fetchRecommendations(): " }
            promise.reject(REASON_UNKNOWN_ERROR, t.message ?: "")
        }
    }

    companion object {
        const val NAME = "MoEngageRecommendationsBridge"

        /**
         * Reported when the bridge fails before the plugin-base helper reports a reason of its own.
         * Mirrors `RecommendationsFailureReason.UNKNOWN_ERROR` on the JS side.
         */
        private const val REASON_UNKNOWN_ERROR = "UNKNOWN_ERROR"
    }
}
