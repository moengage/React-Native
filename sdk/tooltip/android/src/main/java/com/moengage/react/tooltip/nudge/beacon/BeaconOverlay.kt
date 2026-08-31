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

import android.animation.ValueAnimator
import android.app.Activity
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.view.View
import android.view.ViewGroup
import android.view.animation.LinearInterpolator
import android.widget.FrameLayout
import com.moengage.react.tooltip.common.TooltipBubbleFactory

/**
 * A pulsating dot anchored to a corner of a resolved view; tapping it reveals a tooltip card.
 * Entirely native — JS never sees a coordinate, only triggers [show]/[dismiss] by nativeID.
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
internal object BeaconOverlay {

    private const val DOT_SIZE_DP = 12
    private const val RING_MAX_SCALE = 2.2f
    private const val PULSE_DURATION_MS = 900L
    private const val DOT_COLOR = "#6200EE"

    private var activeContainer: FrameLayout? = null
    private var activeAnimator: ValueAnimator? = null
    private var activeBubble: View? = null
    private var bubbleVisible = false

    fun show(activity: Activity, screenX: Int, screenY: Int, anchorWidth: Int, anchorHeight: Int, label: String) {
        dismiss()

        val contentView = activity.findViewById<FrameLayout>(android.R.id.content)
        val origin = IntArray(2)
        contentView.getLocationOnScreen(origin)

        val density = activity.resources.displayMetrics.density
        val dotSizePx = (DOT_SIZE_DP * density).toInt()
        val relX = screenX - origin[0] + anchorWidth - dotSizePx / 2
        val relY = screenY - origin[1] - dotSizePx / 2

        val container = FrameLayout(activity)

        val ring = View(activity).apply {
            background = GradientDrawable().apply {
                shape = GradientDrawable.OVAL
                setColor(Color.parseColor(DOT_COLOR))
            }
        }
        val dot = View(activity).apply {
            background = GradientDrawable().apply {
                shape = GradientDrawable.OVAL
                setColor(Color.parseColor(DOT_COLOR))
            }
            isClickable = true
            setOnClickListener {
                bubbleVisible = !bubbleVisible
                if (bubbleVisible) {
                    showBubble(activity, container, relX, relY, dotSizePx, label)
                } else {
                    hideBubble(container)
                }
            }
        }

        val dotParams = FrameLayout.LayoutParams(dotSizePx, dotSizePx).apply {
            leftMargin = relX
            topMargin = relY
        }
        container.addView(ring, FrameLayout.LayoutParams(dotParams))
        container.addView(dot, FrameLayout.LayoutParams(dotParams))

        contentView.addView(
            container,
            FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
        )
        activeContainer = container

        activeAnimator = ValueAnimator.ofFloat(0f, 1f).apply {
            duration = PULSE_DURATION_MS
            repeatCount = ValueAnimator.INFINITE
            interpolator = LinearInterpolator()
            addUpdateListener { animator ->
                val t = animator.animatedValue as Float
                ring.scaleX = 1f + t * (RING_MAX_SCALE - 1f)
                ring.scaleY = 1f + t * (RING_MAX_SCALE - 1f)
                ring.alpha = 0.5f * (1f - t)
            }
            start()
        }
    }

    private fun showBubble(activity: Activity, container: FrameLayout, dotX: Int, dotY: Int, dotSizePx: Int, label: String) {
        val bubble = TooltipBubbleFactory.create(activity, label)
        val params = FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        ).apply {
            leftMargin = dotX
            topMargin = dotY + dotSizePx + TooltipBubbleFactory.SPACING_PX
        }
        container.addView(bubble, params)
        activeBubble = bubble
    }

    private fun hideBubble(container: FrameLayout) {
        activeBubble?.let { container.removeView(it) }
        activeBubble = null
    }

    fun dismiss() {
        activeAnimator?.cancel()
        activeAnimator = null
        val container = activeContainer ?: return
        (container.parent as? ViewGroup)?.removeView(container)
        activeContainer = null
        activeBubble = null
        bubbleVisible = false
    }
}
