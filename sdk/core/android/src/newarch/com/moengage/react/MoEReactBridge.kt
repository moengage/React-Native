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

package com.moengage.react

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.moengage.core.internal.logger.Logger

/**
 * Bridge to communicate with js code in new arch
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
class MoEReactBridge(reactContext: ReactApplicationContext) : NativeMoEngageSpec(reactContext) {

    private val tag = "${MODULE_TAG}MoEReactBridge"
    private val bridgeHandler = MoEReactBridgeHandler(reactContext)

    override fun getName() = bridgeHandler.getName()

    override fun addListener(eventType: String) {
    }

    override fun removeListeners(count: Double) {
    }

    override fun initialize(payload: String) {
        Logger.print { "$tag initializing module in new arch" }
        bridgeHandler.initialize(payload)
    }

    override fun setAppStatus(payload: String) {
        bridgeHandler.setAppStatus(payload)
    }

    override fun trackEvent(payload: String) {
        bridgeHandler.trackEvent(payload)
    }

    override fun setUserAttribute(payload: String) {
        bridgeHandler.setUserAttribute(payload)
    }

    override fun setAlias(payload: String) {
        bridgeHandler.setAlias(payload)
    }

    override fun logout(payload: String) {
        bridgeHandler.logout(payload)
    }

    override fun showInApp(payload: String) {
        bridgeHandler.showInApp(payload)
    }

    override fun showNudge(payload: String) {
        bridgeHandler.showNudge(payload)
    }

    override fun getSelfHandledInApp(payload: String) {
        bridgeHandler.getSelfHandledInApp(payload)
    }

    override fun updateSelfHandledInAppStatus(payload: String) {
        bridgeHandler.selfHandledCallback(payload)
    }

    override fun setAppContext(payload: String) {
        bridgeHandler.setAppContext(payload)
    }

    override fun resetAppContext(payload: String) {
        bridgeHandler.resetAppContext(payload)
    }

    override fun optOutDataTracking(payload: String) {
        bridgeHandler.optOutTracking(payload)
    }

    override fun updateSdkState(payload: String) {
        bridgeHandler.updateSdkState(payload)
    }

    override fun passFcmPushToken(payload: String) {
        bridgeHandler.passPushToken(payload)
    }

    override fun passFcmPushPayload(payload: String) {
        bridgeHandler.passPushPayload(payload)
    }

    override fun passPushKitPushToken(payload: String) {
        bridgeHandler.passPushToken(payload)
    }

    override fun onOrientationChanged() {
        bridgeHandler.onOrientationChanged()
    }

    override fun pushPermissionResponseAndroid(payload: String) {
        bridgeHandler.permissionResponse(payload)
    }

    override fun setupNotificationChannels() {
        bridgeHandler.setupNotificationChannels()
    }

    override fun navigateToSettingsAndroid() {
        bridgeHandler.navigateToSettings()
    }

    override fun requestPushPermissionAndroid() {
        bridgeHandler.requestPushPermission()
    }

    override fun updatePushPermissionRequestCountAndroid(payload: String) {
        bridgeHandler.updatePushPermissionRequestCount(payload)
    }

    override fun deviceIdentifierTrackingStatusUpdate(payload: String) {
        bridgeHandler.deviceIdentifierTrackingStatusUpdate(payload)
    }

    override fun deleteUser(payload: String, promise: Promise) {
        bridgeHandler.deleteUser(payload, promise)
    }

    override fun registerForPush() {
        // iOS only
    }

    override fun getSelfHandledInApps(payload: String, promise: Promise) {
        bridgeHandler.getSelfHandledInApps(payload, promise)
    }

    override fun registerForProvisionalPush() {
        //iOS only
    }
}