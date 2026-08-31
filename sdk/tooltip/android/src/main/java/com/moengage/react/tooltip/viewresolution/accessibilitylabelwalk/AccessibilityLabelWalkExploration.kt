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

package com.moengage.react.tooltip.viewresolution.accessibilitylabelwalk

import android.app.Activity
import android.util.Log
import android.view.View
import android.view.ViewGroup
import com.moengage.react.tooltip.viewinjection.floatingwindow.FloatingWindowExploration

/**
 * Exploration way (viewresolution/accessibilitylabelwalk): recursively walks the real Android view
 * tree from the Activity's decor view matching on [View.getContentDescription] (RN's
 * `accessibilityLabel` prop) instead of a dedicated `nativeID` tag — i.e. no SDK-specific tagging
 * needed at all, reusing metadata the app likely already has for accessibility. No
 * `AccessibilityService`/special permission required: this walks the real view tree directly rather
 * than going through the OS accessibility tree.
 *
 * Renders through [FloatingWindowExploration] at the *resolved* View's actual on-screen rect
 * ([View.getLocationOnScreen]) — paired deliberately with the other injection mechanism (rather than
 * duplicating [com.moengage.react.tooltip.viewresolution.nativetreewalk.NativeTreeWalkExploration]'s
 * decor-view rendering), so every "way" in this module ends up demonstrating a distinct
 * (resolution strategy × injection mechanism) combination rather than repeating one.
 *
 * @author Abhishek Kumar
 * @since Todo: Add Version
 */
internal object AccessibilityLabelWalkExploration {

    private const val TAG = "MoETooltipA11yLabelWalk"

    fun findAndShow(activity: Activity, text: String, label: String) {
        val match = findViewByContentDescription(activity.window.decorView, text)
        if (match == null) {
            Log.w(TAG, "findAndShow() : no view found for accessibilityLabel='$text'")
            return
        }

        val location = IntArray(2)
        match.getLocationOnScreen(location)
        FloatingWindowExploration.show(activity, location[0], location[1], match.height, label)
    }

    fun dismiss() {
        FloatingWindowExploration.dismiss()
    }

    private fun findViewByContentDescription(root: View, text: String): View? {
        if (root.contentDescription?.toString() == text) {
            return root
        }
        if (root is ViewGroup) {
            for (index in 0 until root.childCount) {
                val match = findViewByContentDescription(root.getChildAt(index), text)
                if (match != null) {
                    return match
                }
            }
        }
        return null
    }
}
