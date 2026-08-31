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

import android.view.View

/**
 * Reflection-based access to every top-level Android `Window` currently open in this process — the
 * host Activity's own window plus any Dialogs on top of it. This matters here because RN's
 * `<Modal>` renders its content into its own `Dialog`, i.e. a separate `Window` stacked above the
 * Activity's — not a descendant of `activity.window.decorView`. [NativeIdViewFinder] previously
 * walked only that decorView, so a `nativeID` inside a `<Modal>` could never be found regardless of
 * whether the tag itself was set correctly (see [NativeIdViewFinder.find]).
 *
 * No special permission is needed: unlike a system-alert-window overlay, this only inspects windows
 * the app itself already owns in its own process, via `WindowManagerGlobal`'s internal window list
 * — the same technique tools like Square's Curtains use. If the internal field ever changes shape
 * on some OEM/Android version, every accessor below degrades to an empty result rather than
 * crashing, and [NativeIdViewFinder] falls back to the Activity's own decorView.
 */
internal object AppWindows {

    private val windowManagerGlobalClass =
        runCatching { Class.forName("android.view.WindowManagerGlobal") }.getOrNull()
    private val getInstanceMethod =
        windowManagerGlobalClass?.let { runCatching { it.getMethod("getInstance") }.getOrNull() }
    private val viewsField =
        windowManagerGlobalClass
            ?.let { runCatching { it.getDeclaredField("mViews") }.getOrNull() }
            ?.apply { isAccessible = true }

    /**
     * Every currently-open top-level window's root view for this process, oldest-added first.
     * `WindowManagerGlobal` appends new windows to the end of this list and never reorders it, so
     * the last *shown* entry is the topmost window in z-order — a Dialog shown on top of an
     * Activity is always added after it.
     */
    fun openWindowDecorViews(): List<View> {
        val global = getInstanceMethod?.invoke(null) ?: return emptyList()
        val views = runCatching { viewsField?.get(global) as? List<*> }.getOrNull() ?: return emptyList()
        // Defensive copy: mViews mutates live as windows open/close on the main thread, and a
        // concurrent structural change while a caller is iterating the result would crash.
        return runCatching { views.filterIsInstance<View>() }.getOrElse { emptyList() }
    }
}
