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
import android.graphics.RectF
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout

/**
 * Adds a [SpotlightScrimView] as a child of the Activity's content view — same decor-view-attach
 * technique [com.moengage.react.tooltip.common.OverlayHost] uses for the plain tooltip bubble.
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
internal object SpotlightOverlay {

    private const val CUTOUT_PADDING_DP = 8f
    private const val CORNER_RADIUS_DP = 12f

    private var activeView: View? = null

    fun show(activity: Activity, screenX: Int, screenY: Int, anchorWidth: Int, anchorHeight: Int) {
        dismiss()

        val contentView = activity.findViewById<FrameLayout>(android.R.id.content)
        val origin = IntArray(2)
        contentView.getLocationOnScreen(origin)

        val density = activity.resources.displayMetrics.density
        val paddingPx = CUTOUT_PADDING_DP * density

        val relX = (screenX - origin[0]).toFloat()
        val relY = (screenY - origin[1]).toFloat()
        val cutout = RectF(
            (relX - paddingPx).coerceAtLeast(0f),
            (relY - paddingPx).coerceAtLeast(0f),
            relX + anchorWidth + paddingPx,
            relY + anchorHeight + paddingPx,
        )

        val scrim = SpotlightScrimView(activity, cutout, CORNER_RADIUS_DP * density) { dismiss() }
        contentView.addView(
            scrim,
            FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
        )
        activeView = scrim
    }

    fun dismiss() {
        val view = activeView ?: return
        (view.parent as? ViewGroup)?.removeView(view)
        activeView = null
    }
}
