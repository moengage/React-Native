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
import com.facebook.react.bridge.ReadableArray

/**
 * Bridge to communicate with the React-Native Tooltip Exploration Plugin in new arch
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
class MoEngageTooltipBridge(reactContext: ReactApplicationContext) :
    NativeMoEngageTooltipSpec(reactContext) {

    private val bridgeHandler = MoEngageTooltipBridgeHandler(reactContext)

    override fun getName() = bridgeHandler.getName()

    override fun addListener(eventName: String) {
    }

    override fun removeListeners(count: Double) {
    }

    override fun dismissOverlay() {
        bridgeHandler.dismissOverlay()
    }

    override fun dismissFloatingWindowOverlay() {
        bridgeHandler.dismissFloatingWindowOverlay()
    }

    override fun findAndShowToolTipByNativeId(nativeId: String, label: String) {
        bridgeHandler.findAndShowToolTipByNativeId(nativeId, label)
    }

    override fun findAndShowToolTipByAccessibilityLabel(text: String, label: String) {
        bridgeHandler.findAndShowToolTipByAccessibilityLabel(text, label)
    }

    override fun findAndShowBeaconByNativeId(nativeId: String, label: String) {
        bridgeHandler.findAndShowBeaconByNativeId(nativeId, label)
    }

    override fun dismissBeacon() {
        bridgeHandler.dismissBeacon()
    }

    override fun findAndShowSpotlightByNativeId(nativeId: String) {
        bridgeHandler.findAndShowSpotlightByNativeId(nativeId)
    }

    override fun dismissSpotlight() {
        bridgeHandler.dismissSpotlight()
    }

    override fun startWalkthroughByNativeIds(nativeIds: ReadableArray, labels: ReadableArray) {
        bridgeHandler.startWalkthroughByNativeIds(nativeIds.toStringList(), labels.toStringList())
    }

    override fun dismissWalkthrough() {
        bridgeHandler.dismissWalkthrough()
    }

    override fun startCoachmarkByNativeIds(nativeIds: ReadableArray, titles: ReadableArray, bodies: ReadableArray) {
        bridgeHandler.startCoachmarkByNativeIds(
            nativeIds.toStringList(),
            titles.toStringList(),
            bodies.toStringList()
        )
    }

    override fun dismissCoachmark() {
        bridgeHandler.dismissCoachmark()
    }

    private fun ReadableArray.toStringList(): List<String> = (0 until size()).map { getString(it) ?: "" }
}
