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

package com.moengage.react.tooltip.viewresolution.nativetreewalk

import android.app.Activity
import android.util.Log
import com.moengage.react.tooltip.common.NativeIdViewFinder
import com.moengage.react.tooltip.common.OverlayHost

/**
 * Exploration way (viewresolution/nativetreewalk): no JS ref/measure round-trip at all — given just a
 * `nativeID` string, native recursively walks the Activity's real Android view tree (the RN-rendered
 * views are genuine `android.view.View`s under the decor view) looking for a match, resolves its
 * on-screen rect itself via [View.getLocationOnScreen], and renders through the same
 * [OverlayHost] every other "way" in this module renders through.
 *
 * Depends on RN's `nativeID` native tag key, [com.facebook.react.R.id.view_tag_native_id] — the same
 * one Appium/Detox's Android driver uses to find RN views from outside JS. Not verified against this
 * exact RN version, so the lookup is wrapped defensively and logs clearly on failure instead of
 * crashing; see `REACT_NATIVE_TOOLTIP_EXPLORATION.md` Section 4.2 for the reasoning behind this way.
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
internal object NativeTreeWalkExploration {

    private const val TAG = "MoETooltipNativeTreeWalk"

    fun findAndShow(activity: Activity, nativeId: String, label: String) {
        val match = NativeIdViewFinder.find(activity.window.decorView, nativeId)
        if (match == null) {
            Log.w(TAG, "findAndShow() : no view found for nativeID='$nativeId'")
            return
        }

        val location = IntArray(2)
        match.getLocationOnScreen(location)
        OverlayHost.show(activity, location[0], location[1], match.width, match.height, label)
    }
}
