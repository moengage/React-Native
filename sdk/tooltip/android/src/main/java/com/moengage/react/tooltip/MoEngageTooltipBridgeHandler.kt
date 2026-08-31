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

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil
import com.moengage.react.tooltip.nudge.beacon.BeaconExploration
import com.moengage.react.tooltip.nudge.coachmark.CoachmarkExploration
import com.moengage.react.tooltip.nudge.spotlight.SpotlightExploration
import com.moengage.react.tooltip.nudge.walkthrough.WalkthroughExploration
import com.moengage.react.tooltip.nudge.tooltip.AccessibilityLabelWalkExploration
import com.moengage.react.tooltip.nudge.tooltip.NativeTreeWalkExploration
import com.moengage.tooltip.MoETooltipHelper

/**
 * Handles all requests from [MoEngageTooltipBridge] from both old and new arch, delegating each
 * method to the exploration "way" that implements it. Every method here takes only an id/label —
 * never a coordinate or a measured view from RN — and resolves the actual target View natively before
 * rendering, so every tooltip in this module is genuinely attached to a real, specific view rather
 * than a fixed screen position.
 *
 * Every method below that touches the view hierarchy runs its body via [UiThreadUtil.runOnUiThread]:
 * under the New Architecture, TurboModule methods are invoked on the native-modules thread, not the
 * main/UI thread, so calling `ViewGroup.addView`/`findViewById`/etc. directly here throws
 * `CalledFromWrongThreadException` — silently swallowed by the try/catch below if not dispatched to
 * the UI thread first, which looks from JS like "the call succeeded but nothing rendered".
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
internal class MoEngageTooltipBridgeHandler(private val reactContext: ReactApplicationContext) {

    private val tag = "${MODULE_TAG}MoEngageTooltipBridgeHandler"

    fun getName() = NAME

    fun dismissOverlay() {
        Log.d(tag, "dismissOverlay() : ")
        runOnUiThread("dismissOverlay") { MoETooltipHelper.dismiss() }
    }

    fun dismissFloatingWindowOverlay() {
        Log.d(tag, "dismissFloatingWindowOverlay() : ")
        runOnUiThread("dismissFloatingWindowOverlay") { MoETooltipHelper.dismiss() }
    }

    /**
     * nudge/tooltip/nativetreewalk — resolves by nativeID tag, renders via the real native
     * MoEngage Tooltip SDK's [MoETooltipHelper].
     */
    fun findAndShowToolTipByNativeId(nativeId: String, label: String) {
        Log.d(tag, "findAndShowToolTipByNativeId() : nativeId=$nativeId label=$label")
        val activity = reactContext.currentActivity
        if (activity == null) {
            Log.w(tag, "findAndShowToolTipByNativeId() : no current activity")
            return
        }
        runOnUiThread("findAndShowToolTipByNativeId") {
            NativeTreeWalkExploration.findAndShow(activity, nativeId, label)
        }
    }

    /**
     * nudge/tooltip/accessibilitylabelwalk — resolves by contentDescription instead of nativeID,
     * renders via the same real native MoEngage Tooltip SDK's [MoETooltipHelper] as
     * [findAndShowToolTipByNativeId] — the two "ways" differ only in resolution strategy now.
     */
    fun findAndShowToolTipByAccessibilityLabel(text: String, label: String) {
        Log.d(tag, "findAndShowToolTipByAccessibilityLabel() : text=$text label=$label")
        val activity = reactContext.currentActivity
        if (activity == null) {
            Log.w(tag, "findAndShowToolTipByAccessibilityLabel() : no current activity")
            return
        }
        runOnUiThread("findAndShowToolTipByAccessibilityLabel") {
            AccessibilityLabelWalkExploration.findAndShow(activity, text, label)
        }
    }

    /** nudge/beacon — pulsating dot resolved by nativeID, rendered by the real native SDK's MoEBeaconHelper. */
    fun findAndShowBeaconByNativeId(nativeId: String, label: String) {
        Log.d(tag, "findAndShowBeaconByNativeId() : nativeId=$nativeId label=$label")
        val activity = reactContext.currentActivity
        if (activity == null) {
            Log.w(tag, "findAndShowBeaconByNativeId() : no current activity")
            return
        }
        runOnUiThread("findAndShowBeaconByNativeId") {
            BeaconExploration.findAndShow(activity, nativeId, label)
        }
    }

    fun dismissBeacon() {
        Log.d(tag, "dismissBeacon() : ")
        runOnUiThread("dismissBeacon") { BeaconExploration.dismiss() }
    }

    /** nudge/spotlight — full-screen dim scrim with a cutout resolved by nativeID. */
    fun findAndShowSpotlightByNativeId(nativeId: String) {
        Log.d(tag, "findAndShowSpotlightByNativeId() : nativeId=$nativeId")
        val activity = reactContext.currentActivity
        if (activity == null) {
            Log.w(tag, "findAndShowSpotlightByNativeId() : no current activity")
            return
        }
        runOnUiThread("findAndShowSpotlightByNativeId") {
            SpotlightExploration.findAndShow(activity, nativeId)
        }
    }

    fun dismissSpotlight() {
        Log.d(tag, "dismissSpotlight() : ")
        runOnUiThread("dismissSpotlight") { SpotlightExploration.dismiss() }
    }

    /** nudge/walkthrough — sequence of nativeIDs, stepped by the real native SDK's MoEWalkthroughHelper. */
    fun startWalkthroughByNativeIds(nativeIds: List<String>, labels: List<String>) {
        Log.d(tag, "startWalkthroughByNativeIds() : nativeIds=$nativeIds")
        val activity = reactContext.currentActivity
        if (activity == null) {
            Log.w(tag, "startWalkthroughByNativeIds() : no current activity")
            return
        }
        runOnUiThread("startWalkthroughByNativeIds") {
            WalkthroughExploration.start(activity, nativeIds, labels)
        }
    }

    fun dismissWalkthrough() {
        Log.d(tag, "dismissWalkthrough() : ")
        runOnUiThread("dismissWalkthrough") { WalkthroughExploration.dismiss() }
    }

    /** nudge/coachmark — sequence of nativeIDs, target lifted above a dim scrim, tap advances. */
    fun startCoachmarkByNativeIds(nativeIds: List<String>, titles: List<String>, bodies: List<String>) {
        Log.d(tag, "startCoachmarkByNativeIds() : nativeIds=$nativeIds")
        val activity = reactContext.currentActivity
        if (activity == null) {
            Log.w(tag, "startCoachmarkByNativeIds() : no current activity")
            return
        }
        runOnUiThread("startCoachmarkByNativeIds") {
            CoachmarkExploration.start(activity, nativeIds, titles, bodies)
        }
    }

    fun dismissCoachmark() {
        Log.d(tag, "dismissCoachmark() : ")
        runOnUiThread("dismissCoachmark") { CoachmarkExploration.dismiss() }
    }

    /** Dispatches [block] onto the UI thread (required for any view-hierarchy work) and logs any failure. */
    private fun runOnUiThread(methodName: String, block: () -> Unit) {
        UiThreadUtil.runOnUiThread {
            try {
                block()
            } catch (t: Throwable) {
                Log.e(tag, "$methodName() : ", t)
            }
        }
    }

    companion object {
        const val NAME = "MoEngageTooltipBridge"
    }
}
