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

package com.moengage.react.tooltip.nudge.walkthrough

import android.app.Activity
import android.util.Log
import com.moengage.react.tooltip.common.NativeIdViewFinder
import com.moengage.tooltip.MoEWalkthroughHelper

/**
 * Resolves each `nativeIds[i]` via the shared `nativeID` tree walk, then hands the whole sequence to
 * the real native MoEngage Tooltip SDK's [MoEWalkthroughHelper] (`com.moengage:tooltip`, published
 * locally via publishToMavenLocal) — native now owns all stepping/advancement/back-navigation
 * itself, including its own "Next →" / "← Back" / "Done" chrome.
 *
 * [MoEWalkthroughHelper] resolves each step by `View.tag` (via
 * [android.view.View.findViewWithTag]) rather than RN's `nativeID`, so each view resolved here is
 * tagged with a locally-generated string before handing the ordered tag list over — same technique
 * [com.moengage.react.tooltip.nudge.coachmark.CoachmarkExploration] uses. [labels] is accepted for
 * API compatibility but unused: the SDK's per-step copy is fixed placeholder text with only the
 * step counter/Next/Back chrome varying — there's no public parameter for custom step text.
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
internal object WalkthroughExploration {

    private const val TAG = "MoETooltipWalkthrough"
    private const val ANCHOR_TAG_PREFIX = "moe_rn_walkthrough_"

    fun start(activity: Activity, nativeIds: List<String>, labels: List<String>) {
        if (nativeIds.isEmpty()) return

        val anchorTags = mutableListOf<String>()
        nativeIds.forEachIndexed { index, nativeId ->
            val match = NativeIdViewFinder.find(activity, nativeId)
            if (match == null) {
                Log.w(TAG, "start() : no view found for nativeID='$nativeId', skipping")
                return@forEachIndexed
            }
            val anchorTag = "$ANCHOR_TAG_PREFIX$index"
            match.tag = anchorTag
            anchorTags += anchorTag
        }

        if (anchorTags.isEmpty()) {
            Log.w(TAG, "start() : no nativeIds resolved to a view, nothing to show")
            return
        }

        MoEWalkthroughHelper.start(activity, anchorTags)
    }

    fun dismiss() {
        MoEWalkthroughHelper.dismiss()
    }
}
