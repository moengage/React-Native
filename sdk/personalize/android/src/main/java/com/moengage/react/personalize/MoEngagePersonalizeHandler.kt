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

package com.moengage.react.personalize

import android.content.Context
import com.facebook.react.bridge.Promise
import com.moengage.plugin.base.personalization.PersonalizationHelper
import com.moengage.plugin.base.personalization.PersonalizeExperienceListener
import com.moengage.core.LogLevel
import com.moengage.core.internal.logger.Logger
import com.moengage.core.model.RequestFailureReasonCode

/**
 * Class to handle all the requests from [MoEReactPersonalize] from both old and new arch.
 * @author Abhishek Kumar
 */
internal class MoEngagePersonalizeHandler(private val context: Context) {

    private val tag = "MoEngagePersonalizeHandler"
    private val pluginHelper = PersonalizationHelper()

    fun getName() = NAME

    fun fetchExperiencesMeta(payload: String, promise: Promise) {
        try {
            Logger.print { "$tag fetchExperiencesMeta(): $payload" }
            pluginHelper.fetchExperiencesMeta(
                context,
                payload,
                object : PersonalizeExperienceListener {
                    override fun onSuccess(result: String) {
                        promise.resolve(result)
                    }

                    override fun onFailure(reason: RequestFailureReasonCode, message: String) {
                        Logger.print { "$tag fetchExperiencesMeta(): failed with reason: $reason and message: $message" }
                        promise.reject(reason.name, message)
                    }
                })
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag fetchExperiencesMeta(): " }
            promise.reject(RequestFailureReasonCode.UNKNOWN_ERROR.name, t.message ?: "")
        }
    }

    fun fetchExperiences(payload: String, promise: Promise) {
        try {
            Logger.print { "$tag fetchExperiences(): $payload" }
            pluginHelper.fetchExperiences(
                context,
                payload,
                object : PersonalizeExperienceListener {
                    override fun onSuccess(result: String) {
                        promise.resolve(result)
                    }

                    override fun onFailure(reason: RequestFailureReasonCode, message: String) {
                        Logger.print { "$tag fetchExperiences(): failed with reason: $reason and message: $message" }
                        promise.reject(reason.name, message)
                    }
                })
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag fetchExperiences(): " }
            promise.reject(RequestFailureReasonCode.UNKNOWN_ERROR.name, t.message ?: "")
        }
    }

    fun trackExperienceShown(payload: String) {
        Logger.print { "$tag trackExperienceShown(): $payload" }
        pluginHelper.experiencesShown(context, payload)
    }

    fun trackExperienceClicked(payload: String) {
        Logger.print { "$tag trackExperienceClicked(): $payload" }
        pluginHelper.experienceClicked(context, payload)
    }

    fun trackOfferingShown(payload: String) {
        Logger.print { "$tag trackOfferingShown(): $payload" }
        pluginHelper.offeringsShown(context, payload)
    }

    fun trackOfferingClicked(payload: String) {
        Logger.print { "$tag trackOfferingClicked(): $payload" }
        pluginHelper.offeringClicked(context, payload)
    }

    companion object {
        const val NAME = "MoEngagePersonalizeBridge"
    }
}
