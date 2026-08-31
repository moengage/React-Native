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

package com.moengage.react.tooltip

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray

/**
 * Bridge to communicate with the React-Native Tooltip Exploration Plugin in old arch
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
class MoEngageTooltipBridge(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    private val bridgeHandler = MoEngageTooltipBridgeHandler(reactContext)

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
    fun dismissOverlay() {
        bridgeHandler.dismissOverlay()
    }

    @ReactMethod
    fun dismissFloatingWindowOverlay() {
        bridgeHandler.dismissFloatingWindowOverlay()
    }

    @ReactMethod
    fun findAndShowByNativeId(nativeId: String, label: String) {
        bridgeHandler.findAndShowByNativeId(nativeId, label)
    }

    @ReactMethod
    fun findAndShowByAccessibilityLabel(text: String, label: String) {
        bridgeHandler.findAndShowByAccessibilityLabel(text, label)
    }

    @ReactMethod
    fun findAndShowBeaconByNativeId(nativeId: String, label: String) {
        bridgeHandler.findAndShowBeaconByNativeId(nativeId, label)
    }

    @ReactMethod
    fun dismissBeacon() {
        bridgeHandler.dismissBeacon()
    }

    @ReactMethod
    fun findAndShowSpotlightByNativeId(nativeId: String) {
        bridgeHandler.findAndShowSpotlightByNativeId(nativeId)
    }

    @ReactMethod
    fun dismissSpotlight() {
        bridgeHandler.dismissSpotlight()
    }

    @ReactMethod
    fun startWalkthroughByNativeIds(nativeIds: ReadableArray, labels: ReadableArray) {
        bridgeHandler.startWalkthroughByNativeIds(nativeIds.toStringList(), labels.toStringList())
    }

    @ReactMethod
    fun dismissWalkthrough() {
        bridgeHandler.dismissWalkthrough()
    }

    @ReactMethod
    fun startCoachmarkByNativeIds(nativeIds: ReadableArray, titles: ReadableArray, bodies: ReadableArray) {
        bridgeHandler.startCoachmarkByNativeIds(
            nativeIds.toStringList(),
            titles.toStringList(),
            bodies.toStringList()
        )
    }

    @ReactMethod
    fun dismissCoachmark() {
        bridgeHandler.dismissCoachmark()
    }

    private fun ReadableArray.toStringList(): List<String> = (0 until size()).map { getString(it) ?: "" }
}
