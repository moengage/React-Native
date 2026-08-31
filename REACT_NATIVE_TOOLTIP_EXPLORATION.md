# React Native Tooltip / Beacon / Walkthrough Exploration (New Architecture Only)

> Supersedes the earlier version of this doc. Scope is deliberately narrowed to **New Architecture
> (Fabric + TurboModules + bridgeless)** — React Native permanently removed the legacy bridge
> architecture in 0.82, and this repo's `SampleApp` already builds with `newArchEnabled=true` on RN
> 0.81.1. Nothing here targets `UIManagerModule`/`NativeViewHierarchyManager` (legacy/Paper); every
> claim below was checked against `node_modules/react-native` source for this exact version and,
> where noted, against upstream RN 0.76–0.82 behavior for forward/backward compatibility.
>
> - Flutter: [Flutter Tooltip Exploration - Element Selection + Placement](https://moengagetrial.atlassian.net/wiki/spaces/MS/pages/6547734545/Flutter+Tooltip+Exloration+-+Element+Selection+Placement)
> - Native Android: [Tooltip, Beacon and Walkthrough Exploration](https://moengagetrial.atlassian.net/wiki/spaces/MS/pages/6336479252/Tooltip+Beacon+and+Walkthrough+Exploration)
> - Product/PRD: [Tooltips and walkthroughs Exploration](https://moengagetrial.atlassian.net/wiki/spaces/MOEN/pages/3959521283), [Tooltips and walkthroughs](https://moengagetrial.atlassian.net/wiki/spaces/MOEN/pages/4024402446)

---

## 1. Scope and why New Architecture only

- RN 0.76 made the New Architecture (JSI + Fabric + TurboModules) the default. RN 0.82 **removed the
  legacy bridge entirely** — `newArchEnabled=false` is now a no-op. Any tooltip mechanism that only
  works under the legacy bridge (`UIManagerModule`, `NativeViewHierarchyManager`,
  `NativeViewHierarchyOptimizer`) is dead on arrival for any app built against a current RN version,
  so this doc doesn't spend time on it.
- This repo already reflects that reality: `SampleApp/android/gradle.properties` sets
  `newArchEnabled=true`, `sdk/tooltip`'s bridge is a TurboModule (`NativeMoEngageTooltipSpec`,
  generated from `sdk/tooltip/src/NativeMoEngageTooltip.ts`'s codegen config), and both
  `src/newarch/.../MoEngageTooltipBridge.kt` and `src/oldarch/.../MoEngageTooltipBridge.kt` exist only
  because the module's `build.gradle` conditionally compiles one or the other — the old-arch source
  set is legacy scaffolding, not a target for new tooltip work.
- Practical effect on the resolution mechanism: everything native-side below reads
  `com.facebook.react.fabric.FabricUIManager` / `com.facebook.react.fabric.mounting.SurfaceMountingManager`
  as the source of truth, not `NativeViewHierarchyManager`. Where a mechanism (like the raw
  `nativeID` tag walk) happens to be architecture-agnostic because it only touches plain
  `android.view.View`/`ViewGroup` APIs, that's called out explicitly — it's a coincidence of how
  Fabric mounts views, not something that required Fabric-specific code.

## 2. Fabric fundamentals that determine what's resolvable

Everything in Sections 3–4 follows from four facts about Fabric, each verified directly against
`node_modules/react-native` (0.81.1):

1. **Fabric still mounts genuine `android.view.View`/`ViewGroup` instances.** `SurfaceMountingManager`
   creates real views via each component's `ViewManager.createViewInstance()` — the same
   `ViewManager`/`BaseViewManager` classes Paper used — and attaches them under the Activity's real
   `decorView`. There is no shadow DOM standing in for the native tree the way there is in Flutter; a
   native-side view-tree walk still finds something real to walk. `TooltipAnchorViewManager`'s own
   doc comment already flags the one non-codegen exception (Section 3.2).

2. **`nativeID` survives Fabric's view-flattening/collapsing.** Fabric decides whether a shadow node
   needs a real backing view in C++, not in the `NativeViewHierarchyOptimizer` Paper used.
   `ViewShadowNode.cpp`'s `formsStackingContext`/`formsView` trait computation
   (`ReactCommon/react/renderer/components/view/ViewShadowNode.cpp:49-73`) explicitly includes
   `!viewProps.nativeId.empty()` as one of the conditions that forces `formsView = true`. Any element
   with a non-empty `nativeID` is therefore guaranteed a real native view under Fabric, full stop —
   this was an open risk in the previous version of this doc and is now confirmed, not assumed.

3. **The tag-write path is shared code, not duplicated per architecture.**
   `BaseViewManager.setNativeId()` (`uimanager/BaseViewManager.java:310-315`) —
   `view.setTag(R.id.view_tag_native_id, nativeId); ReactFindViewUtil.notifyViewRendered(view)` — is
   invoked by `updateProperties()`, which both Paper's `UIImplementation` and Fabric's
   `SurfaceMountingManager` call through the same `ViewManager` base classes. Separately,
   `ViewManager.createViewInstance()` (`uimanager/ViewManager.java:218`) always calls
   `view.setId(reactTag)` — so **every RN-mounted view already carries its numeric React tag as its
   Android view ID**, for free, regardless of whether `nativeID` was ever set. This is the fact
   Section 4.3's hybrid approach and Section 4.4's recommended approach build on.

4. **Fabric's own tag→view registry, and its two sharp edges.** `FabricUIManager.resolveView(int
   reactTag)` (`fabric/FabricUIManager.java:1016-1019`) is:
   ```java
   @Override
   public @Nullable View resolveView(int reactTag) {
     UiThreadUtil.assertOnUiThread();
     SurfaceMountingManager surfaceManager = mMountingManager.getSurfaceManagerForView(reactTag);
     return surfaceManager == null ? null : surfaceManager.getView(reactTag);
   }
   ```
   Two things worth knowing before relying on this:
   - **It asserts UI thread.** `UiThreadUtil.assertOnUiThread()` — calling this off the main thread
     throws, unlike a plain tree walk which only needs a `View` reference.
   - **It can throw, not just return null.** `SurfaceMountingManager.getView()`
     (`fabric/mounting/SurfaceMountingManager.java:1093-1100`) throws
     `IllegalViewOperationException("Trying to resolve view with tag N which doesn't exist")` when the
     tag has no `ViewState` — `resolveView` only returns null when the *surface itself* isn't found; an
     unknown-but-plausible tag on a known surface throws instead. Any code calling `resolveView` must
     wrap it in `try/catch`, not just null-check it.
   - **A resolved view is not necessarily attached or laid out.** `SurfaceMountingManager.preallocateView()`
     can create a `ViewState` (and thus make `resolveView` succeed) before the view is inserted into its
     parent or given real bounds. Always additionally check `view.isAttachedToWindow()` and
     `view.width/height > 0` before trusting a resolved view's rect.

## 3. Getting native tooltip chrome on screen over Fabric content

Independent of *how* the anchor is found (Section 4). All four render into/over the Activity's real
view hierarchy, which Fabric content is genuinely part of per Section 2.1.

### 3.1 Window/Decor overlay — **recommended**, already implemented

**Mechanism:** add the tooltip bubble as a child of `android.R.id.content` (the same view
`activity.window.addContentView()` targets), positioned with absolute margins computed from a
resolved screen rect. This repo's `OverlayHost` (`sdk/tooltip/android/.../common/OverlayHost.kt`)
already implements exactly this and is reused by every resolution "way" — nothing here is
architecture-specific, since it never touches RN's own APIs at all.

**Pros**
- Zero coupling to Fabric or Paper — it's plain `FrameLayout.addView()` against the Activity's own
  content view.
- Trivial always-on-top / no z-order fight with RN's own compositing, since it's a sibling of the RN
  root, not inside it.
- Already implemented and reused by three of the four "ways" in `sdk/tooltip` — no new code needed to
  adopt it for a fourth.

**Cons**
- Needs `ReactContext.getCurrentActivity()` to be non-null and current; must be re-added on Activity
  recreation (rotation/process restore) — `OverlayHost` doesn't currently listen for that itself.
- One-shot render: `OverlayHost.show()` computes a rect once. Nothing re-positions the bubble if the
  anchor moves later (Section 5).

**Implementation steps (already done in this repo — reference only)**
1. Resolve anchor → `(screenX, screenY, width, height)`.
2. `OverlayHost.show(activity, screenX, screenY, width, height, label)` translates window-relative
   coordinates into `android.R.id.content`'s own coordinate space and adds a `TextView` bubble
   (`TooltipBubbleFactory`) via `FrameLayout.LayoutParams` margins.
3. `OverlayHost.dismiss()` removes it.

**Integration:** called from `MoEngageTooltipBridgeHandler.findAndShowByNativeId()` today; any new
resolution mechanism (Section 4.4) just needs to produce the same four ints and call `OverlayHost.show`
— no changes to this layer.

### 3.2 Fabric-compatible `ViewManager` component (`requireNativeComponent`)

**Mechanism:** ship a real RN component (`<TooltipAnchorView tooltipLabel="...">`) that JS mounts
inline; the native `ViewManager` draws the tooltip into the component's own
`ViewGroup.getOverlay()`. Implemented in this repo as `TooltipAnchorViewManager` +
`TooltipAnchorView.ts` (`requireNativeComponent('MoETooltipAnchorView')`).

**New Architecture–specific risk, called out directly in the code's own doc comment:**
`TooltipAnchorViewManager extends SimpleViewManager<FrameLayout>` — a **plain, non-codegen'd
ViewManager**. Fabric's default integration path expects a component described by codegen
(`codegenConfig` + a generated `ComponentDescriptor`/`ViewManagerInterface`); a hand-registered
`ViewManager` like this one only works under Fabric via RN's **Fabric interop layer**
(`ReactFeatureFlags`-gated shim that lets legacy `ViewManager`s keep working without a Fabric
component descriptor). That interop layer:
- Is explicitly a compatibility shim, not the primary Fabric integration path — Meta's own direction
  is codegen'd Fabric components (`codegenNativeComponent`), not raw `ViewManager` registration.
  This module still uses `requireNativeComponent` (Paper-era API) rather than
  `codegenNativeComponent` (Fabric-native API) — functionally works via interop today, but is the
  weakest-verified piece of this entire module for New Architecture, exactly as its own doc comment
  states ("the one piece in this module not backed by a purely public, guaranteed-stable RN API").
- Has historically been a source of subtle bugs for third-party SDKs doing exactly this (see Pendo's
  New-Architecture crash in Section 7.1 — a different symptom, same theme: New Architecture is
  stricter about module/component registration shape than the legacy bridge was).

**Pros**
- Participates in RN's own layout/lifecycle — correct tool if the tooltip is meant to be *embedded*
  content (e.g., an inline card) rather than floating chrome.
- No separate resolution step needed at all — the wrapper *is* the anchor; there's nothing to "find."

**Cons**
- Wrong tool for floating tooltip chrome — forces fighting RN's own z-order/clip-to-bounds instead of
  getting "always on top" for free like the window overlay.
- Requires JS to actually render the wrapper around the target — same "needs app code changes, no
  fire-and-forget from a campaign payload" limitation as any JS-side tagging approach.
- Relies on the Fabric interop layer rather than a genuine codegen'd Fabric component — migrate to
  `codegenNativeComponent` before treating this as load-bearing.

**Recommended path if pursued for real:** convert `TooltipAnchorViewManager` to a codegen'd Fabric
component (add a `codegen` spec, implement `ViewManagerInterface`/`ComponentDescriptor` registration
via `MoEngageTooltipPackage`'s `ReactModuleInfoProvider` + a generated `*ComponentDescriptor`) instead
of leaving it on the interop shim — removes the one open New Architecture risk in this module.

### 3.3 RN `<Modal>`

**Mechanism:** RN's built-in `<Modal>`, backed on Android by `ReactModalHostView`
(`views/modal/ReactModalHostView.kt`), which creates its own `ComponentDialog`/`Window` and forwards
RN's view-add/remove calls into a `DialogRootViewGroup` living in that separate window.

**Pros:** reuses a component every RN app ships with; gets back-press/some a11y handling for free.

**Cons:** still needs JS to mount it (same "needs a live mount point" issue as 3.2); an extra
`Dialog`/`Window` per tooltip is heavier than one overlay view; positioning it at an arbitrary anchor
still needs Section 4's resolved rect anyway — adds a layer without removing the hard part. Critically
for Section 4: **anything rendered inside a `<Modal>` is unreachable from a decorView-rooted walk or
registry lookup keyed off the main Activity window** — see Section 4.2's Modal caveat.

### 3.4 Second RN surface / portal

**Mechanism:** a separate, small React root (a second `ReactRootView`/`AppRegistry` surface) renders
tooltip content in JS/RN, added to the Activity like the window overlay in 3.1.

**Pros:** tooltip visuals authored in JS/RN (theming, animation, RN styling reuse) while still floating
outside the host tree's clipping/z-order — if attached correctly (see below).

**Cons:** a second JS render pass and surface lifecycle for something that flashes in and out is real
overhead; only worth it if tooltip *content* must be authored in RN/JS rather than native
Compose/Views. **Where it's attached matters for Section 4:** attach the portal's root view as a
plain child of the Activity's own `decorView`/content view (same technique as 3.1) and it stays fully
resolvable; attach it as its own separate `Window` and it becomes exactly as unreachable as the Modal
case.

**Recommendation (unchanged from the previous version of this doc):** 3.1 for the chrome. Reuse the
native SDK's own tooltip renderer once it lands; RN's job is resolving a rect and a live handle to
re-resolve it, not reimplementing tooltip visuals.

## 4. Resolving the anchor under Fabric

### 4.1 JS-side: ref → `findNodeHandle` → `measureInWindow`

**Mechanism:** hold a ref to the target component, get its numeric tag via `findNodeHandle(ref)`,
resolve absolute screen coordinates via `measureInWindow`.

**Fabric-specific detail:** `measure`/`measureInWindow` are **not** served by the legacy
`UIManagerModule.measureInWindow()` (`uimanager/UIManagerModule.java:540`, Paper-only) under the New
Architecture — Fabric has its own implementation, `MountingManager.measure()`
(`fabric/mounting/MountingManager.kt:295`), reached via the JS `NativeMethods`/`ReactNativeViewConfigRegistry`
plumbing rather than `UIImplementation`. Functionally equivalent from JS's point of view (same
`(x, y, width, height)` window-relative result), but it is genuinely different native code underneath —
don't assume Paper-era measure internals apply.

**Pros**
- 100% public, documented RN API (`findNodeHandle`, `measureInWindow`) — no internals bet at all.
- Works for any element, including ones with no `nativeID`/tag — a bare ref is enough.
- Correctly resolves elements that native-side approaches structurally cannot: an element inside a
  `<Modal>` or a portal surface resolves fine, because JS measures its own tree — it never needs to
  know which native `Window` the view ended up in.

**Cons**
- Requires JS to hold a live ref at the moment of measurement — needs the developer to wrap/tag the
  target and a live mount point; "new target element → new app release," same trade-off every
  JS-side approach shares.
- Round-trips through the JS thread — if JS is busy (long task, in the middle of a re-render), the
  measurement is delayed; a native-only approach doesn't have this dependency.
- Doesn't solve nested `<Text>` for free either — a nested `<Text>` still has no host view to ref, so
  there's nothing to `findNodeHandle`. (Wrap the phrase in its own top-level `<Text>` instead.)

**Implementation steps**
1. `const ref = useRef(null)`; attach to the JSX element you're measuring; `collapsable={false}` on it
   if it's a plain `<View>` wrapper with no other reason to avoid flattening.
2. On trigger: `const tag = findNodeHandle(ref.current); UIManager.measureInWindow(tag, (x, y, w, h) => bridge.showAt(x, y, w, h, label))`.
3. Native side just renders (Section 3.1) — no resolution code needed at all.

**Integration in this repo:** none of the current `sdk/tooltip` "ways" use this path (all three are
native-resolution-first by design, per the module's own doc comments). Adding this as a fourth "way"
would need a new bridge method taking `(x: number, y: number, width: number, height: number, label: string)`
directly — the simplest possible native contract, since JS already did all the resolution work.

### 4.2 Native-side: `nativeID` tree walk — current implementation

**Mechanism:** `NativeTreeWalkExploration.findAndShow()` (`sdk/tooltip/android/.../nativetreewalk/NativeTreeWalkExploration.kt`)
recursively walks `activity.window.decorView`, reading `view.getTag(com.facebook.react.R.id.view_tag_native_id)`
on each node, and resolves the first match's rect via `getLocationOnScreen()`.

**Confirmed Fabric-safe by Section 2.2/2.3** — `nativeID` forces a real view to exist, and the tag-write
path is shared code. RN itself ships the same algorithm as `ReactFindViewUtil.findView()`
(`uimanager/util/ReactFindViewUtil.kt:44-59`) — this is not "poking at internals," it's reusing an
RN-owned utility class, architecture-agnostic by construction (it only touches `android.view.View`).

**Pros**
- No JS round-trip — resolves and renders fully natively; doesn't depend on the JS thread being free.
- Same code path on Fabric and (if ever needed) Paper, since it never calls into either UIManager.
- Zero JS-side ceremony beyond setting `nativeID="x"` — no ref, no `collapsable={false}` needed (the
  `formsView` trait already guarantees a real view per Section 2.2).
- `ReactFindViewUtil.addViewListener`/`OnViewFoundListener` (unused today, but available) additionally
  gets a callback the moment a *not-yet-mounted* matching view later appears, via the same
  `notifyViewRendered()` hook `setNativeId()` calls — useful for "wait for this element" rather than
  "check right now," without any polling.

**Cons / structural resolution failures (mounted-and-attached is not sufficient in every case)**

| Case                                                                 | Component mounted?          | Real view carries the tag?                                                                                                                                                | Reachable from `decorView` walk?                                                                                                                                                                          |
|----------------------------------------------------------------------|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Nested `<Text nativeID="x">` inside another `<Text>`                 | Yes                         | **No** — virtual text node, no host view exists at all (`ReactVirtualTextViewManager`; confirmed zero `nativeId` handling anywhere in `ReactCommon/.../components/text/`) | n/a                                                                                                                                                                                                       |
| Inside `<Modal>`                                                     | Yes                         | Yes                                                                                                                                                                       | **No** — different `Window`/decor view (Section 3.3)                                                                                                                                                      |
| Custom wrapper that doesn't forward `nativeID` to its host element   | Yes (the wrapper is)        | **No** — prop dropped in JS before reaching any `ViewManager`                                                                                                             | n/a                                                                                                                                                                                                       |
| Duplicate `nativeID` on multiple mounted views                       | Yes                         | Yes (all of them)                                                                                                                                                         | Yes — but ambiguous: first pre-order DFS match wins, not necessarily the intended/visible one                                                                                                             |
| `FlatList` row scrolled past the clip rect (`removeClippedSubviews`) | Yes (React still thinks so) | Yes, tag intact                                                                                                                                                           | **No** — `ReactViewGroup.updateSubviewClipStatus()` (`views/view/ReactViewGroup.kt:515-536`, shared by both architectures) physically detaches the view from its parent; walk can't reach a detached node |
| Second RN surface attached as its own `Window`                       | Yes                         | Yes                                                                                                                                                                       | **No** — same unreachable-subtree problem as Modal                                                                                                                                                        |
| Second RN surface attached under the main `decorView`                | Yes                         | Yes                                                                                                                                                                       | **Yes**                                                                                                                                                                                                   |

- Silent-failure ambiguity: a miss logs a warning and returns — "typo," "not mounted yet," "in a
  different window," and "clipped" are all indistinguishable from the caller's side.
- O(n) walk over the *entire* Activity view tree (system chrome included), every call — no caching.
- Single-shot: no scroll tracking, no re-resolution; see Section 5.

**Implementation steps (as already shipped)**
1. JS sets `nativeID="tooltip_target"` on the target element — no other JS change.
2. Bridge method (`findAndShowByNativeId`) receives the string, calls
   `NativeTreeWalkExploration.findAndShow(activity, nativeId, label)`.
3. Recursive DFS from `activity.window.decorView`, matching `readNativeId(view) == nativeId`.
4. On match: `getLocationOnScreen()` → `OverlayHost.show()` (Section 3.1).

**Integration:** `MoEngageTooltipBridgeHandler.findAndShowByNativeId()` →
`NativeTreeWalkExploration.findAndShow()` → `OverlayHost.show()`. TS surface:
`findAndShowByNativeId(nativeId, label)` in `sdk/tooltip/src/index.ts`.

### 4.3 Hybrid: `nativeID` walk once, then `resolveView` by cached React tag

**Mechanism:** do the Section 4.2 walk exactly once to get the `View`, read `view.getId()` (the numeric
React tag every Fabric-mounted view already carries per Section 2.3), cache `nativeId → reactTag`, and
use `FabricUIManager.resolveView(tag)` (via `UIManagerHelper.getUIManagerForReactTag`) for every
subsequent lookup instead of re-walking — most useful for Section 5's repeated re-measure-on-scroll
loop.

```kotlin
fun resolveByTag(reactContext: ReactContext, reactTag: Int): View? {
    val uiManager = UIManagerHelper.getUIManagerForReactTag(reactContext, reactTag) ?: return null
    return try {
        uiManager.resolveView(reactTag) // must run on UI thread; can throw per Section 2.4
    } catch (e: IllegalViewOperationException) {
        null // tag no longer exists — treat exactly like "view gone"
    }
}
```

**Pros**
- O(1) re-resolution after the first hit — meaningfully cheaper than re-walking the whole tree on
  every scroll frame.
- Cleaner failure signal: `resolveView` throwing/returning null unambiguously means "tag no longer
  registered" (unmounted/dropped), separable from `view.isAttachedToWindow() == false` meaning "still
  mounted, currently detached" (e.g., clipped) — a raw walk conflates both into one silent miss.
- Keeps `nativeID`'s zero-JS-code ergonomics for the *first* resolution.

**Cons**
- The first lookup is still exactly Section 4.2's walk, so **every structural gap in that table still
  applies unchanged** to the initial resolution — nested `<Text>`, Modal, non-forwarding wrappers, and
  duplicate-tag ambiguity are not fixed by caching what the first (possibly wrong/failed) walk found.
- New state to manage that the current stateless walk doesn't have: a `nativeId → reactTag` cache,
  plus an invalidation rule for when a view with that `nativeID` is destroyed and remounted (list
  item remount, subtree re-render) with a *new* tag — stale cache silently resolves to a
  no-longer-relevant view.
- `resolveView` is `com.facebook.react.uimanager`/`com.facebook.react.fabric` internal-package API —
  a real interface method (more stable in practice than a bare resource-id trick), but still not part
  of RN's small, documented public surface (`nativeID`, `findNodeHandle`, `measureInWindow`).
- Doesn't help the clipped-`FlatList`-row case beyond parity — `resolveView` happily returns a
  detached view (clipping never touches the tag registry), so `isAttachedToWindow()` must still be
  checked explicitly, same as the plain walk.

**Implementation steps**
1. Run Section 4.2's walk once; on match, cache `nativeId → view.getId()`.
2. On every re-resolve (scroll tick): `resolveByTag(reactContext, cachedTag)`; on `null`, evict the
   cache entry and fall back to a fresh Section 4.2 walk (handles remount-with-new-tag).
3. After a successful resolve, check `view.isAttachedToWindow()` and `view.width/height > 0` before
   trusting the rect (Section 2.4's preallocation caveat).

**Integration:** would extend `MoEngageTooltipBridgeHandler`/`NativeTreeWalkExploration` with a small
`mutableMapOf<String, Int>()` cache and a second entry point (`reResolveAndShow(nativeId)`) called from
a scroll listener instead of `findAndShowByNativeId` on every tick.

### 4.4 Recommended: dedicated wrapper owns a ref → React tag → `resolveView` — no string tag, no walk

**Mechanism:** eliminate the walk (and its ambiguity/reachability problems) entirely by having JS hand
native an unambiguous numeric React tag from the start, obtained the same way `findNodeHandle` does,
then resolve it exactly like Section 4.3's second step — but as the *only* resolution step, never a
fallback from a walk.

**Why this closes every remaining gap:**

| Gap from Section 4.2          | Why it's structurally eliminated here                                                                                                                                                                             |
|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Nested `<Text>`               | The wrapper is always a real top-level host `<View>`; you wrap the *phrase*, so there's always something real to ref                                                                                              |
| `<Modal>` / separate `Window` | `resolveView` is a global tag→view registry, not rooted at any particular `Window` — resolves fine regardless of which window the view ended up in                                                                |
| Non-forwarding custom wrapper | Solved by owning the ref inside `MoETooltipAnchor` itself — the *developer's* wrapper components are irrelevant; nothing needs to forward a prop through them                                                     |
| Duplicate string tag          | A React tag is unique per mounted instance by construction — there is no equivalent of two elements sharing one `nativeID`                                                                                        |
| Clipped `FlatList` row        | Registry entry (and thus `resolveView`) is untouched by `removeClippedSubviews` — resolves fine; `isAttachedToWindow()` gives an honest, separate "currently visible or not" signal instead of a silent walk-miss |

**JS: wrapper component (new file, `sdk/tooltip/src/TooltipAnchor.tsx`)**
```tsx
import React, { useEffect, useRef } from 'react';
import { findNodeHandle, View, type ViewProps } from 'react-native';
import MoEngageTooltipBridge from './NativeMoEngageTooltip';

export interface TooltipAnchorProps extends ViewProps {
  anchorTag: string; // our own namespace — never reuses testID/nativeID
}

export function TooltipAnchor({ anchorTag, children, ...rest }: TooltipAnchorProps) {
  const ref = useRef<View>(null);
  useEffect(() => {
    const reactTag = findNodeHandle(ref.current);
    if (reactTag != null) {
      MoEngageTooltipBridge.registerAnchor(anchorTag, reactTag);
    }
    return () => MoEngageTooltipBridge.unregisterAnchor(anchorTag);
  }, [anchorTag]);
  return (
    <View ref={ref} collapsable={false} {...rest}>
      {children}
    </View>
  );
}
```
`collapsable={false}` is the direct JS-side equivalent of Section 2.2's `nativeID`-forces-a-view
guarantee — without it, a plain wrapping `<View>` with no other view-forming prop is exactly the kind
of node Fabric's `formsView` trait would otherwise flatten away.

**TurboModule spec addition (`sdk/tooltip/src/NativeMoEngageTooltip.ts`)**
```ts
registerAnchor: (anchorTag: string, reactTag: number) => void;
unregisterAnchor: (anchorTag: string) => void;
findAndShowByAnchorTag: (anchorTag: string, label: string) => void;
```

**Native (New Architecture only — Fabric):**
```kotlin
internal object AnchorRegistry {
    private val tagsByAnchor = mutableMapOf<String, Int>()
    fun register(anchorTag: String, reactTag: Int) { tagsByAnchor[anchorTag] = reactTag }
    fun unregister(anchorTag: String) { tagsByAnchor.remove(anchorTag) }
    fun reactTagFor(anchorTag: String): Int? = tagsByAnchor[anchorTag]
}

internal object ReactTagResolution {
    fun findAndShow(reactContext: ReactContext, activity: Activity, anchorTag: String, label: String) {
        val reactTag = AnchorRegistry.reactTagFor(anchorTag) ?: return
        val uiManager = UIManagerHelper.getUIManagerForReactTag(reactContext, reactTag) ?: return
        val view = try {
            uiManager.resolveView(reactTag)
        } catch (e: IllegalViewOperationException) {
            null
        } ?: return
        if (!view.isAttachedToWindow || view.width == 0 || view.height == 0) return // not currently visible — dismiss, don't guess

        val location = IntArray(2)
        view.getLocationOnScreen(location)
        OverlayHost.show(activity, location[0], location[1], view.width, view.height, label)
    }
}
```
Both `resolveView` and `getLocationOnScreen` must run on the UI thread (Section 2.4) — call this from
`UiThreadUtil.runOnUiThread { ... }` if the bridge method can be invoked off it.

**Pros**
- Resolvable in every case in the table above, deterministically, O(1) after registration.
- Honest failure/visibility signal (`resolveView` null/throw vs. `isAttachedToWindow() == false`) —
  supports Section 5's dismiss-on-loss behavior correctly instead of guessing.
- Own namespace (`anchorTag`), matching this doc's Section 4.2-recommendation precedent and avoiding
  the `testID` collision risk called out for that prop.
- Natural place to add a Netcore-style secondary per-instance disambiguation key for repeated list
  templates without overloading a single string.

**Cons**
- Requires JS code changes (the wrapper) — same "new target → new release" trade-off as every JS-side
  approach; not a free native-only win like Section 4.2.
- New moving parts: a registration lifecycle (mount/unmount → register/unregister), and the registry
  itself needs to be cleared appropriately on screen unmount / RN instance reload to avoid leaking
  stale entries.
- The wrapper adds one extra host view (`<View collapsable={false}>`) around every anchored target —
  usually invisible layout-wise, but a real addition to the view tree depth.

**Implementation steps (net new work)**
1. Add `TooltipAnchor.tsx` (above) to `sdk/tooltip/src`, export from `index.ts`.
2. Extend `NativeMoEngageTooltip.ts`'s `Spec` with `registerAnchor`/`unregisterAnchor`/`findAndShowByAnchorTag`.
3. Add `AnchorRegistry` + `ReactTagResolution` Kotlin objects under
   `sdk/tooltip/android/.../viewresolution/reacttagregistry/`.
4. Wire three new methods through `MoEngageTooltipBridgeHandler` → `src/newarch/MoEngageTooltipBridge.kt`
   (New Architecture only — no `src/oldarch` changes needed given Section 1's scope).
5. New exploration screen (`ReactTagRegistryScreen.tsx`) wrapping a `FlatList` row in `<TooltipAnchor>`
   to demonstrate the clipped-row case resolving correctly where Section 4.2's screen fails.

### 4.5 Native-side: `accessibilityLabel` (contentDescription) walk

**Mechanism:** identical walk to Section 4.2, matching `View.getContentDescription()` instead of the
`nativeID` tag — implemented today as `AccessibilityLabelWalkExploration`, rendering through
`FloatingWindowExploration` (a `WindowManager` window, not the decor-view overlay).

**Pros:** no dedicated SDK tagging at all if the app already sets `accessibilityLabel` for a11y
purposes — reuses existing metadata.

**Cons:** exactly the same structural gaps as Section 4.2 (nested `<Text>`, Modal, non-forwarding
wrapper, duplicate label, clipped `FlatList` row) — `accessibilityLabel` gets the same
`formsStackingContext` protection as `nativeID` in `ViewShadowNode.cpp:58` (`viewProps.accessible`),
so it's equally Fabric-safe, but equally walk-limited. Additionally risks colliding with the app's
actual accessibility semantics (screen-reader text) the same way `testID` risks colliding with e2e
tests — prefer a dedicated tag over overloading either.

## 5. Scroll / list handling under Fabric (`FlatList`)

RN Android has no native `RecyclerView` exposed to JS — `FlatList` is RN's windowed-list equivalent,
and it's what "RecyclerView-style" means here. Fabric doesn't change the two failure modes already
identified for it:

1. **Clipping (before unmount).** `removeClippedSubviews` defaults to `true` on Android for `FlatList`
   (`Libraries/Lists/FlatList.js:161-166`). `ReactViewGroup.updateSubviewClipStatus()`
   (`views/view/ReactViewGroup.kt`) — a **shared Java/Kotlin view class used by both architectures'
   `ViewManager`s**, not a Fabric- or Paper-specific mechanism — physically detaches an off-screen
   row's view from its parent the instant it leaves the clipping rect. React still considers the row
   mounted; Section 4.2's walk fails (detached ⇒ unreachable); Section 4.4's `resolveView` still
   succeeds (registry untouched) but must be paired with an `isAttachedToWindow()` check to report
   "not currently visible" honestly instead of returning a stale rect.
2. **True virtualization/unmount.** Once a row scrolls far enough outside `VirtualizedList`'s render
   window, it's unmounted outright — tag gone, registry entry gone, everything fails uniformly. Treat
   as "anchor gone" → dismiss.

**Fabric-specific clarification:** Paper's view-flattening optimizer (`NativeViewHierarchyOptimizer`,
`isLayoutOnly`/`collapsable`) is legacy-bridge-only machinery — Fabric never calls into it. Fabric's
equivalent decision (whether a shadow node needs a real view at all) is made in C++ via
`ViewShadowNode.cpp`'s trait computation (Section 2.2). Functionally similar outcome, structurally
different code path — don't reference `NativeViewHierarchyOptimizer` when reasoning about Fabric
flattening.

**Recommended re-measure loop (independent of which Section 4 mechanism is used):**
- JS-side signal: debounced `onScroll`/`onLayout` on the scrollable ancestor.
- Native-side signal (lower latency, doesn't depend on JS thread being free):
  `ViewTreeObserver.OnScrollChangedListener`/`OnGlobalLayoutListener` attached to the root.
- On each tick: re-resolve (Section 4.3 or 4.4's O(1) path, not a fresh Section 4.2 walk) → if
  resolution fails or `isAttachedToWindow()` is false → dismiss immediately, don't reposition to a
  stale rect.
- Partial visibility (behind a sticky header, half off the top edge): treat as not-visible, same
  100% rule the Flutter/native docs use — dismiss rather than point at something half-covered.
- Auto-dismiss timers stay independent of scroll-driven re-measurement/dismissal.

## 6. Recommended approach (New Architecture)

1. **Element tagging:** Section 4.4's dedicated `TooltipAnchor` wrapper as the primary mechanism —
   the only one that's resolvable in every case in Section 4.2's gap table, not just the common ones.
2. **Resolution:** ref → `findNodeHandle` → cache the React tag → `FabricUIManager.resolveView` via
   `UIManagerHelper.getUIManagerForReactTag`, wrapped for the throw-not-null gotcha (Section 2.4),
   always paired with `isAttachedToWindow()`.
3. **Rendering:** Section 3.1's decor-view overlay, reusing whatever chrome the native Android SDK's
   `toolTipExploration` branch ships.
4. **Scroll/list handling:** native `ViewTreeObserver` listener + O(1) re-resolve, dismiss on any
   resolution/attachment failure, independent auto-dismiss timer (Section 5).
5. **Keep Section 4.2 (`nativeID` walk)** as a zero-JS-change fallback/quick-integration option for
   targets where shipping the wrapper isn't feasible yet — with its gap table (Section 4.2) documented
   as a known-limitations list for that mode, not silently assumed away.
6. **Fix Section 3.2's interop-layer risk** before relying on the embedded `TooltipAnchorView` for
   anything beyond exploration — migrate to `codegenNativeComponent`.

## 7. Competitor analysis — React Native, New Architecture specifically

Refreshed against each vendor's current public docs/SDK source (fetched during this revision) rather
than carried over from the previous version — one finding materially changed (Pendo, 7.1).

### 7.1 Pendo

- **Two different tagging mechanisms are documented, from different eras of their SDK, and they
  disagree with each other:**
  - The general ["mobile tagging technicalities"](https://support.pendo.io/hc/en-us/articles/360057783991-Overview-of-mobile-tagging-technicalities)
    article describes a `nativeID` prop matched against a configurable regex (default prefix
    `pendoClickable`), `testID` documented as an explicit alternative (mapped to native `setTag`
    Android / `accessibilityIdentifier` iOS), and a manual `sendClickAnalytics(nativeID)` fallback API
    when auto-detection misses.
  - The SDK's own current GitHub docs([`rn-android.md`](https://github.com/pendo-io/pendo-mobile-sdk/blob/master/android/pnddocs/rn-android.md))
    instead describe a **"codeless" solution for RN 0.66–0.84** that appears to identify elements by
    **class/function name**, not `nativeID` — it explicitly requires `keep_classnames: true` and
    `keep_fnames: true` in the Metro minifier config for production bundles, "because RN minifies
    class and function names... there is no access to the original component names used for the
    codeless solution" otherwise. This is a materially different mechanism from the `nativeID`-walk
    approach this doc's Section 4.2 is built on.
- **New Architecture (Fabric) support is version-gated:** per the SDK's own GitHub docs, **Fabric
  support ships starting SDK v3.7.2** (both Android and iOS) — not from day one of RN's New
  Architecture default.
- **A real New-Architecture-specific breakage exists, and it's a registration-shape bug, not an
  anchoring bug:** a community-reported issue on RN 0.76 + New Architecture + `rn-pendo-sdk` 3.5.1
  ([community post](https://support.pendo.io/hc/en-us/community/posts/33825167589531-React-native-76-new-architecture-error))
  reports the app failing to start entirely with *"Module exports two methods to JavaScript with the
  same name: 'setup'"* — the New Architecture's TurboModule codegen is stricter about overloaded
  `@ReactMethod`s with the same JS-visible name than the legacy bridge was. A community member's
  workaround was manually removing one `@ReactMethod` annotation from an overloaded native method. No
  official Pendo fix is documented as of this doc's research. **Takeaway for us:** the New
  Architecture's stricter TurboModule codegen validation is a real integration risk independent of
  anchoring logic — worth a deliberate check that `MoEngageTooltipBridgeHandler`'s methods have no
  overloads sharing a JS-visible name, since the same class of bug would block this SDK's tooltip
  module from loading at all under New Architecture, not just degrade anchoring.

### 7.2 Netcore Cloud (Hansel / Product Experience)

- **Mechanism confirmed via their current docs**
  ([dynamic-views doc](https://cedocs.netcore.ai/docs/reactnative-setting-up-hansel-index-for-dynamic-views)):
  a fixed shared `nativeID="hansel_dynamic_view"` on every repeated row plus a per-instance
  `testID="{unique_id}#{layer_count}"`, registered in `MainApplication.onCreate` via
  **`ReactFindViewUtil.addViewsListener()`** — the exact same RN-internal utility class this doc's
  Section 4.2 already identifies as the origin of the hand-rolled walk in `NativeTreeWalkExploration.kt`.
  Netcore isn't walking the tree themselves at call time — they're registering a listener once at app
  start and letting RN's own `notifyViewRendered()` hook (fired from `BaseViewManager.setNativeId()`,
  confirmed shared across Paper/Fabric per Section 2.3) call them back as matching views mount.
- **Version gate:** `smartech-reactnative-nudges` ≥ v1.0.16, Android SDK ≥ v8.8.1, iOS SDK ≥ v8.5.26.
- **New Architecture/Fabric:** **not mentioned anywhere in this specific doc.** Given `ReactFindViewUtil`
  and `notifyViewRendered()` are confirmed shared, listener-based code registered this way should
  keep working unmodified under Fabric — but that's an inference from RN internals, not a Netcore
  claim; treat as unverified until confirmed against their current SDK version directly.
- **Still the only vendor with a doc page dedicated specifically to list/recycling anchoring** — direct
  third-party validation that Section 5's problem is real enough to need a named, versioned fix.

### 7.3 Apxor

- **Still the least transparent of the four for React Native specifically.** Their
  ["Automatic View Finder" blog post](https://apxor.com/blog/automatic-view-finder-in-app), re-checked
  for this revision, remains entirely marketing-level: "helps identify elements... using different
  unique methods," "works seamlessly with apps that have constantly changing layouts," "completely
  avoid developer efforts to create IDs and tags." **Neither React Native nor Fabric/New Architecture
  is mentioned anywhere in the content.** No technical mechanism, no framework specificity.
- A real `react-native-apxor-sdk` package exists (per the previous revision's research), but nothing
  found — then or now — documents whether AVF's "no tags needed" claim is implemented for RN the same
  way it evidently is for native Android, or degrades to a tagging-based approach for RN specifically.
- **Unchanged conclusion:** a real RN SDK exists; its RN-specific and New-Architecture-specific
  anchoring mechanics remain unverifiable from public material.

### 7.4 Plotline

- **No public RN-specific technical documentation found**, re-confirmed via a fresh search for this
  revision — search results return only generic "React Native New Architecture in 2026" explainer
  content from unrelated blogs, nothing from Plotline itself about their SDK's RN integration, let
  alone Fabric/New Architecture support specifically.
- Their [nudges product page](https://www.plotline.so/products/nudges) still lists React Native as a
  supported platform with a "20-minute integration" marketing claim; their technical docs portal
  remains login-gated.
- **Unchanged conclusion:** flag explicitly that no RN-specific claim about Plotline — anchoring
  mechanism, New Architecture support, or otherwise — could be verified beyond "they say they support
  it."

### 7.5 Takeaways for our design

- **Pendo's evolution away from `nativeID`** (general docs) **toward a class/function-name-based
  "codeless" mechanism** (current SDK docs) is a new data point since the previous version of this
  doc: it suggests at least one mature competitor found pure `nativeID`-walk insufficient at scale and
  moved toward automatic, tag-free detection — worth revisiting if Section 4.4's per-element wrapper
  proves too much integration overhead for real campaigns later, though "automatic" detection has its
  own minification/obfuscation fragility (their own `keep_classnames`/`keep_fnames` requirement is a
  real production footgun of that approach).
- **Netcore's registration pattern** (`ReactFindViewUtil.addViewsListener` at app start, not a
  walk-on-demand) is arguably a better shape than this repo's current `findAndShow`-does-a-fresh-walk
  design — it means a target that isn't mounted *yet* still resolves the moment it mounts, without a
  second explicit call. Worth adopting as a refinement to Section 4.2 regardless of whether Section
  4.4 becomes the primary mechanism.
- **Pendo's TurboModule registration crash** is the clearest concrete evidence in this whole
  competitor set that New Architecture adoption risk isn't limited to *anchoring* — it can break a
  tooltip SDK's ability to load at all. Worth a explicit lint/test for duplicate JS-visible method
  names across `MoEngageTooltipBridgeHandler`'s New Architecture bridge.
- **Apxor and Plotline remain unverifiable** for RN/Fabric specifics — no actionable technical
  takeaway beyond "don't assume their marketing claims translate to RN without direct confirmation."

## 8. Spotlight — a second feature with the same anchor problem

Spotlight is a distinct interaction pattern from the tooltip bubble covered in Sections 3–5 — a
full-screen dimmed scrim with a transparent cutout around one anchor, tap-anywhere-to-dismiss, meant
to draw hard focus to a single element rather than annotate several. But it needs exactly the same
two things every other "way" in this doc needs: a resolved screen rect for an anchor, and somewhere
to render chrome on top of the app. Checked directly against
[`../MoEngage-Android-SDK`](https://github.com/moengage/MoEngage-Android-SDK) — both its shipped
`tooltip` module and a more thorough sample-app POC — plus the native team's own
[Spotlight Exploration - Android POC](https://moengagetrial.atlassian.net/wiki/spaces/MS/pages/6377635847/Spotlight+Exploration+-+Android+POC)
doc, to ground Spotlight-specific recommendations in what the native side already built and learned,
rather than re-deriving them from scratch for RN.

### 8.1 What already exists natively

**Shipped module** (`MoEngage-Android-SDK/tooltip/src/main/java/com/moengage/tooltip/`, branch
`exploration/tootip_and_walkthrough`) — `MoESpotlightHelper`, `SpotlightConfig`, `SpotlightShape`,
`internal/ui/SpotlightManager.kt`, `internal/ui/SpotlightOverlay.kt`:
- Anchor resolution: a direct `View` reference, an `@IdRes` view ID (`findViewById`), or a string
  `tag` — resolved first against `MoETooltipAnchorRegistry` (a Compose-only registry populated by
  `Modifier.moeTooltipAnchor(tag)`'s `onGloballyPositioned` callback, defined in `MoETooltipTag.kt`
  and shared with the plain-tooltip feature), falling back to
  `activity.window.decorView.findViewWithTag(tag)` for XML. **Important distinction from this doc's
  `nativeID` walk:** `findViewWithTag` matches Android's generic `View.setTag(Object)`/`android:tag`
  attribute — a completely different tag slot from RN's `nativeID` (`R.id.view_tag_native_id`) or
  Section 4.4's numeric React tag. Native Android has no `nativeID` concept at all; this is its own
  parallel string-tag mechanism, not something RN's approaches interoperate with directly.
- Rendering: a `ComposeView` added straight to `activity.window.decorView` — i.e., the *same family*
  of technique as this doc's Section 3.1 decor overlay, just Compose-hosted instead of a plain
  `TextView`. `SpotlightOverlay` draws the scrim + cutout via `Modifier.graphicsLayer(compositingStrategy
  = CompositingStrategy.Offscreen)` + `drawWithContent` + `BlendMode.Clear` — an offscreen composite is
  required for `BlendMode.Clear` to actually erase pixels rather than blend with whatever's behind it
  in the view hierarchy; skipping it is a common bug when hand-rolling this shape of overlay.
- Live tracking: `moeTooltipAnchor`'s `onGloballyPositioned` fires on every layout pass (including
  every scroll frame), pushing fresh bounds into the registry; `SpotlightManager.updatePosition()`
  updates a `mutableStateOf<Rect>` that the Compose overlay reads, so the cutout moves without
  recreating the overlay. On the anchor leaving composition (`DisposableEffect.onDispose`), a
  registered "gone" observer dismisses the spotlight automatically. **This is a fully Compose-only
  code path** — the XML/`findViewWithTag` fallback in `showSpotlight(activity, tag, ...)` has no
  scroll-tracking equivalent; it resolves once and never re-measures, structurally identical to this
  doc's Section 4.2 `nativeID` walk's own "single-shot" limitation.

**Sample-app POC** (`MoEngage-Android-SDK/sampleapp/src/main/java/com/moengage/sampleapp/spotlight/`)
goes materially further than the shipped module and matches the Confluence doc's own recommendations
more closely — worth treating as the more authoritative reference of the two:
- `internal/registry/ViewSpotlightExtensions.kt`'s `View.spotlightTarget(id)` is a **registration**,
  not a **walk**: it attaches `View.OnLayoutChangeListener` + `ViewTreeObserver.OnPreDrawListener` +
  `View.OnAttachStateChangeListener` directly to the target `View`, keeping `SpotlightRegistry`
  continuously current — including an explicit `RecyclerView`-reuse guard (`registrations.remove(view)
  ?.stop(view)` before registering a new id on a view that's about to be rebound to different data),
  and clears the registry entry the moment the view detaches, is hidden (`!isShown || !isVisible`), or
  collapses to zero size. This is a strictly more robust version of the tracking story this doc
  proposes in Sections 4.4/5 — see 8.3 below for how to port it directly onto RN's resolved View.
- `internal/host/SpotlightWindowHost.kt` and `internal/host/SpotlightRootAttachHost.kt` implement
  **both** rendering approaches from the Confluence POC as parallel, selectable `SpotlightHostMode`s
  (`SpotlightRequest.hostMode`, defaulting to `NEW_WINDOW`) — the shipped module only implements the
  `ATTACH_TO_TARGET_ROOT`-equivalent. Concrete gotchas the POC's own code comments and Confluence doc
  surfaced, all directly relevant to Section 3 of this doc:
  - **`WindowManager.BadTokenException`** — `SpotlightWindowHost.show()` wraps `windowManager.addView()`
    in try/catch specifically for this; the target's window token can go stale between resolving the
    anchor and adding the panel (e.g., the host Activity/Dialog is finishing).
  - **IME focus save/restore** — taking a new window steals focus and Android auto-hides the soft
    keyboard; `SpotlightWindowHost` explicitly captures `activity.currentFocus` before `addView()` and
    calls `requestFocus()` + `showSoftInput()` on the same view during `dismiss()` to bring it back.
  - **`FLAG_LAYOUT_IN_SCREEN`/`FLAG_LAYOUT_NO_LIMITS`** pin the new window at screen origin `(0,0)` so
    stored screen-coordinate bounds map directly onto the overlay with zero runtime conversion — the
    Confluence doc calls this out as the deciding factor in favor of `NEW_WINDOW` over root-attach.
  - **Root-attach's own sharp edges** (`SpotlightRootAttachHost`): a `MATCH_PARENT` overlay container
    added to a `WRAP_CONTENT` Dialog forces that Dialog to expand to fullscreen — worked around here by
    sizing the container to the root's *current measured* size instead of `MATCH_PARENT`; and — Compose-
    specific, not applicable to RN's plain-View rendering — a Dialog's `DecorView` has no
    `ViewTreeLifecycleOwner` set by the framework, crashing `ComposeView`'s `WindowRecomposer`
    resolution unless a custom `Recomposer` is supplied manually (`recomposerScope`/`Job` dance in the
    POC's `show()`).
- **Element identification, per the Confluence doc's own comparison table** — String Tag (✅ Compose,
  ✅ XML, stable, "tag per element" cost) is the explicit recommendation over View ID/Resource ID (XML
  only) and raw XY coordinates (zero client effort but "breaks on scroll, keyboard, orientation... not
  portable across devices" — the doc's own words, and exactly the failure mode this RN doc's Section
  4.1 already avoids by resolving live rather than caching a coordinate).

### 8.2 Mapping onto RN / New Architecture

| Native concept                                                | RN/Fabric equivalent already in this doc                                                                                                                                                                                                                                                    |
|---------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| String Tag (Compose `Modifier`/XML `android:tag`)             | `nativeID` (Section 4.2) or `TooltipAnchor`'s React-tag registration (Section 4.4) — RN has no direct access to Android's generic `View.setTag(Object)` slot the native SDK uses, so this isn't literally reusable; the *pattern* (an app-chosen string resolved live) is what carries over |
| View ID / Resource ID                                         | No RN equivalent — RN never assigns Android resource IDs to host views; not portable to this stack                                                                                                                                                                                          |
| XY Coordinates                                                | Explicitly rejected by the native POC for the same reason Section 4.1 of this doc never considered it: not stable across device/density/scroll/keyboard                                                                                                                                     |
| `NEW_WINDOW` rendering (`SpotlightWindowHost`)                | A `WindowManager`-based overlay analogous to this doc's Section 3.4 (`FloatingWindowExploration`, already shipped for the `accessibilityLabel` "way") — not Section 3.1's decor overlay, which is closer to `ATTACH_TO_TARGET_ROOT`                                                         |
| `ATTACH_TO_TARGET_ROOT` rendering (`SpotlightRootAttachHost`) | Section 3.1's `OverlayHost` — what this doc already recommends and what the *shipped* native module actually uses (not what the native POC's own doc recommends — see 8.4)                                                                                                                  |
| `View.spotlightTarget(id)`'s listener-based live tracking     | Not yet present anywhere in this doc's RN code — see 8.3, a genuinely new recommendation this reading surfaces                                                                                                                                                                              |

### 8.3 New recommendation surfaced by this comparison: port the listener-registration pattern onto the resolved RN View

Sections 4.2/4.3/4.4 all resolve a `View` once (walk, cached-tag lookup, or `resolveView`) and then
rely on Section 5's *external* scroll listener (attached to the Activity's root) polling for a new
rect on every scroll tick. `ViewSpotlightExtensions.kt` shows a better-isolated alternative: attach
`OnLayoutChangeListener` + `OnPreDrawListener` + `OnAttachStateChangeListener` **directly to the
resolved anchor `View` itself**, once, right after any Section 4 mechanism first resolves it —
independent of which resolution mechanism found the view in the first place:

```kotlin
internal object AnchorTracker {
    fun track(view: View, onBoundsChanged: (Rect) -> Unit, onGone: () -> Unit): () -> Unit {
        val preDrawListener = ViewTreeObserver.OnPreDrawListener {
            if (view.isAttachedToWindow && view.isShown && view.width > 0 && view.height > 0) {
                val loc = IntArray(2)
                view.getLocationOnScreen(loc)
                onBoundsChanged(Rect(loc[0], loc[1], loc[0] + view.width, loc[1] + view.height))
            } else {
                onGone()
            }
            true
        }
        val attachListener = object : View.OnAttachStateChangeListener {
            override fun onViewAttachedToWindow(v: View) = Unit
            override fun onViewDetachedFromWindow(v: View) = onGone()
        }
        view.viewTreeObserver.addOnPreDrawListener(preDrawListener)
        view.addOnAttachStateChangeListener(attachListener)
        return {
            view.viewTreeObserver.removeOnPreDrawListener(preDrawListener)
            view.removeOnAttachStateChangeListener(attachListener)
        }
    }
}
```

**Why this is strictly better than Section 5's external-listener approach:**
- No dependency on the caller knowing which `ScrollView`/`FlatList` ancestor to attach a listener to
  — it rides the resolved view's own `ViewTreeObserver`, which fires on every draw pass regardless of
  *why* the layout changed (scroll, keyboard, rotation, sibling relayout).
- `onViewDetachedFromWindow` gives an exact, immediate "anchor is gone" signal — no separate
  `isAttachedToWindow()` poll needed on a timer; this native callback fires the instant `removeView`/
  `removeClippedSubviews`-driven detach happens (Section 4.2's clipped-`FlatList`-row case, Section
  4.4's registry case — both benefit identically, since this attaches to the plain `View`, independent
  of how it was found).
- Directly reusable regardless of which Section 4 mechanism resolved the view first — call
  `AnchorTracker.track(view, ...)` right after any successful `nativeID` walk (4.2), cached-tag
  `resolveView` (4.3), or React-tag `resolveView` (4.4) call succeeds. This closes Section 4.2's
  "single-shot, not reactive" con and Section 5's dependency on a separately-wired scroll listener in
  one shared piece of native code, usable by both the tooltip bubble and a future RN Spotlight.

### 8.4 A discrepancy worth resolving before building on either side

The native team's own Confluence POC recommends `NEW_WINDOW` (new `WindowManager` window, screen-origin
pinned, single code path across Activity/Dialog/BottomSheet) as the primary rendering approach — but
the module that actually shipped (`tooltip/internal/ui/SpotlightManager.kt`) uses only the
`ATTACH_TO_TARGET_ROOT` equivalent (`decorView.addView`), the *rejected* option in the POC's own
comparison table. This repo's RN `OverlayHost` (Section 3.1) independently arrived at the same
decorView-attach shape as the shipped native module — consistent with each other, but consistent with
the *documented-as-inferior* native approach, not the *documented-as-recommended* one. Two concrete
consequences worth resolving deliberately rather than by accident:
- Per the POC's own comparison table, decorView-attach is "bounded by the host window, tooltips near
  Dialog or BottomSheet edges are clipped and cannot overflow outside the window bounds" — directly
  relevant to this doc's Section 3.3/4.2 Modal caveat: even where a future fix resolves an anchor
  *inside* an RN `<Modal>`, decorView-attach rendering can't place chrome outside that Modal's own
  window bounds anyway. A `NEW_WINDOW`-style overlay (Section 3.4's `FloatingWindowExploration` family,
  already shipped for one "way" in this module) doesn't have that limitation.
- Whether to bring RN's tooltip/spotlight rendering in line with the POC's recommendation (add a
  `NEW_WINDOW` option) or leave it matching the shipped module's simpler, currently-adequate approach
  is a real product decision, not something to default silently — flagging it here rather than picking
  one implicitly.


## 9. Open questions / risks

- Should `TooltipAnchor` (Section 4.4) ship as this SDK's primary integration path, with the `nativeID`
  walk (Section 4.2) demoted to an explicitly-documented fallback — or does the zero-JS-change nature
  of 4.2 matter enough (e.g., for retrofitting onto apps that can't take a release quickly) to keep it
  co-primary?
- Migrate `TooltipAnchorViewManager` off the Fabric interop layer onto `codegenNativeComponent` before
  Section 3.2 is relied on for anything beyond exploration (Section 3.2).
- Confirm Netcore's `ReactFindViewUtil.addViewsListener` registration pattern actually works unmodified
  under Fabric on their current SDK version — the shared-code inference in Section 7.2 is plausible
  but unverified against their actual shipped behavior.
- Add an explicit check (lint rule or test) for duplicate JS-visible method names in this module's
  TurboModule bridge, prompted directly by Pendo's documented New Architecture crash (Section 7.1).
- Does the native MoEngage-Android-SDK tooltip work (`toolTipExploration` branch) land with an API
  shape RN's New Architecture bridge can call directly, or does RN need its own overlay/positioning
  code independent of it?
- How do we disambiguate repeated list-item templates under Section 4.4 — a second key on
  `TooltipAnchor` (`instanceKey` alongside `anchorTag`), mirroring Netcore's `testID` pattern, or a
  single composite tag?
- Resolve Section 8.4's rendering discrepancy deliberately — bring RN tooltip/Spotlight rendering in
  line with the native POC's `NEW_WINDOW` recommendation, or explicitly accept the shipped native
  module's (and this repo's) simpler decor-attach approach and its Dialog/BottomSheet clipping
  limitation.
- Port Section 8.3's `AnchorTracker` listener pattern into `sdk/tooltip`'s native code as a shared
  utility usable by both the tooltip bubble and a future RN Spotlight bridge method, rather than
  building Spotlight's tracking independently.
- Decide the RN Spotlight bridge contract: reuse `TooltipAnchor`/`findAndShowByAnchorTag`'s resolution
  (Section 4.4) with a new `showSpotlight(anchorTag, shape, dimAlpha, ...)` method, or a
  `nativeID`-based `findAndShowSpotlightByNativeId` mirroring Section 4.2 for parity with the module's
  existing zero-JS-change option.

## 10. References

- [React Native docs — `nativeID`](https://reactnative.dev/docs/view#nativeid),
  [`findNodeHandle`](https://reactnative.dev/docs/nativemethods),
  [`UIManager.measure`/`measureInWindow`](https://reactnative.dev/docs/direct-manipulation)
- Pendo — [Overview of mobile tagging technicalities](https://support.pendo.io/hc/en-us/articles/360057783991-Overview-of-mobile-tagging-technicalities),
  [RN Android SDK docs (GitHub)](https://github.com/pendo-io/pendo-mobile-sdk/blob/master/android/pnddocs/rn-android.md),
  [New Architecture crash report (community)](https://support.pendo.io/hc/en-us/community/posts/33825167589531-React-native-76-new-architecture-error)
- Netcore Cloud — [Setting up Hansel index for dynamic views (RN)](https://cedocs.netcore.ai/docs/reactnative-setting-up-hansel-index-for-dynamic-views),
  [React Native Product Experience integration](https://cedocs.netcorecloud.com/docs/react-native-product-experience),
  [Setup nudges (device pairing)](https://cedocs.netcorecloud.com/docs/setup-nudges)
- Apxor — [React Native SDK guide](https://guides.apxor.com/getting-started-with-apxor/sdk/react-native),
  [Automatic View Finder](https://apxor.com/blog/automatic-view-finder-in-app)
- Plotline — [Nudges product page](https://www.plotline.so/products/nudges) *(no RN-specific technical
  docs publicly available — Section 7.4)*
- Native MoEngage-Android-SDK tooltip prototype — [`toolTipExploration` branch](https://github.com/moengage/MoEngage-Android-SDK/tree/toolTipExploration)
- Native MoEngage-Android-SDK Spotlight — [Spotlight Exploration - Android POC (Confluence)](https://moengagetrial.atlassian.net/wiki/spaces/MS/pages/6377635847/Spotlight+Exploration+-+Android+POC),
  [`poc/spotlight` branch](https://github.com/moengage/MoEngage-Android-SDK/tree/poc/spotlight);
  shipped module referenced directly (branch `exploration/tootip_and_walkthrough`):
  `tooltip/src/main/java/com/moengage/tooltip/{MoESpotlightHelper,MoETooltipHelper,SpotlightConfig,SpotlightShape,MoETooltipTag}.kt`,
  `tooltip/src/main/java/com/moengage/tooltip/internal/ui/{SpotlightManager,SpotlightOverlay}.kt`;
  sample-app POC referenced directly:
  `sampleapp/src/main/java/com/moengage/sampleapp/spotlight/{Spotlight,internal/host/SpotlightWindowHost,internal/host/SpotlightRootAttachHost,internal/registry/SpotlightRegistry,internal/registry/ViewSpotlightExtensions,internal/model/SpotlightHostMode,internal/model/SpotlightRequest,internal/model/SpotlightTargetInfo}.kt`
- This repo's existing tooltip exploration module (all New Architecture–relevant source referenced
  above): `sdk/tooltip/android/src/main/java/com/moengage/react/tooltip/`, `sdk/tooltip/src/`,
  `SampleApp/src/tooltipExploration/`
- React Native source referenced directly (version 0.81.1, `node_modules/react-native`):
  `ReactCommon/react/renderer/components/view/ViewShadowNode.cpp`,
  `ReactAndroid/.../uimanager/BaseViewManager.java`, `.../uimanager/ViewManager.java`,
  `.../uimanager/UIManagerHelper.kt`, `.../uimanager/util/ReactFindViewUtil.kt`,
  `.../fabric/FabricUIManager.java`, `.../fabric/mounting/SurfaceMountingManager.java`,
  `.../fabric/mounting/MountingManager.kt`, `.../views/view/ReactViewGroup.kt`,
  `.../views/text/ReactVirtualTextViewManager.kt`, `.../views/modal/ReactModalHostView.kt`,
  `Libraries/Lists/FlatList.js`
