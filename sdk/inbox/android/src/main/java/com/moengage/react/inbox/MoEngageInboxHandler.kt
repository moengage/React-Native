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

package com.moengage.react.inbox

import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.moengage.core.internal.logger.Logger
import com.moengage.core.LogLevel
import com.moengage.plugin.base.inbox.internal.InboxPluginHelper
import com.moengage.plugin.base.inbox.internal.inboxDataToJson
import com.moengage.plugin.base.inbox.internal.unClickedCountToJson

/**
 * Class to handle all the request from the [MoEReactInbox] from both old and new arch
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
internal class MoEngageInboxHandler(private val context: Context){

    private val tag = "MoEngageInboxHandler"

    private val pluginHelper = InboxPluginHelper()

    fun getName() = NAME

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

    fun deleteMessage(payload: String) {
        try {
            pluginHelper.deleteMessage(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag deleteMessage() : " }
        }
    }

    fun trackMessageClicked(payload: String) {
        try {
            pluginHelper.trackMessageClicked(context, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag trackMessageClicked() : " }
        }
    }

    companion object {
        const val NAME = "MoEReactInbox"
    }
}
