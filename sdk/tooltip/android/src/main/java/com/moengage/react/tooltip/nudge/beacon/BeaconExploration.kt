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

package com.moengage.react.tooltip.nudge.beacon

import android.app.Activity
import android.util.Log
import com.moengage.react.tooltip.common.NativeIdViewFinder
import com.moengage.tooltip.BeaconPosition
import com.moengage.tooltip.MoEBeaconHelper

/**
 * Resolves [nativeId] by walking the real Android view tree (same mechanism as
 * [com.moengage.react.tooltip.nudge.tooltip.NativeTreeWalkExploration]) and hands the
 * resolved [android.view.View] to the real native MoEngage Tooltip SDK's [MoEBeaconHelper]
 * (`com.moengage:tooltip`, published locally via publishToMavenLocal).
 *
 * [label] is accepted for API compatibility but unused: [MoEBeaconHelper]'s tap-to-reveal card is
 * driven internally by the same fixed placeholder [MoETooltipHelper][com.moengage.tooltip.MoETooltipHelper]
 * copy — there's no public parameter to pass custom text — so this "way" now demonstrates the real
 * production beacon (pulse animation, dot placement, reveal card) rather than a custom-labelled one.
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
internal object BeaconExploration {

    private const val TAG = "MoETooltipBeacon"

    fun findAndShow(activity: Activity, nativeId: String, label: String) {
        val match = NativeIdViewFinder.find(activity.window.decorView, nativeId)
        if (match == null) {
            Log.w(TAG, "findAndShow() : no view found for nativeID='$nativeId'")
            return
        }
        MoEBeaconHelper.showBeacon(activity, match, BeaconPosition.TOP_END)
    }

    fun dismiss() {
        MoEBeaconHelper.dismiss()
    }
}
