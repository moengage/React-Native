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

package com.moengage.react.tooltip.viewinjection.fabricviewmanager

import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp
import com.moengage.react.tooltip.common.TooltipBubbleFactory

/**
 * Exploration way (viewinjection/fabricviewmanager): a real registered `ViewManager`
 * (`MoETooltipAnchorView`), mounted *inside* the RN tree via JS (`<TooltipAnchorView>`), instead of
 * floated over it like viewinjection/decorviewoverlay or viewinjection/floatingwindow. The tooltip
 * bubble is drawn into the anchor's own [ViewGroup.getOverlay] so it doesn't participate in the
 * anchor's normal layout/clipping — it's still "embedded", just not literally a layout child.
 *
 * Extends [ViewGroupManager] rather than `SimpleViewManager` because this component accepts JS
 * children (`<TooltipAnchorView><Text>...</Text></TooltipAnchorView>`): under Fabric,
 * `SurfaceMountingManager` asks the registered `ViewManager` for an `IViewGroupManager` whenever it
 * needs to add a child into the mounted view — `SimpleViewManager` doesn't implement that interface
 * (it's for childless leaf views) and casting it throws
 * `ClassCastException: ... cannot be cast to com.facebook.react.uimanager.IViewGroupManager`,
 * which kills the whole bridgeless React instance, not just this screen.
 *
 * Relies on RN's Fabric/Paper "interop" layer to render a plain, non-codegen'd `ViewManager` under
 * the New Architecture — the one piece in this module not backed by a purely public, guaranteed-
 * stable RN API; verify on-device before relying on it for real.
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
internal class TooltipAnchorViewManager : ViewGroupManager<FrameLayout>() {

    override fun getName() = NAME

    override fun createViewInstance(reactContext: ThemedReactContext): FrameLayout {
        return FrameLayout(reactContext)
    }

    @ReactProp(name = "tooltipLabel")
    fun setTooltipLabel(view: FrameLayout, label: String?) {
        view.overlay.clear()
        if (label.isNullOrEmpty()) {
            return
        }

        view.post {
            val bubble = TooltipBubbleFactory.create(view.context, label)
            val unspecified = View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED)
            bubble.measure(unspecified, unspecified)

            val top = view.height + TooltipBubbleFactory.SPACING_PX
            bubble.layout(0, top, bubble.measuredWidth, top + bubble.measuredHeight)
            view.overlay.add(bubble)
        }
    }

    companion object {
        const val NAME = "MoETooltipAnchorView"
    }
}
