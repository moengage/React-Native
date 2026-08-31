# React-Native (Android) ToolTip Exploration

> Consolidates every exploration doc produced on this branch so far —
`nativeID-vs-testID-analysis.md`,
> `recyclerview-tooltip-handling.md`, and `REACT_NATIVE_TOOLTIP_EXPLORATION.md` (all in this repo
> root)
> — into the structure of the Confluence draft
> [\[DRAFT\] React-Native (Android) ToolTip Exploration](https://moengagetrial.atlassian.net/wiki/spaces/MS/pages/6705971265).
> Each section below says what was actually **built and verified on-device** in `SampleApp` /
> `MoEngage-Android-SDK` versus what was **explored/recommended but not implemented** — the two are
> kept explicitly distinct throughout rather than blurred together.

## Problem Statement

- Explore options for finding a view widget at runtime in a React Native (Android) app, and sending
  enough information to the backend to let it create a campaign targeting that specific widget.
- Explore the ToolTip, Beacon, CoachMark, Spotlight, and Walkthrough display mechanisms for React
  Native (Android) apps, backed by the native `MoEngage-Android-SDK` `tooltip` module.

## PRD

- [Tooltips and walkthroughs Exploration](https://moengagetrial.atlassian.net/wiki/spaces/MOEN/pages/3959521283)
- [Tooltips and walkthroughs](https://moengagetrial.atlassian.net/wiki/spaces/MOEN/pages/4024402446)

## View Widget Finding

Both mechanisms below are RN props consumed by every `BaseViewManager`, but they write to two
different Android tag slots — that's the root of almost every difference between them. Full detail:
`nativeID-vs-testID-analysis.md`.

### Using Native ID

**Working**

Yes. `nativeID` writes to a dedicated, RN-reserved tag key
(`view.getTag(com.facebook.react.R.id.view_tag_native_id)`), set by `BaseViewManager.setNativeId()`.
Under Fabric, any element with a non-empty `nativeID` is **guaranteed** a real backing Android
view —
`ViewShadowNode.cpp`'s `formsView` trait computation includes `!viewProps.nativeId.empty()` as one
of
the conditions that forces a real view to exist, so the element can never be flattened away. This
repo's `NativeIdViewFinder` (`sdk/tooltip/android/.../common/NativeIdViewFinder.kt`) walks the
Activity's real Android view tree looking for a matching tag — and, unlike a plain
`decorView`-rooted walk, also searches **every open window** (`AppWindows`, via
`WindowManagerGlobal`
reflection), so it resolves targets inside an open `<Modal>`/`Dialog`/`BottomSheet` too (see
[Modal Widget](#modal-widget-alert-dialog-or-bottom-sheet) below).

**Integration Steps**

1. JS sets `nativeID="my_target"` on the element — no other JS change, no ref, no
   `collapsable={false}`
   needed (the `formsView` guarantee makes that unnecessary).
2. RN bridge method receives the `nativeID` string (e.g. `findAndShowToolTipByNativeId`,
   `startCoachmarkByNativeIds`).
3. `NativeIdViewFinder.find(activity, nativeId)` walks the tree (all open windows) and returns the
   matching `View`, or `null` if nothing matched.
4. The resolved `View` is tagged with a locally-generated string (`match.tag = anchorTag`) — the
   real
   native MoEngage Tooltip SDK resolves its own targets by plain `View.tag`
   (`View.findViewWithTag`), not by RN's `nativeID` slot, so this re-tag step is what lets the SDK's
   internal lookup find the exact view already resolved here.
5. The generated tag is handed to the appropriate native helper (`MoETooltipHelper`,
   `MoEBeaconHelper`, `MoESpotlightHelper`, `MoEWalkthroughHelper`, `MoECoachMarkHelper`), which
   renders the nudge anchored to that view.

**Limitations**

- **Reflection dependency.** Reading the tag from a module with no RN compile dependency requires
  `Class.forName("com.facebook.react.R$id").getField("view_tag_native_id")` — an internal RN
  resource, not a published API. Degrades gracefully to `null` on failure, but it's still reflection
  into an implementation detail.
- **Nested `<Text nativeID="x">` inside another `<Text>` is unreachable.** It's a virtual text
  node —
  RN never creates a real Android view for it at all (confirmed zero `nativeId` handling anywhere in
  RN's text component internals). See [Nested Views](#nested-views-textview-inside-textview).
- **A non-forwarding custom wrapper drops the prop** before it ever reaches a `ViewManager` — a
  pure-JS failure mode, not something native code can see or work around.
- **Duplicate `nativeID` on multiple mounted views → silent first-match.** The walk is a pre-order
  DFS; a second element with the same value is simply unreachable, with no error or warning
  (`NativeIdFailureCasesScreen` case 4 demonstrates this deliberately).
- **`FlatList` row scrolled past the clip rect (`removeClippedSubviews`)** — the row's real Android
  `View` is physically detached from its parent, even though React still considers it mounted; the
  walk fails since a detached node is unreachable. A row scrolled far enough to be fully unmounted
  by
  `FlatList`'s own windowing fails the same way, just for a different reason (nothing to find at
  all). See [Scrollable Items](#scrollable-items).
- **Invisible to standard e2e tooling** (Detox/Appium/Maestro), which match on `testID`, not
  `nativeID` — an app already tagged for QA automation gets zero reuse from those tags for nudge
  targeting.
- **One-shot resolution.** The walk runs once per call; nothing re-resolves automatically afterward
  unless the target nudge type has been explicitly extended with live tracking (currently only
  Tooltip — see [Scrollable Items](#scrollable-items)).
- **No caching** — an O(n) walk over the whole Activity view tree (system chrome included) on every
  call.

### Using Test ID

**Working**

Partially, and deliberately not used as this exploration's primary resolution key. `testID` writes
to
the plain, general-purpose Android tag slot (`view.setTag(testId)` via
`BaseViewManager.setTestId()`)
— a public API, no reflection needed to read it. The native MoEngage Tooltip SDK's own XML-target
resolution (`View.findViewWithTag`) already operates on exactly this slot, which is precisely *why*
every RN bridge module in this exploration re-tags the `nativeID`-resolved view with a locally
generated string into that same slot rather than reading a real `testID` value directly — see the
limitation below.

**Integration Steps**

Same shape as the `nativeID` walk if `testID` were adopted as the primary lookup key instead: set
`testID="my_target"`, walk `view.tag` for that exact string. Not how this exploration is wired today
— `testID` here is the slot the bridge's own re-tagging *writes into* for the native SDK's benefit,
not a value it *reads* from JS.

**Limitations**

- **Shares the one general-purpose `View.tag` slot with everything else that might use it —
  the headline risk.** Unlike `nativeID`'s dedicated key, plain `view.tag` is fair game for other
  native libraries' own bookkeeping, the host app's own code, **and this very exploration's own
  re-tagging trick** — every bridge module (`CoachmarkExploration`, `WalkthroughExploration`,
  `BeaconExploration`, `SpotlightExploration`, `NativeTreeWalkExploration`) does `match.tag =
  anchorTag`, silently overwriting any real `testID` value on that view for as long as a campaign is
  live.
- **Higher real-world collision probability than `nativeID`'s reflection risk** — `testID` is the
  standard, widely-taught RN e2e convention; most apps with any test automation already use it
  pervasively, so a resolution mechanism riding on it is riding the one tag value an app is
  statistically most likely to already have set for an unrelated purpose.
- **Directly conflicts with the app's own QA suite while a campaign is active** — a live campaign
  re-tagging a row's `View.tag` means a Detox/Appium test asserting on that row's `testID` during
  that window fails to find it.
- Shares every structural gap `nativeID` has (duplicate value, nested `<Text>`, non-forwarding
  wrapper, `FlatList` clipping/unmount) — those come from the walk shape itself, not from which prop
  is used.

**Recommendation** (from `nativeID-vs-testID-analysis.md` §6): `nativeID` is the safer default —
its dedicated slot can't collide with other native code or the app's own test tags. Fall back to
`testID` only when `nativeID` is genuinely unavailable, and be explicit about which one actually
resolved rather than silently merging the two.

## Nudge Exploration

All five share the same RN-side shape: a bridge module under
`sdk/tooltip/android/.../nudge/<type>/` resolves each target via the [Native ID](#using-native-id)
walk, re-tags it, and hands the tag(s) to the matching native `MoEngage-Android-SDK` `tooltip`
module
helper. JS surface: `sdk/tooltip/src/index.ts`.

### ToolTip

- **Native:** `MoETooltipHelper` — a Compose bubble anchored above/below the target (`TooltipPosition
  .AUTO`/`ABOVE`/`BELOW`), rendered via `TooltipManager` as a `ComposeView` added to
  `activity.window.decorView`.
- **RN bridge:** `NativeTreeWalkExploration.findAndShow()` — resolves by `nativeID`, tags the view
  with a fresh generated string per call (`ANCHOR_TAG_PREFIX` + a `callSequence` counter, mirroring
  Coach Mark's collision fix below), calls `MoETooltipHelper.showTooltip(activity, tag, position)`.
- **JS:** `findAndShowToolTipByNativeId(nativeId, label)` / `dismissOverlay()`.
- **Status:** the only nudge type with live scroll/recycling tracking implemented — see
  [Scrollable Items](#scrollable-items). `TooltipManager.setHidden(Boolean)` was added specifically
  to support pausing (not dismissing) while the target row is temporarily off screen.

### Beacon

- **Native:** `MoEBeaconHelper` — a pulsating dot at a corner of the resolved view; tapping it
  reveals
  a tooltip card (`BeaconManager`/`BeaconConfig`/`BeaconPosition`).
- **RN bridge:** `BeaconExploration.findAndShow()` — same `nativeID`-walk-then-retag pattern.
- **JS:** `findAndShowBeaconByNativeId(nativeId, label)` / `dismissBeacon()`.
- **Status:** no live scroll/recycling tracking yet — one-shot resolution only, same limitation the
  native helper's own doc comment states for every XML-tag target. Uses the same shared
  `MoETooltipAnchorRegistry` as Tooltip/Spotlight/Walkthrough for its Compose-anchor path (unused by
  RN, which never reaches that path — see [Scrollable Items](#scrollable-items)).

### Spotlight

- **Native:** `MoESpotlightHelper` — a full-screen dim scrim with a **transparent cutout** around
  the
  anchor (`SpotlightManager`/`SpotlightOverlay`, `SpotlightShape`), built via
  `Modifier.graphicsLayer(compositingStrategy = Offscreen)` + `drawWithContent` +
  `BlendMode.Clear` —
  the offscreen composite step is required for `BlendMode.Clear` to actually erase pixels rather
  than
  blend with whatever's behind it; a common bug when hand-rolling this shape of overlay. Tap
  anywhere
  to dismiss.
- **RN bridge:** `SpotlightExploration.findAndShow()` — same pattern as Beacon.
- **JS:** `findAndShowSpotlightByNativeId(nativeId)` / `dismissSpotlight()`.
- **Status:** no live scroll/recycling tracking yet, same as Beacon.

### CoachMark

- **Native:** `MoECoachMarkHelper` / `CoachMarkController` / `CoachMarkOverlay` — dims the **whole**
  screen with **no cutout**; instead the target is lifted above the scrim as a snapshot (a bitmap
  for
  a View/XML target via `View.draw(Canvas(bitmap))`, a `GraphicsLayer.toImageBitmap()` for a Compose
  target — the overlay is its own `ComposeView`, so it can't redraw a layer owned by the app's own
  composition, hence the snapshot). The lifted snapshot gets a non-destructive tint
  (`ColorFilter.tint(color, BlendMode.SrcAtop)`) and a soft glow, plus a directional dashed pointer
  to
  a floating title/body callout. Supports multi-step sequences (`CoachMarkStep`/`CoachMarkTarget`,
  `CoachMarkCampaign`), advancing on tap.
- **RN bridge:** `CoachmarkExploration.start()` — resolves each `nativeIds[i]`, tags each with a
  **per-campaign-unique prefix** (`campaignSequence` counter → `"moe_rn_coachmark_${n}_${index}"`),
  builds a `CoachMarkCampaign`, calls `MoECoachMarkHelper.start(activity, campaign)`. The unique
  prefix exists specifically to fix a real bug found this session: reusing literal tags like
  `"moe_rn_coachmark_0"` across *separate* campaign calls let a stale tag from an earlier (even
  fully
  dismissed) campaign collide with a new campaign's same-index tag.
- **JS:** `startCoachmarkByNativeIds(nativeIds, titles, bodies)` / `dismissCoachmark()`.
- **Status:** no live scroll/recycling tracking yet (explored for Coach Mark first, then
  intentionally
  redone on Tooltip instead — see [Scrollable Items](#scrollable-items)). The native SDK core
  already
  has cross-screen infrastructure (`CoachMarkStep.screen`, `Modifier.moECoachMarkScreen`,
  `MoECoachMarkHelper.trackActivityScreens`) backing its own `CrossScreenCoachMarkActivity` sample —
  see [Multi Screen Campaigns](#multi-screen-campaigns) for what was built and removed on the RN
  side.

### Walkthrough

- **Native:** `MoEWalkthroughHelper` — a sequence of tooltip bubbles, one per step, with
  "Next"/"← Back"/"Done" navigation, built on the same `TooltipManager` as plain Tooltip. Unlike the
  other four, its Compose-anchor path *already* has live position tracking (`onGloballyPositioned` →
  `MoETooltipAnchorRegistry` → `TooltipManager.updatePosition`) and gone-detection
  (`DisposableEffect.onDispose` → a "gone" observer) — but the gone observer today maps to a
  destructive `dismiss()` that ends the **whole sequence**, not just the current step, which is the
  multi-step version of the exact bug already root-caused for Coach Mark's screen-gate (see
  [Multi Screen Campaigns](#multi-screen-campaigns)).
- **RN bridge:** `WalkthroughExploration.start()` — `nativeID` walk + retag per step, ordered list.
- **JS:** `startWalkthroughByNativeIds(nativeIds, labels)` / `dismissWalkthrough()`.
- **Status:** RN only ever reaches the XML-tag path (no Compose anchor), so it doesn't currently
  benefit from the Compose-side tracking described above at all — same one-shot limitation as
  Beacon/Spotlight/Coach Mark.

## Corner Cases

### Multi Screen Campaigns

A full cross-screen Coach Mark feature (step 1 shown on screen A, step 2 on screen B after
navigating) was built for RN this session, modeled on the native SDK's own
`CrossScreenCoachMarkActivity` sample, then **fully removed** per explicit direction — the summary
below is what was learned before removal, kept for reference since the underlying native
infrastructure (`CoachMarkStep.screen`, `moECoachMarkScreen`, `trackActivityScreens`,
`CoachMarkController.currentScreen`) predates this work and remains in place, unused by RN today.

Two real bugs were found and fixed while it was live:

1. **The "just dismissing" bug.** `CoachMarkOverlayLayer`'s screen-gate rendered **nothing at all**
   (not even the scrim) when a step's bound `screen` didn't match the controller's detected current
   screen — visually indistinguishable from a full dismiss, even though `campaign`/`stepIndex` state
   was fully intact underneath. This is the same class of bug Walkthrough's sequence-ending
   gone-observer has today (see [Walkthrough](#walkthrough)).
2. **A genuine race condition.** The first screen-change notification on navigating to a new screen
   could run before that screen's RN views were laid out, so target resolution silently failed with
   no retry.

Both were fixed at the time (a "waiting for screen" badge for visual feedback + a retry-with-backoff
loop) and verified working end-to-end live on-device, before the whole feature was reverted. The one
fix kept after reverting: the per-campaign anchor-tag-prefix counter (see [CoachMark](#coachmark)),
since it also protects the plain single-screen path and predates/is independent of the cross-screen
work.

### Scrollable Items

Full design, trade-off analysis, and implementation status: `recyclerview-tooltip-handling.md`.

**A wrong assumption corrected first:** RN's `FlatList` is *not* backed by Android's
`androidx.recyclerview.widget.RecyclerView` — it's `VirtualizedList`, a JS-level windowing scheme on
top of a plain native `ScrollView`. There is no view-recycling pool; a row that leaves the window
and
comes back is either the *same* `View` instance re-attached (`removeClippedSubviews` clipping) or a
*brand-new* instance freshly mounted (JS windowing un/remount) — never a stale instance reused for
different row data the way a real `RecyclerView` would.

**Two scenarios:**

- **A. Item moves** (still attached, still on screen, just scrolled to new coordinates) — the nudge
  should track it live; fall back to dismissing rather than showing a stale/detached nudge if that
  isn't possible.
- **B. Item leaves the viewport** (clipped out, or unmounted past the windowing range) — hide the
  nudge without ending the whole flow, and bring it back automatically the moment a view carrying
  the
  same tag attaches again.

**Implemented for Tooltip only** (`MoEngage-Android-SDK/tooltip` 1.0.8+): `ListAnchorTracker`
(`internal/ui/ListAnchorTracker.kt`) — `ViewTreeObserver.OnScrollChangedListener` for live position,
`View.OnAttachStateChangeListener` + `ViewGroup.OnHierarchyChangeListener` for attach/detach
including
the remounted-as-a-new-instance case — wired into `MoETooltipHelper.showTooltip(activity, tag,
position)`'s XML-tag branch, with a new non-destructive `TooltipManager.setHidden(Boolean)` for
scenario B. `NativeTreeWalkExploration` was updated to re-tag and call the tag-based `showTooltip`
overload (rather than the plain View overload) specifically so this tracking engages. Verified
on-device: a small scroll moves the bubble with the row; scrolling the row fully off screen hides
the
bubble (state preserved, not a dismiss) and scrolling back reveals it again, freshly repositioned.
Demo: SampleApp → Tooltip Exploration → "Tooltip in a Scrolling List".

**Not yet implemented for Beacon/Spotlight/Walkthrough/Coach Mark** — the plan for
Beacon/Spotlight/Walkthrough is to extend the same `ListAnchorTracker` into the shared
`MoETooltipAnchorRegistry`'s XML path (their existing `register()`/`unregister()` calls already
forward to each helper's position/gone observers, so no helper-level changes would be needed); Coach
Mark needs its own wiring since it doesn't use that shared registry at all.

**Real trade-offs and one open bug found while implementing this:**

- `ViewTreeObserver.addOnScrollChangedListener` is safely multiplexed (many listeners can coexist,
  including a host app's own) but fires for *any* scroll anywhere in the window, not just ours.
- `ViewGroup.setOnHierarchyChangeListener` (used to catch a windowing remount) is a **single-slot
  setter**, not additive — a second tracked anchor sharing the same parent, or a host app/another
  SDK
  calling this on the same container, silently overwrites the earlier registration with no error, no
  log, and no getter to even detect the collision.
- A real, not-yet-fixed listener leak exists in `ListAnchorTracker.installOn`: it never tears down
  the
  *previous* tracked view's scroll listener before switching to a new one on remount, so every
  remount
  leaks one more listener onto the window's shared `ViewTreeObserver` for the rest of the activity's
  life (harmless today, since it's guarded by an `isAttachedToWindow` check, but a real accumulating
  leak).
- This is very likely *why* the closest competitor (Appcues) doesn't attempt live tracking at all —
  see [Competitor Analysis](#competitor-analysis).

### Modal Widget (Alert Dialog or Bottom Sheet)

RN's `<Modal>` renders into its own separate Android `Dialog`/`Window` (`ReactModalHostView`) — a
sibling of the Activity's `decorView`, not a descendant. A walk rooted only at `decorView` can never
reach anything inside it; the tag is real, it's just unreachable from there.

**Fixed for the primary resolution path:** `NativeIdViewFinder` now searches every open window
(`AppWindows`, via `WindowManagerGlobal` reflection), so the `nativeID` walk resolves Modal/Dialog/
BottomSheet content correctly today — verified via the `ModalPresentationsScreen.tsx` exploration
screen. As far as public competitor documentation shows, this is ahead of what any researched
competitor publishes as solved (see [Competitor Analysis](#competitor-analysis)).

**Not extended everywhere:** an equivalent fix was also built for the DesignMode element-picker FAB
(so the picker itself wouldn't disappear behind an open Modal's window) but was **explicitly
reverted** per direction — the picker can resolve a *known* `nativeID` inside a Modal, but a user
still can't tap-to-pick an element that's currently inside an open Modal via the boom menu itself.

**Rendering is still window-bounded regardless of resolution.**
`MoECoachMarkHelper.startInWindowOf`/
`startInSheet` exist in the native SDK core specifically for mounting an overlay inside a
sheet/dialog's own window rather than the Activity's, but aren't wired to the RN bridge today —
every
RN nudge type currently renders via decor-view/root attachment, which cannot draw chrome outside
whichever window it's attached to (e.g., a tooltip near a BottomSheet's edge can't overflow past
that
sheet's own window bounds). A `NEW_WINDOW`-style overlay (the same family already used for the
accessibilityLabel "way", via a floating `WindowManager` window) doesn't have that limitation and
remains a documented-but-unadopted option — the native SDK's own Spotlight exploration POC
explicitly
recommends this shape over decor-attach, for exactly this reason.

### Nested Views (TextView inside TextView)

A `<Text nativeID="x">` (or `testID`) nested inside another `<Text>` is a **virtual text node** — RN
never creates a real Android `View` for it at all (confirmed zero `nativeId`/`testId` handling
anywhere in RN's text-component internals). The tag is genuinely unreachable, regardless of which
prop carries it or which walk mechanism is used to look for it — there is no native view to find in
the first place. No fix exists at the resolution layer; the only workaround is not nesting the
tagged phrase inside another `<Text>` — wrap it in its own top-level `<Text>` (or a `<View>`)
instead.
Deliberately demonstrated in `NativeIdFailureCasesScreen`'s case 1.

## Competitor Analysis

### Apxor

- Full widget-tree dump; uses a `ValueKey` if the developer set one, otherwise a generated
  structural
  path — unique by construction, so every widget is targetable automatically with **no developer
  tagging required at all**.
- Their public "Automatic View Finder" material remains marketing-level ("helps identify elements...
  using different unique methods") with **no React Native or Fabric/New Architecture specifics
  documented anywhere**. A real `react-native-apxor-sdk` package exists, but whether AVF's "no tags
  needed" claim actually holds for RN, or degrades to a tagging-based approach there, is
  unverifiable
  from public material.
- Scroll tracking, cross-window resolution: not documented.

### Plotline

- Requires wrapping every target in an explicit `PView` component with a developer-chosen name —
  visibility is live-tracked 0–100%, and "present" requires exactly 100% visible, not merely mounted
  (a stricter bar than this exploration's binary attached/detached).
- No public RN-specific technical documentation exists — their nudges product page lists React
  Native
  as supported with a "20-minute integration" marketing claim, but the technical docs portal is
  login-gated. No verifiable claim about their RN anchoring mechanism, New Architecture support, or
  otherwise.
- Scroll tracking (beyond the 0–100% visibility gate), cross-window resolution: not documented.

### Pendo

- **Two different, disagreeing tagging mechanisms are documented, from different SDK eras:** older
  general docs describe a `nativeID` prop matched against a configurable regex (default prefix
  `pendoClickable`), with `testID` as an explicit alternative and a manual
  `sendClickAnalytics(nativeID)` fallback when auto-detection misses; the SDK's *current* GitHub
  docs
  instead describe a **"codeless" solution** that identifies elements by **class/function name**,
  requiring `keep_classnames: true`/`keep_fnames: true` in the Metro minifier config for production
  builds — a real production footgun of that approach, and a materially different mechanism from
  either of this exploration's walks.
- Elements must be explicitly registered as "clickable" via an SDK call — opt-in, not a passive tree
  walk — with **fuzzy multi-signal matching** (text, accessibility info, class name, action,
  index-in-parent/list) that degrades gracefully instead of breaking outright when one signal
  changes
  between app versions. This exploration has no equivalent fallback/fuzzy layer — only exact string
  match per walk.
- **New Architecture (Fabric) support is version-gated** — ships starting SDK v3.7.2, not from day
  one of RN's New Architecture default.
- A real, unrelated-to-anchoring New-Architecture bug is documented: a community report on RN 0.76 +
  New Architecture describes the app failing to start entirely with *"Module exports two methods to
  JavaScript with the same name: 'setup'"* — TurboModule codegen is stricter about overloaded
  `@ReactMethod`s sharing a JS-visible name than the legacy bridge was. Worth a defensive check that
  this SDK's own bridge has no such overloads.
- Scroll/list handling: no public documentation found for the mobile SDK specifically; the only
  related mechanism is web-guide-only (auto-scroll-to-anchor, a "guide persistence" toggle for
  elements that might disappear from view) and isn't confirmed to exist on Android/iOS.

### Also researched: Appcues, WalkMe, Netcore (not in the original outline, kept for completeness)

- **Appcues** — the closest competitor conceptually (Android-native SDK + RN plugin, same
  anchored-tooltip idea) **doesn't solve scrollable-item tracking at all — it forbids the scenario
  **:
  *"Targeting an element the user has to scroll to isn't supported, and users can't scroll while a
  Tooltip is showing."* List rows need a **unique `android:id`** (not tag/contentDescription),
  unique
  among currently-visible views, or the whole flow **hard-errors and terminates** — the same
  hard-fail-on-ambiguity philosophy this exploration's `nativeID-vs-testID-analysis.md` recommends
  adopting. See `recyclerview-tooltip-handling.md` §5–§6 for why this "lock scroll, fail loudly"
  strategy is arguably the more defensible engineering choice, not just a simpler one.
- **WalkMe** — mobile SDK docs cover "Smart Walk-Thru" capture (tap-through or a precision selection
  tool) and swipe-gesture steps, but nothing about scroll tracking, off-screen targets, or
  recycling.
  Exposes match-strictness as a first-class, tunable "element precision" setting — the only one of
  these vendors to do so.
- **Netcore Cloud (Hansel)** — a fixed shared `nativeID` on every repeated row plus a per-instance
  `testID="{unique_id}#{layer_count}"`, registered once at app start via RN's own
  `ReactFindViewUtil.addViewsListener()` rather than walking on demand — meaning a target that isn't
  mounted *yet* still resolves the moment it mounts, with no second explicit call. The only vendor
  with documentation dedicated specifically to list/recycling anchoring — direct third-party
  validation that this corner case is real enough to warrant a named, versioned fix.

## References

**This repo**

- `nativeID-vs-testID-analysis.md` — full nativeID vs. testID comparison and limitations.
- `recyclerview-tooltip-handling.md` — full scrollable-list design, implementation status, and the
  `ViewTreeObserver`/`ViewGroup` trade-off analysis.
- `REACT_NATIVE_TOOLTIP_EXPLORATION.md` — deep Fabric/New-Architecture-specific analysis (RN source
  citations for every claim about `ViewShadowNode.cpp`, `BaseViewManager`, `FabricUIManager`, etc.),
  a from-scratch resolution-mechanism comparison (JS ref/measure, `nativeID` walk, cached-tag
  lookup,
  a proposed React-tag registry wrapper), and its own competitor research (Pendo, Netcore, Apxor,
  Plotline) with a Fabric/New-Architecture lens specifically.
- `sdk/tooltip/android/src/main/java/com/moengage/react/tooltip/` — RN bridge source for all five
  nudge types.
- `SampleApp/src/tooltipExploration/` — every exploration screen referenced above.

**Confluence**

- [\[DRAFT\] React-Native (Android) ToolTip Exploration](https://moengagetrial.atlassian.net/wiki/spaces/MS/pages/6705971265) —
  structure this doc follows.
- [nativeID vs testID — Resolution Mechanism Analysis](https://moengagetrial.atlassian.net/wiki/spaces/MS/pages/6706069533)
- [Element-Anchored Tooltip Placement — Cross-Platform & Competitor Landscape](https://moengagetrial.atlassian.net/wiki/spaces/MS/pages/6700761190)
- [Flutter Tooltip Exploration - Element Selection + Placement](https://moengagetrial.atlassian.net/wiki/spaces/MS/pages/6547734545)
- [Tooltip, Beacon and Walkthrough Exploration (native Android)](https://moengagetrial.atlassian.net/wiki/spaces/MS/pages/6336479252)
- [Spotlight Exploration - Android POC](https://moengagetrial.atlassian.net/wiki/spaces/MS/pages/6377635847)

**Native MoEngage-Android-SDK**

- `tooltip/src/main/java/com/moengage/tooltip/` — `MoETooltipHelper`, `MoEBeaconHelper`,
  `MoESpotlightHelper`, `MoECoachMarkHelper`, `MoEWalkthroughHelper`, `MoETooltipTag.kt`
  (`MoETooltipAnchorRegistry`).
- `tooltip/src/main/java/com/moengage/tooltip/internal/ui/` — `TooltipManager`, `SpotlightManager`,
  `BeaconManager`, `CoachMarkController`, `CoachMarkOverlay`, `ListAnchorTracker`.
- [
  `toolTipExploration` branch](https://github.com/moengage/MoEngage-Android-SDK/tree/toolTipExploration),
  [`poc/spotlight` branch](https://github.com/moengage/MoEngage-Android-SDK/tree/poc/spotlight).

**Competitor sources**

-
Appcues — [Mobile Tooltips](https://docs.appcues.com/en_US/mobile-building-experiences/styling-mobile-tooltips), [Build with Tooltips in a Mobile Flow](https://docs.appcues.com/en_US/mobile-building-experiences/build-with-tooltips-in-a-mobile-flow), [Android SDK AnchoredTooltips.md](https://github.com/appcues/appcues-android-sdk/blob/main/docs/AnchoredTooltips.md)
-
Pendo — [Overview of mobile tagging technicalities](https://support.pendo.io/hc/en-us/articles/360057783991-Overview-of-mobile-tagging-technicalities), [RN Android SDK docs](https://github.com/pendo-io/pendo-mobile-sdk/blob/master/android/pnddocs/rn-android.md), [Add a tooltip guide to your mobile app](https://support.pendo.io/hc/en-us/articles/360038736831-Add-a-tooltip-guide-to-your-mobile-app), [New Architecture crash report](https://support.pendo.io/hc/en-us/community/posts/33825167589531-React-native-76-new-architecture-error)
-
WalkMe — [Mobile: Smart Walk-Thrus](https://support.walkme.com/knowledge-base/mobile-smart-walk-thrus/)
- Netcore
  Cloud — [Setting up Hansel index for dynamic views (RN)](https://cedocs.netcore.ai/docs/reactnative-setting-up-hansel-index-for-dynamic-views)
-
Apxor — [React Native SDK guide](https://guides.apxor.com/getting-started-with-apxor/sdk/react-native), [Automatic View Finder](https://apxor.com/blog/automatic-view-finder-in-app)
- Plotline — [Nudges product page](https://www.plotline.so/products/nudges)

**React Native / Android source referenced** (version 0.81.1, `node_modules/react-native`)

- `ReactCommon/react/renderer/components/view/ViewShadowNode.cpp`,
  `ReactAndroid/.../uimanager/BaseViewManager.java`, `.../uimanager/util/ReactFindViewUtil.kt`,
  `.../fabric/FabricUIManager.java`, `.../fabric/mounting/SurfaceMountingManager.java`,
  `.../views/view/ReactViewGroup.kt`, `.../views/text/ReactVirtualTextViewManager.kt`,
  `.../views/modal/ReactModalHostView.kt`, `Libraries/Lists/FlatList.js`.
