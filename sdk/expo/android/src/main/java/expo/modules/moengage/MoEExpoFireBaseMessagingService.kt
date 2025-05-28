/*
 * Copyright (c) 2014-2021 MoEngage Inc.
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
package expo.modules.moengage

import com.google.firebase.messaging.RemoteMessage
import com.moengage.core.LogLevel
import com.moengage.core.internal.logger.Logger
import com.moengage.pushbase.MoEPushHelper
import com.moengage.firebase.MoEFireBaseHelper
import expo.modules.notifications.service.ExpoFirebaseMessagingService
import expo.modules.moengage.internal.BASE_TAG

/**
 * Class for receiving Firebase Cloud Messaging while using expo notification service
 * @author Abhishek Kumar
 */
public class MoEExpoFireBaseMessagingService : ExpoFirebaseMessagingService() {

    private val tag = "${BASE_TAG}_MoEExpoFireBaseMessagingService"

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        try {
            Logger.print { "$tag onMessageReceived(): " }
            val pushPayload = remoteMessage.data
            if (MoEPushHelper.getInstance().isFromMoEngagePlatform(pushPayload)) {
                Logger.print { "$tag onMessageReceived(): Will try to show push" }
                MoEFireBaseHelper.getInstance().passPushPayload(applicationContext, pushPayload)
            } else {
                Logger.print { "$tag onMessageReceived(): passing callback to expo service" }
                super.onMessageReceived(remoteMessage)
            }
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag onMessageReceived() : " }
        }
    }

    override fun onNewToken(token: String) {
        try {
            Logger.print { "$tag onNewToken(): $token" }
            MoEFireBaseHelper.getInstance().passPushToken(applicationContext, token)
            super.onNewToken(token)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag onNewToken(): " }
        }
    }
}