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

/**
 * Walks a sequence of `nativeID`s, showing one [CoachmarkOverlay] step at a time. JS only tags each
 * step's element once and calls [start] with the ordered lists of nativeIDs/titles/bodies — native
 * owns resolution, the bitmap "lift" snapshot, and all stepping.
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
internal object CoachmarkExploration {

    private const val TAG = "MoETooltipCoachmark"

    private var nativeIds: List<String> = emptyList()
    private var titles: List<String> = emptyList()
    private var bodies: List<String> = emptyList()
    private var stepIndex = 0
    private var activityRef: Activity? = null

    fun start(activity: Activity, nativeIds: List<String>, titles: List<String>, bodies: List<String>) {
        if (nativeIds.isEmpty()) return
        this.nativeIds = nativeIds
        this.titles = titles
        this.bodies = bodies
        this.activityRef = activity
        stepIndex = 0
        showStep()
    }

    fun dismiss() {
        CoachmarkOverlay.dismiss()
        activityRef = null
        nativeIds = emptyList()
        titles = emptyList()
        bodies = emptyList()
        stepIndex = 0
    }

    private fun showStep() {
        val activity = activityRef ?: return
        if (stepIndex >= nativeIds.size) {
            dismiss()
            return
        }

        val nativeId = nativeIds[stepIndex]
        val match = NativeIdViewFinder.find(activity.window.decorView, nativeId)
        if (match == null) {
            Log.w(TAG, "showStep() : no view found for nativeID='$nativeId', skipping")
            stepIndex++
            showStep()
            return
        }

        val location = IntArray(2)
        match.getLocationOnScreen(location)
        val isLast = stepIndex == nativeIds.size - 1
        CoachmarkOverlay.show(
            activity,
            match,
            location[0],
            location[1],
            match.width,
            match.height,
            titles.getOrElse(stepIndex) { "" },
            bodies.getOrElse(stepIndex) { "" },
            isLast
        ) {
            stepIndex++
            showStep()
        }
    }
}
