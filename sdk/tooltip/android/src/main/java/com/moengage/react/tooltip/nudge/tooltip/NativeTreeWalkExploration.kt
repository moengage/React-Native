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

package com.moengage.react.tooltip.nudge.tooltip

import android.app.Activity
import android.util.Log
import com.moengage.react.tooltip.common.NativeIdViewFinder
import com.moengage.tooltip.MoETooltipHelper
import com.moengage.tooltip.TooltipPosition

/**
 * Exploration way (nudge/tooltip/nativetreewalk): no JS ref/measure round-trip at all — given just a
 * `nativeID` string, native recursively walks the Activity's real Android view tree looking for a
 * match.
 *
 * The resolved [android.view.View] is tagged with a locally-generated string, then handed to
 * [MoETooltipHelper]'s tag-based `showTooltip(activity, tag, position)` overload — rather than its
 * View overload — specifically so [MoETooltipHelper] keeps tracking that tag afterwards (live
 * position while the row scrolls, hide/reattach if it scrolls out of an RN `FlatList`'s window; see
 * `recyclerview-tooltip-handling.md` at the React-Native repo root). The View overload alone has no
 * tag to re-match a remounted row against, so it can't participate in that tracking. A fresh prefix
 * per call (mirrors [com.moengage.react.tooltip.nudge.coachmark.CoachmarkExploration]) avoids a
 * stale tag from an earlier call colliding with this one.
 *
 * [label] is accepted for API compatibility with the bridge's existing contract but unused: none of
 * [MoETooltipHelper]'s public `showTooltip` overloads take custom title/message text — the SDK
 * always shows its own fixed placeholder copy internally, so this "way" now demonstrates the real
 * production tooltip visuals rather than a custom-labelled bubble.
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
internal object NativeTreeWalkExploration {

    private const val TAG = "MoETooltipNativeTreeWalk"
    private const val ANCHOR_TAG_PREFIX = "moe_rn_tooltip_"

    private var callSequence = 0

    fun findAndShow(activity: Activity, nativeId: String, label: String) {
        val match = NativeIdViewFinder.find(activity, nativeId)
        if (match == null) {
            Log.w(TAG, "findAndShow() : no view found for nativeID='$nativeId'")
            return
        }
        val anchorTag = "$ANCHOR_TAG_PREFIX${callSequence++}"
        match.tag = anchorTag
        MoETooltipHelper.showTooltip(activity, anchorTag, TooltipPosition.AUTO)
    }
}
