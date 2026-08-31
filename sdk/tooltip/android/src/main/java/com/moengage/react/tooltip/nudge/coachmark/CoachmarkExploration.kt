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

package com.moengage.react.tooltip.nudge.coachmark

import android.app.Activity
import android.util.Log
import com.moengage.react.tooltip.common.NativeIdViewFinder
import com.moengage.tooltip.CoachMarkCampaign
import com.moengage.tooltip.CoachMarkStep
import com.moengage.tooltip.MoECoachMarkHelper

/**
 * Resolves each `nativeIds[i]` via the shared `nativeID` tree walk, then hands the whole sequence
 * to the real native MoEngage Tooltip SDK's [MoECoachMarkHelper] — unlike the plain
 * tooltip/beacon/walkthrough helpers, [CoachMarkStep] takes real `title`/`body` text per step, so
 * this bridge's custom-copy contract is a full match and nothing is reimplemented locally anymore.
 *
 * [MoECoachMarkHelper] resolves its XML targets by `View.tag` (the plain `View.setTag(Any?)` slot,
 * via [android.view.View.findViewWithTag]) rather than RN's `nativeID`, so each view resolved here
 * is tagged with a locally-generated string before handing the campaign over — that's what lets the
 * SDK's own internal lookup find the exact view this bridge already resolved. Note this reuses the
 * same tag slot RN's `testID` prop also writes to (`BaseViewManager.setTestId`); harmless here since
 * none of this exploration module's screens set `testID`, but a real integration should pick a
 * dedicated view id slot instead of the default tag if `testID` usage nearby is a possibility.
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
internal object CoachmarkExploration {

    private const val TAG = "MoETooltipCoachmark"
    private const val ANCHOR_TAG_PREFIX = "moe_rn_coachmark_"

    fun start(activity: Activity, nativeIds: List<String>, titles: List<String>, bodies: List<String>) {
        if (nativeIds.isEmpty()) return

        val steps = mutableListOf<CoachMarkStep>()
        nativeIds.forEachIndexed { index, nativeId ->
            val match = NativeIdViewFinder.find(activity.window.decorView, nativeId)
            if (match == null) {
                Log.w(TAG, "start() : no view found for nativeID='$nativeId', skipping")
                return@forEachIndexed
            }

            val anchorTag = "$ANCHOR_TAG_PREFIX$index"
            match.tag = anchorTag
            steps += CoachMarkStep(
                anchorTag = anchorTag,
                title = titles.getOrElse(index) { "" },
                body = bodies.getOrElse(index) { "" },
            )
        }

        if (steps.isEmpty()) {
            Log.w(TAG, "start() : no nativeIds resolved to a view, nothing to show")
            return
        }

        MoECoachMarkHelper.start(activity, CoachMarkCampaign(id = "rn_coachmark", steps = steps))
    }

    fun dismiss() {
        MoECoachMarkHelper.dismiss()
    }
}
