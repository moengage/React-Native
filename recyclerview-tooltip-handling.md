# Nudge Handling Inside a React Native List (Scroll & Recycling)

> Design doc for two related gaps when a nudge's target row lives inside a React Native `FlatList`/
`SectionList`. Covers all five nudge types in `MoEngage-Android-SDK/tooltip` — Tooltip, Beacon,
> Spotlight, Walkthrough, Coach Mark — scoped to **how RN's list actually behaves on Android**, not a
> generic `androidx.recyclerview.widget.RecyclerView` widget. Related: `nativeID-vs-testID-analysis.md`
> in this repo root (the resolution-layer clipping case, same underlying mechanism as §2 below); this
> doc is the tracking layer on top of a target that has already been resolved once.
>
> **Implemented for Tooltip** (`MoEngage-Android-SDK/tooltip` 1.0.8+): `ListAnchorTracker`
> (`internal/ui/ListAnchorTracker.kt`) implements §4.1/§4.2 exactly as described below, wired into
> `MoETooltipHelper.showTooltip(activity, tag, position)`'s XML-tag branch, with `TooltipManager`
> gaining a `setHidden(Boolean)` toggle for scenario B (pause, not `dismiss()` — since a tooltip has
> no bitmap snapshot to go stale, a fresh `updatePosition()` on reattach is enough, no re-snapshot
> step needed the way Coach Mark would require). The RN bridge's
> `nudge/tooltip/NativeTreeWalkExploration.kt` now re-tags the resolved View with a fresh generated
> tag per call (mirroring `CoachmarkExploration`'s existing `campaignSequence` pattern) specifically so
> it can call the tag-based `showTooltip` overload instead of the View overload — the View overload
> has no tag to re-match a remounted row against, so it can't participate in this tracking. Try it
> live: SampleApp → Tooltip Exploration → "Tooltip in a Scrolling List"
> (`TooltipScrollTrackingScreen.tsx`). Verified on-device: scrolling a little while the target row
> stays on screen moves the bubble with it (scenario A); scrolling the row fully off screen hides the
> bubble without dismissing, and scrolling back reveals it again, freshly positioned (scenario B).
> Beacon/Spotlight/Walkthrough/Coach Mark are not yet wired up — §4.3 below is still the plan for them.
> A real listener-leak bug in this implementation is tracked in §6 below — not yet fixed.

## 1. Correcting a wrong assumption: RN's `FlatList` is not backed by Android's `RecyclerView`

The obvious design ("wire up `RecyclerView.OnScrollListener` /
`RecyclerView.OnChildAttachStateChangeListener`") doesn't apply here, and it's worth being explicit
about why, since it's an easy assumption to carry over from native Android work.

`FlatList` is a JS-level virtualization (`VirtualizedList`) on top of RN's `ScrollView`. On Android,
`ScrollView` maps to `ReactScrollViewManager` — a plain `android.widget.ScrollView`/`FrameLayout`, *
*not** `androidx.recyclerview.widget.RecyclerView`. There is no native view-recycling pool, no
`RecyclerView.Adapter`, no `OnScrollListener`, no `OnChildAttachStateChangeListener` to hook into. (
`@shopify/flash-list` *does* wrap a real native `RecyclerView` — out of scope here, since this
codebase's exploration screens and RN bridge all target plain `FlatList`.)

What actually governs whether a row's native `View` exists at all, confirmed by the exploration
screen already in this repo (`RecyclerViewNativeTreeWalkScreen.tsx`) and its own inline comments:

- **JS-level windowing** (`initialNumToRender`, `windowSize`, `maxToRenderPerBatch`) — a row outside
  the current window is never rendered by React at all: no element, no native `View`, no tag.
  `OFFSCREEN_ROW_INDEX = 30` in that screen is deliberately chosen to be past `initialNumToRender`'s
  default of 10, specifically to demonstrate this.
- **`removeClippedSubviews`** (Android-only, defaults to `true` for `FlatList`) — a row that *is*
  mounted in the React tree still gets its native `View` detached from the window the moment it
  scrolls outside the clipping rect, and reattached (the **same** `View` instance) when it scrolls
  back in. This is a native-side optimization independent of React's own mount state.

These are two different lifecycles with one important consequence for tag-based resolution: **there
is no view-recycling pool reassigning one `View` instance to different row data.** Unlike a real
`RecyclerView`, a row that leaves the window and comes back is either (a) the *same* `View` instance
re-attached (clipping) or (b) a *brand-new* `View` instance freshly created by React with the tag
set correctly again (windowing un/remount). Either way, a re-appearing tag is never a stale leftover
from a different row — the "same tag, wrong row" trap that matters for a real `RecyclerView`'s reuse
pool doesn't apply to `FlatList`. That simplifies the design below considerably.

## 2. The two scenarios

| Scenario                        | Cause on Android                                                                                                             | Desired behavior                                                                                                                                                                                                                                 |
|---------------------------------|------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **A. Item moves**               | List scrolled; the row's `View` is still attached to the window, just at new coordinates                                     | The nudge should move with it — track the target's live position continuously. If continuous tracking can't be established, don't show a stale/detached nudge — dismiss it instead.                                                              |
| **B. Item leaves the viewport** | Either `removeClippedSubviews` detaches the row's `View`, or React unmounts it entirely once it exits the JS windowing range | Don't necessarily end the whole flow. Hide the nudge for that step, and automatically bring it back the moment a `View` carrying the anchor tag is attached to the window again (same instance re-clipped in, or a freshly-mounted replacement). |

## 3. Where resolution happens today, and why it's one-shot

Every nudge type's RN bridge module resolves its target the same way — confirmed identical across
`BeaconExploration.kt`, `SpotlightExploration.kt`, `NativeTreeWalkExploration.kt` (Tooltip),
`WalkthroughExploration.kt`, and `CoachmarkExploration.kt`:

```kotlin
val match = NativeIdViewFinder.find(activity, nativeId)   // walks every open window once
match.tag = anchorTag                                       // tags the resolved View
// ...hands anchorTag to the native helper (MoETooltipHelper / MoEBeaconHelper / etc.)
```

`NativeIdViewFinder.find` runs exactly once, at the moment the nudge is requested. Every native
helper's own XML-tag resolution (`activity.window.decorView.findViewWithTag(tag)` in
`MoETooltipHelper`, `MoEBeaconHelper`, `MoESpotlightHelper`, `MoEWalkthroughHelper`;
`root.findViewWithTag(tag)` in `MoECoachMarkHelper.resolveTargets`) is also a single lookup — there
is no listener anywhere that re-runs it after the initial call. `MoETooltipHelper.showTooltip`'s own
doc comment says this outright for the XML path: *"No scroll tracking for plain View anchors —
caller must re-call showTooltip if the RecyclerView scrolls the view."* That sentence is true,
unchanged, for all five nudge types, because RN never goes through the Compose-anchor path (§3.1) —
it always resolves a plain tagged `View`.

### 3.1 The Compose-anchor path already does most of this — but RN can never use it

`MoETooltipTag.kt`'s `Modifier.moeTooltipAnchor(tag)` (shared by
Tooltip/Beacon/Spotlight/Walkthrough — Coach Mark has its own, separate mechanism and doesn't use
this) already solves scenario A and detects scenario B for a **Compose** anchor:
`onGloballyPositioned` fires on every layout/scroll pass and forwards live bounds to a position
observer; `DisposableEffect.onDispose` fires when the composable leaves composition and calls a gone
observer. This is exactly the continuous tracking this doc has to build for the RN/View-tag path —
it just isn't reachable from RN, since RN has no Compose tree to attach a modifier to. It's included
here only as the existing pattern to mirror, not as something RN can inherit for free.

## 4. Proposed design

### 4.1 Scenario A — track position while attached

Use `ViewTreeObserver.OnScrollChangedListener`, registered on the resolved `View`'s own
`ViewTreeObserver` (`view.viewTreeObserver.addOnScrollChangedListener { ... }`). This fires on **any
** scroll affecting that view's position in its window — it doesn't need to know the ancestor is a
`FlatList`/`ScrollView` specifically, which is what makes it the right generic replacement for a
`RecyclerView`-specific `OnScrollListener` here. On each callback: re-run `getLocationInWindow` on
the (still-attached) target `View` and forward the new `Rect` —
`MoETooltipAnchorRegistry.register(tag, bounds)` for the four helpers that share the registry,
`CoachMarkController.updateBounds(tag, bounds)` for Coach Mark.

```kotlin
internal fun trackWhileAttached(view: View, onBoundsChanged: (Rect) -> Unit) {
    val listener = ViewTreeObserver.OnScrollChangedListener {
        if (!view.isAttachedToWindow) return@OnScrollChangedListener
        val loc = IntArray(2)
        view.getLocationInWindow(loc)
        onBoundsChanged(Rect(loc[0], loc[1], loc[0] + view.width, loc[1] + view.height))
    }
    view.viewTreeObserver.addOnScrollChangedListener(listener)
    // caller keeps `listener` to remove it in trackAttachState's detach branch / on dismiss
}
```

### 4.2 Scenario B — detect detach/re-attach without a `RecyclerView`

Two Android APIs, both generic `View`/`ViewGroup` — no `RecyclerView` dependency:

1. **`View.addOnAttachStateChangeListener`** directly on the *specific resolved `View`* — catches
   the `removeClippedSubviews` case cleanly, since that's the same `View` instance detaching and
   reattaching to its existing parent.
2. **`ViewGroup.setOnHierarchyChangeListener`** on the row's *stable ancestor* (the `FlatList`'s
   content container — walk up from the resolved view to the nearest ancestor that doesn't itself
   get torn down, e.g. the `ScrollView`'s content `ViewGroup`) — catches the windowing case, where
   React unmounts the old `View` and later mounts a **new** `View` instance for the same row.
   `onChildViewAdded(parent, child)` gives you the new child to check against the expected tag;insi
   `onChildViewRemoved` tells you the old one is gone. This is the direct generic-`ViewGroup`
   equivalent of `RecyclerView.OnChildAttachStateChangeListener` — that RecyclerView API is really
   just a convenience wrapper over the same underlying hierarchy-change concept.

```kotlin
internal fun trackAttachState(
    view: View,
    tag: String,
    contentContainer: ViewGroup,
    onAttachedChanged: (View?) -> Unit, // null = detached/gone, non-null = (re)attached, possibly a new instance
) {
    view.addOnAttachStateChangeListener(object : View.OnAttachStateChangeListener {
        override fun onViewAttachedToWindow(v: View) = onAttachedChanged(v)   // clipping reattach
        override fun onViewDetachedFromWindow(v: View) = onAttachedChanged(null) // clipping detach
    })
    contentContainer.setOnHierarchyChangeListener(object : ViewGroup.OnHierarchyChangeListener {
        override fun onChildViewAdded(parent: View, child: View) {
            if (child.tag == tag) onAttachedChanged(child) // windowing remount, fresh instance
        }
        override fun onChildViewRemoved(parent: View, child: View) {
            if (child.tag == tag) onAttachedChanged(null) // windowing unmount
        }
    })
}
```

On `onAttachedChanged(null)`: hide the nudge (pause, not dismiss — see §4.4) and stop the scroll
listener from §4.1 (the detached/removed `View` has nothing meaningful to report). On
`onAttachedChanged(newView)`: re-run full resolution for `newView` (fresh `getLocationInWindow`, and
for Coach Mark specifically a fresh `toImageBitmap()` snapshot, since a windowing remount can be a
genuinely new `View` instance with different current content) and re-install the §4.1 scroll
listener on it.

### 4.3 Call sites — same two as before, now backed by the right mechanism

- **`MoETooltipAnchorRegistry`** (shared by Tooltip/Beacon/Spotlight/Walkthrough): add a
  `trackXmlAnchor(view, tag, contentContainer)` that wires §4.1/§4.2 into the registry's existing
  `register()`/`unregister()` calls. Because `register()`/`unregister()` already forward to whatever
  position/gone observer each helper set, **the four helpers' existing observer-wiring code needs no
  changes** — they already do the right thing once the registry starts calling them for the XML path
  too.
- **`CoachMarkController`**: extend `CoachMarkAnchorState` with `isAttached: Boolean = true`; gate
  `CoachMarkOverlayLayer`'s existing `onScreen` check with `anchor?.isAttached != false` (same
  pattern already used for the per-screen gate); wire §4.1/§4.2 from
  `MoECoachMarkHelper.resolveTargets()` into `controller.updateBounds(tag, ...)` / new
  `controller.markAttached/markDetached(tag)`.

Finding the right `contentContainer` ancestor for §4.2's hierarchy listener: walk up from the
resolved `View` via `view.parent` looking for the nearest ancestor whose class name matches RN's
scroll content view (`ReactViewGroup` hosting the `FlatList`'s content), or more robustly, just
install the hierarchy listener on the nearest `ViewGroup` ancestor that is itself attached at
resolution time and stays attached for the lifetime of the nudge (the `ScrollView`'s immediate
content child, one level up from individual rows) — it doesn't need to be RN-type-aware, since
`onChildViewAdded`/`onChildViewRemoved` fires for any child, and the tag check filters for the row
that matters.

### 4.4 "Gone" must mean pause for sequences, not dismiss

This is unchanged from the underlying product requirement regardless of which native API detects it:
`MoEWalkthroughHelper.showStep`'s and `MoECoachMarkHelper`'s current gone-handling maps to a
destructive `dismiss()` that would end the whole sequence (Walkthrough's step list, Coach Mark's
campaign) just because one step's row scrolled off — the same class of bug already root-caused for
Coach Mark's screen-gate in an earlier session (rendering nothing looked identical to a full dismiss
even though state was intact). `onAttachedChanged(null)` from §4.2 should hide the current step's
overlay only, leaving `index`/`stepIndex` untouched, and `onAttachedChanged(newView)` should resume
the same step. Tooltip/Beacon/Spotlight have no sequence state to lose, so keeping their existing
dismiss-on-gone behavior is defensible, though adopting the same pause treatment is cheap once
§4.1/§4.2 exist and would remove the inconsistency.

## 5. How competitors handle this

Researched after the design above was written, to sanity-check the approach against what's shipped elsewhere.

**Appcues** (closest competitor — ships an Android-native SDK + RN plugin with the same anchored-tooltip concept) **doesn't solve this problem — it forbids it.** Their own docs state it plainly:

> "Targeting an element the user has to scroll to isn't supported, and users can't scroll while a Tooltip is showing."

So there's no scenario A (live-follow) or scenario B (hide/reattach) to build on their side: scrolling is locked while a tooltip is active, and a flow step can't even be authored against an off-screen target in the first place. For list rows specifically, their Android SDK docs recommend a **unique `android:id`** per row (not `android:tag`/`contentDescription`) and require that id be unique among **currently visible views** when the tooltip renders — if it isn't, the whole flow **hard-errors and terminates** rather than guessing (same hard-fail philosophy already noted for duplicate-tag handling in `nativeID-vs-testID-analysis.md`). Nothing in their docs addresses `RecyclerView`-style recycling beyond that.

**Pendo** — no public documentation for the mobile SDK on this at all. The only related mechanism found is web-guide-only (auto-scroll-to-anchor, and a "guide persistence" toggle for elements that might disappear from view) — not confirmed to exist on Android/iOS.

**WalkMe** — mobile SDK docs cover Smart Walk-Thru capture and swipe-gesture steps, but say nothing about scroll tracking, off-screen targets, or recycling.

This matches and sharpens what the companion competitor doc (`Element-Anchored Tooltip Placement — Cross-Platform & Competitor Landscape`, §4) already found — all three show "Scroll tracking: Not documented." The new information here is that for Appcues it isn't merely undocumented, it's a **deliberate non-goal**: lock scroll, refuse off-screen targets, hard-fail on ambiguity. That's a legitimate lower-effort fallback strategy worth keeping in mind — if the live-tracking design in §4 turns out to be too complex or too flaky in practice, "just don't allow it, and fail loudly instead of silently" is a real, shipped alternative, not a gap unique to us.

## 6. `ViewTreeObserver`/`ViewGroup` in practice: trade-offs, collisions, alternatives

Written after implementing and shipping §4 for Tooltip, to record what using these APIs for real actually surfaced — a mix of genuine trade-offs, one real bug, and why this approach is a heavier commitment than it first looks.

### 6.1 `ViewTreeObserver.addOnScrollChangedListener` — pros and cons

**Pros**
- Works on any scrollable ancestor generically (`ScrollView`, `NestedScrollView`, `RecyclerView`, `WebView`, custom views) — no need to identify or hold a reference to the actual scrolling container, which is exactly why it fits RN's `FlatList` (a `ScrollView`, not a `RecyclerView`; see §1).
- `addOnScrollChangedListener` is genuinely **multi-listener-safe**: `ViewTreeObserver` keeps an internal additive list and dispatches to everyone registered. Our listener and a host app's own listener on the same tree coexist without either clobbering the other.
- Cheap per callback — one `getLocationInWindow()` plus a bounds compare.

**Cons**
- **Not scoped.** It fires for *any* scroll anywhere in the whole window's view tree, not just scrolls affecting our target. A screen with several independent scrollable regions (a horizontal carousel inside the vertical list, a `WebView`, etc.) triggers our callback on every one of them, even when our target didn't move. Individually cheap, but doesn't scale cleanly as more anchors are tracked concurrently.
- **The observer instance isn't stable across detach/reattach.** `View.getViewTreeObserver()` returns the window's real, shared observer (`attachInfo.mTreeObserver`) only while attached; once detached, `attachInfo` goes null and a *different*, throwaway "floating" observer is returned instead. Code that fetches the observer at different times (install vs. teardown) can silently end up talking to two different objects. This is exactly what caused the bug below.

### 6.2 A real bug this exposed in `ListAnchorTracker`

`installOn(v)` runs again on every windowing remount (`onChildViewAdded`) but never removes the *previous* view's scroll listener first — it just installs fresh listeners on the new view and moves on. Since the old (now-detached) view's `OnScrollChangedListener` was registered on the **window's real, still-alive `ViewTreeObserver`** — not something scoped to that one view — the stale listener stays registered on the window forever: checked (harmlessly, since it guards on `isAttachedToWindow`) on every subsequent scroll for the rest of the activity's life, keeping its closure (and whatever it captured — `activeManager`, tag strings) reachable the whole time. Every remount of a tracked row leaks one more of these. Not currently user-visible, but a real, accumulating leak — not yet fixed; the fix is to tear down the old view's listeners in `installOn` before switching `trackedView` to the new one.

### 6.3 Multiple listeners: which APIs are safe, which aren't

Two different APIs are in play in §4.1/§4.2, and they behave oppositely:

| API | Multiple registrations? |
|---|---|
| `ViewTreeObserver.addOnScrollChangedListener` | **Safe.** Additive list — everyone's callback fires. |
| `View.addOnAttachStateChangeListener` | **Safe.** Also additive, held on the View itself. |
| `ViewGroup.setOnHierarchyChangeListener` | **Not safe.** A single field (`set`, not `add` — there is no `addOnHierarchyChangeListener` at all). The second caller silently overwrites the first. No exception, no log, no signal it happened — and `ViewGroup` exposes no getter either, so there's no way to even detect a collision, let alone chain or preserve the existing listener. |

That last one — used in §4.2 to catch a windowing remount — is the fragile half of this design. Concretely, it breaks if:
- **Two tracked anchors share the same immediate parent** (e.g. two different active nudges both targeting rows in the same `FlatList`) — the second `track()` call's `setOnHierarchyChangeListener` replaces the first's. Already flagged as a known limitation in `ListAnchorTracker`'s own doc comment.
- **A host app, or another third-party SDK in the same app, calls `setOnHierarchyChangeListener` on that same container for its own purposes** — whichever call happens *last* wins; the other silently stops working, with no way for either side to notice. Today, in this RN version, RN's own clipping implementation doesn't use this API — it drives `removeViewInLayout`/`addViewInLayout` itself, imperatively, so it doesn't need a listener — but nothing stops a host app's own code from using it, and there's no way for us to detect that at runtime.
- **The row's parent container itself gets torn down and recreated** (a `keyExtractor` collision, or the whole list remounting) — the captured `container` reference goes stale; the hierarchy listener stays on a dead `ViewGroup` and nothing listens on the new one until the next `showTooltip` call restarts tracking from scratch.

### 6.4 Is there an RN-side scroll listener instead?

Yes, a few, and they're more scoped — but each trades away something this design currently gets for free:
- **`onScroll`** (JS prop, throttled by `scrollEventThrottle`) — a JS callback fed by the native `ReactScrollView`'s own scroll dispatch. Requires the host app's screen to actually wire the prop and forward it through the bridge; not "resolve and forget" the way every other nudge call in this SDK works today.
- **`onViewableItemsChanged` + `viewabilityConfig`** — `FlatList`'s own precise "is this row viewable" signal, driven by the same windowing logic that decides whether a native `View` exists at all. More precise than our binary attached/detached (e.g. "at least 50% visible"), same JS-wiring cost as `onScroll`. Already the recommended complement in §7 below.
- **Native `View.setOnScrollChangeListener`** (API 23+), installed directly on the identified `ScrollView` ancestor — more scoped than `ViewTreeObserver` (fires only for that container's own scrolls), but it's *also* a single-slot setter (`set`, not `add`), so it carries the exact same host-app-collision risk as `setOnHierarchyChangeListener` above, just for scroll instead of add/remove.

None of these were used in §4 because each either needs the host app's screen to opt in (breaking the resolve-and-forget shape every other nudge call has) or carries the same single-slot collision risk as the hierarchy listener already accepted in §4.2.

### 6.5 Why competitors aren't doing this

Appcues doesn't build live-tracking at all (§5) — it locks scrolling and refuses to target off-screen elements, hard-failing loudly instead. §6.1–§6.3 are a good technical explanation of *why* that's the pragmatic choice for a vendor SDK, not just a product simplification:

- **Single-slot APIs can't coexist safely with unknown host-app code.** A first-party app can audit its own code for who else touches `setOnHierarchyChangeListener` on a given container. A vendor SDK shipped into thousands of arbitrary host apps cannot — and the failure mode when it collides isn't a crash, it's *silent*, which is close to undebuggable from a support-ticket queue with no repro on the vendor's own devices.
- **It leans on an undocumented implementation detail** — that RN's clipping/windowing manifests as literal `ViewGroup` child add/remove — rather than a published contract. True today, in this RN version, but not guaranteed across RN versions or architectures, and a vendor SDK with a long support tail can't assume it stays true.
- **It doesn't scale to multiple concurrent anchors** without extra work (§6.3's multiplexing-listener fix) — fine for one exploration screen, not obviously fine for every customer's every campaign running at once.

"Just don't allow it, and fail loudly" is a legitimate, lower-risk alternative to keep in mind alongside the live-tracking design in §4 — not a gap unique to this SDK, per §5.

## 7. Open questions / follow-ups

- **Fix the listener leak in §6.2.** `ListAnchorTracker.installOn` needs to tear down the previous
  tracked view's listeners before switching to a new one on a windowing remount. Not yet done.
- **Fix the multi-anchor/host-app hierarchy-listener collision in §6.3**, at least for the
  multi-anchor case within our own SDK — a small multiplexing `OnHierarchyChangeListener` per parent
  (fan out to N registered tag-watchers instead of `set`-ing a fresh one per `track()` call) would
  close the "two tracked anchors share a parent" gap; the host-app-collision half has no clean fix
  given `ViewGroup`'s API surface (no getter, no `add` variant) — see §6.3.
- **`onScrollChangedListener` firing frequency.** It fires for *any* scroll in the hierarchy, not
  just the one affecting this row's ancestor list — cheap per call (one `getLocationInWindow`), but
  worth confirming there's no jank under a fast fling across all five nudge types before shipping.
- **The JS-side complement via `onViewableItemsChanged`** (§6.4) — worth revisiting if the native-only
  detection in §4.2 proves too coarse or the §6.3 collision risk proves unacceptable in practice, but
  §4.1/§4.2 need no JS/bridge changes and were tried first for that reason.
- **`SectionList`** uses the same `VirtualizedList` under the hood as `FlatList`, so this design
  should transfer unchanged — not yet verified on-device.
- **Test coverage.** Extend the existing `RecyclerViewNativeTreeWalkScreen.tsx` exploration screen
  with a row per nudge type (Tooltip/Beacon/Spotlight/Walkthrough/Coach Mark all targeting different
  rows in the same `FlatList`) to exercise both scenarios live for all five, including a manual
  `removeClippedSubviews={false}` toggle to isolate the clipping case from the windowing case.
