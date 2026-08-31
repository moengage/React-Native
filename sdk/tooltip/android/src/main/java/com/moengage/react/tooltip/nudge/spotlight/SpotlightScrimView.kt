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

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.PorterDuff
import android.graphics.PorterDuffXfermode
import android.graphics.RectF
import android.view.View

/**
 * Full-screen dim scrim with a transparent rounded-rect cutout around [cutout] — the cutout is
 * punched via [PorterDuff.Mode.CLEAR] on an offscreen layer ([Canvas.saveLayer]), same technique the
 * native Android SDK's Compose-based `SpotlightOverlay` uses via `BlendMode.Clear` (see
 * `MoEngage-Android-SDK/tooltip/.../SpotlightOverlay.kt`) — required so `CLEAR` only erases pixels
 * within this view's own layer instead of blending with whatever is behind it in the hierarchy. Tap
 * anywhere (inside or outside the cutout) dismisses.
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
internal class SpotlightScrimView(
    context: Context,
    private val cutout: RectF,
    private val cornerRadiusPx: Float,
    onDismiss: () -> Unit,
) : View(context) {

    private val dimPaint = Paint().apply { color = Color.parseColor("#B3000000") }
    private val clearPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        xfermode = PorterDuffXfermode(PorterDuff.Mode.CLEAR)
    }

    init {
        setLayerType(LAYER_TYPE_HARDWARE, null)
        isClickable = true
        setOnClickListener { onDismiss() }
    }

    override fun onDraw(canvas: Canvas) {
        val saveCount = canvas.saveLayer(0f, 0f, width.toFloat(), height.toFloat(), null)
        canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), dimPaint)
        canvas.drawRoundRect(cutout, cornerRadiusPx, cornerRadiusPx, clearPaint)
        canvas.restoreToCount(saveCount)
    }
}
