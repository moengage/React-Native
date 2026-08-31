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

package com.moengage.react.tooltip.common

import android.app.Activity
import android.view.ViewGroup
import android.widget.FrameLayout

/**
 * viewinjection/decorviewoverlay: adds the tooltip bubble as a child of the Activity's own content
 * view (`android.R.id.content`) — the same view `activity.window.addContentView` targets — positioned
 * at an absolute screen rect. Reused by viewresolution/nativeidmeasure, viewresolution/testidmeasure,
 * viewresolution/nativetreewalk and viewresolution/accessibilitylabelwalk once each has resolved a
 * rect, so every "resolution" demo renders through the exact same rendering path and only the
 * resolution mechanism varies between screens.
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
internal object OverlayHost {

    private var activeBubble: android.view.View? = null

    /**
     * @param onTap When non-null, the bubble becomes clickable and invokes this instead of the
     *   default "just sits there until dismissed" behaviour — used by Walkthrough to advance to the
     *   next step on tap, matching the native SDK's own tap-to-advance model.
     */
    fun show(
        activity: Activity,
        screenX: Int,
        screenY: Int,
        anchorWidth: Int,
        anchorHeight: Int,
        label: String,
        onTap: (() -> Unit)? = null
    ) {
        dismiss()

        val contentView = activity.findViewById<FrameLayout>(android.R.id.content)
        val contentOrigin = IntArray(2)
        contentView.getLocationOnScreen(contentOrigin)

        // screenX/screenY are absolute (window) coordinates, e.g. from `measureInWindow` or
        // `View.getLocationOnScreen` — translate them into android.R.id.content's own coordinate
        // space (it can start below the status bar) before laying the bubble out inside it.
        val relativeX = (screenX - contentOrigin[0]).coerceAtLeast(0)
        val relativeY = (screenY - contentOrigin[1] + anchorHeight + TooltipBubbleFactory.SPACING_PX)
            .coerceAtLeast(0)

        val bubble = TooltipBubbleFactory.create(activity, label)
        if (onTap != null) {
            bubble.isClickable = true
            bubble.setOnClickListener { onTap() }
        }
        val params = FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        ).apply {
            leftMargin = relativeX
            topMargin = relativeY
        }

        contentView.addView(bubble, params)
        activeBubble = bubble
    }

    fun dismiss() {
        val bubble = activeBubble ?: return
        (bubble.parent as? ViewGroup)?.removeView(bubble)
        activeBubble = null
    }
}
