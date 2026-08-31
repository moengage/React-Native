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

package com.moengage.react.tooltip.viewinjection.floatingwindow

import android.app.Activity
import android.graphics.PixelFormat
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import com.moengage.react.tooltip.common.TooltipBubbleFactory

/**
 * Exploration way (viewinjection/floatingwindow): render the tooltip bubble in a brand new
 * [WindowManager] window, distinct from the Activity's own [android.view.Window]/decor view used by
 * [com.moengage.react.tooltip.common.OverlayHost]. Uses
 * [WindowManager.LayoutParams.TYPE_APPLICATION_PANEL] tied to the Activity's own window token, so it
 * works without the `SYSTEM_ALERT_WINDOW` permission (that permission is only required for windows
 * that outlive/aren't owned by the current Activity).
 *
 * Deliberately takes the target rect as parameters rather than resolving anything itself — the only
 * caller is [com.moengage.react.tooltip.viewresolution.accessibilitylabelwalk.AccessibilityLabelWalkExploration],
 * which resolves the real anchor View first via [android.view.View.getLocationOnScreen] and passes its
 * actual on-screen rect here. This module never hardcodes a screen position.
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
internal object FloatingWindowExploration {

    private var windowManager: WindowManager? = null
    private var floatingBubble: View? = null

    fun show(activity: Activity, x: Int, y: Int, anchorHeight: Int, label: String) {
        dismiss()

        val bubble = TooltipBubbleFactory.create(activity, label)
        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_PANEL,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            this.x = x
            this.y = y + anchorHeight + TooltipBubbleFactory.SPACING_PX
            token = activity.window.decorView.windowToken
        }

        activity.windowManager.addView(bubble, params)
        windowManager = activity.windowManager
        floatingBubble = bubble
    }

    fun dismiss() {
        val bubble = floatingBubble ?: return
        try {
            windowManager?.removeView(bubble)
        } catch (t: Throwable) {
            // Window already detached (e.g. Activity destroyed) - nothing left to remove.
        }
        floatingBubble = null
        windowManager = null
    }
}
