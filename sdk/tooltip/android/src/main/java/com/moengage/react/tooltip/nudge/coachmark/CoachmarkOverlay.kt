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
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.ImageView
import com.moengage.react.tooltip.common.TooltipBubbleFactory

/**
 * Dim scrim over the whole screen with the target re-drawn (via a [Bitmap] snapshot) above it at
 * its own bounds — no cutout, the target reads as "lit in place", matching the native Android SDK's
 * Compose-based `CoachMarkOverlay` model (`MoEngage-Android-SDK/sampleapp/.../CoachMark.kt`) without
 * needing Compose's GraphicsLayer capture. Tap anywhere advances/finishes.
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
internal object CoachmarkOverlay {

    private var activeContainer: FrameLayout? = null

    fun show(
        activity: Activity,
        target: View,
        screenX: Int,
        screenY: Int,
        anchorWidth: Int,
        anchorHeight: Int,
        title: String,
        body: String,
        isLast: Boolean,
        onTap: () -> Unit,
    ) {
        dismiss()

        val contentView = activity.findViewById<FrameLayout>(android.R.id.content)
        val origin = IntArray(2)
        contentView.getLocationOnScreen(origin)
        val relX = screenX - origin[0]
        val relY = screenY - origin[1]

        val container = FrameLayout(activity).apply {
            setBackgroundColor(Color.parseColor("#BF000000"))
            isClickable = true
            setOnClickListener { onTap() }
        }

        val snapshot = try {
            val bitmap = Bitmap.createBitmap(
                anchorWidth.coerceAtLeast(1),
                anchorHeight.coerceAtLeast(1),
                Bitmap.Config.ARGB_8888
            )
            target.draw(Canvas(bitmap))
            bitmap
        } catch (t: Throwable) {
            null
        }
        if (snapshot != null) {
            val lifted = ImageView(activity).apply { setImageBitmap(snapshot) }
            val liftedParams = FrameLayout.LayoutParams(anchorWidth, anchorHeight).apply {
                leftMargin = relX
                topMargin = relY
            }
            container.addView(lifted, liftedParams)
        }

        val hint = if (isLast) "Tap to finish" else "Tap to continue"
        val callout = TooltipBubbleFactory.create(activity, "$title\n$body\n\n$hint")
        val calloutParams = FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        ).apply {
            leftMargin = relX
            topMargin = relY + anchorHeight + TooltipBubbleFactory.SPACING_PX
        }
        container.addView(callout, calloutParams)

        contentView.addView(
            container,
            FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
        )
        activeContainer = container
    }

    fun dismiss() {
        val container = activeContainer ?: return
        (container.parent as? ViewGroup)?.removeView(container)
        activeContainer = null
    }
}
