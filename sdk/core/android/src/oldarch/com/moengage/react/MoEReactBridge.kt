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
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.moengage.core.internal.logger.Logger

/**
 * Bridge to communicate with js code in old arch
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
class MoEReactBridge(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    private val tag = "${MODULE_TAG}MoEReactBridge"
    private val bridgeHandler = MoEReactBridgeHandler(reactContext)

    override fun getName() = bridgeHandler.getName()

    @ReactMethod
    fun addListener(eventName: String) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    fun setAppStatus(payload: String) {
        bridgeHandler.setAppStatus(payload)
    }

    @ReactMethod
    fun trackEvent(payload: String) {
        bridgeHandler.trackEvent(payload)
    }

    @ReactMethod
    fun setUserAttribute(payload: String) {
        bridgeHandler.setUserAttribute(payload)
    }

    @ReactMethod
    fun logout(payload: String) {
        bridgeHandler.logout(payload)
    }

    @ReactMethod
    fun setAlias(payload: String) {
        bridgeHandler.setAlias(payload)
    }

    @ReactMethod
    fun setAppContext(payload: String) {
        bridgeHandler.setAppContext(payload)
    }

    @ReactMethod
    fun resetAppContext(payload: String) {
        bridgeHandler.resetAppContext(payload)
    }

    @ReactMethod
    fun showInApp(payload: String) {
        bridgeHandler.showInApp(payload)
    }

    @ReactMethod
    fun getSelfHandledInApp(payload: String) {
        bridgeHandler.getSelfHandledInApp(payload)
    }

    @ReactMethod
    fun passFcmPushToken(payload: String) {
        bridgeHandler.passPushToken(payload)
    }

    @ReactMethod
    fun passPushKitPushToken(payload: String) {
        bridgeHandler.passPushToken(payload)
    }

    @ReactMethod
    fun passFcmPushPayload(payload: String) {
        bridgeHandler.passPushPayload(payload)
    }

    @ReactMethod
    fun initialize(payload: String) {
        Logger.print { "$tag initializing module in old arch" }
        bridgeHandler.initialize(payload)
    }

    @ReactMethod
    fun updateSelfHandledInAppStatus(payload: String) {
        bridgeHandler.selfHandledCallback(payload)
    }

    @ReactMethod
    fun optOutDataTracking(payload: String) {
        bridgeHandler.optOutTracking(payload)
    }

    @ReactMethod
    fun updateSdkState(payload: String) {
        bridgeHandler.updateSdkState(payload)
    }

    @ReactMethod
    fun onOrientationChanged() {
        bridgeHandler.onOrientationChanged()
    }

    @ReactMethod
    fun deviceIdentifierTrackingStatusUpdate(payload: String) {
        bridgeHandler.deviceIdentifierTrackingStatusUpdate(payload)
    }

    @ReactMethod
    fun setupNotificationChannels() {
        bridgeHandler.setupNotificationChannels()
    }

    @ReactMethod
    fun navigateToSettingsAndroid() {
        bridgeHandler.navigateToSettings()
    }

    @ReactMethod
    fun requestPushPermissionAndroid() {
        bridgeHandler.requestPushPermission()
    }

    @ReactMethod
    fun pushPermissionResponseAndroid(payload: String) {
        bridgeHandler.permissionResponse(payload)
    }

    @ReactMethod
    fun updatePushPermissionRequestCountAndroid(payload: String) {
        bridgeHandler.updatePushPermissionRequestCount(payload)
    }

    @ReactMethod
    fun deleteUser(payload: String, promise: Promise) {
        bridgeHandler.deleteUser(payload, promise)
    }

    @ReactMethod
    fun showNudge(payload: String) {
        bridgeHandler.showNudge(payload)
    }
}