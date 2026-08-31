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

package com.moengage.react.tooltip.nudge.spotlight

import android.app.Activity
import android.util.Log
import com.moengage.react.tooltip.common.NativeIdViewFinder
import com.moengage.tooltip.MoESpotlightHelper
import com.moengage.tooltip.SpotlightShape

/**
 * Resolves [nativeId] via the shared `nativeID` tree walk, same as every other "way" in this
 * module, then hands the resolved [android.view.View] straight to the real native MoEngage
 * Tooltip SDK's [MoESpotlightHelper] — spotlight has no text content (just a scrim + cutout), so
 * its public View-based API is a full match for what this bridge needs; nothing here is
 * reimplemented locally anymore.
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
internal object SpotlightExploration {

    private const val TAG = "MoETooltipSpotlight"

    fun findAndShow(activity: Activity, nativeId: String) {
        val match = NativeIdViewFinder.find(activity.window.decorView, nativeId)
        if (match == null) {
            Log.w(TAG, "findAndShow() : no view found for nativeID='$nativeId'")
            return
        }
        MoESpotlightHelper.showSpotlight(activity, match, SpotlightShape.ROUNDED_RECT)
    }

    fun dismiss() {
        MoESpotlightHelper.dismiss()
    }
}
