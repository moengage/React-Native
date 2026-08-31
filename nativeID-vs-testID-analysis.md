# nativeID vs testID — Resolution Mechanism Analysis

> Android-focused. Every limitation below was built and verified live on-device in this exploration
> branch (`SampleApp` + `MoEngage-Android-SDK`) unless marked **[theoretical]**. Companion to the "
> Element-Anchored Tooltip Placement — Cross-Platform & Competitor Landscape" doc. iOS semantics
> differ (testID → `accessibilityIdentifier`, a different underlying mechanism) and are out of scope
> here.

## 1. What each prop actually is, at the native layer

Both are React Native props consumed by every `BaseViewManager` — but they write to **two entirely
different storage slots** on the underlying Android `View`, which is the root of almost every
difference below.

|                                     | `nativeID`                                                                                                                                                                                                                               | `testID`                                                                                                        |
|-------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| **Storage slot**                    | A dedicated, RN-reserved tag key: `view.getTag(com.facebook.react.R.id.view_tag_native_id)`                                                                                                                                              | The plain, general-purpose slot: `view.getTag()` / `view.tag` (no key)                                          |
| **Set by**                          | `BaseViewManager.setNativeId()`                                                                                                                                                                                                          | `BaseViewManager.setTestId()` → `view.setTag(testId)`                                                           |
| **Read from native (no RN import)** | Requires reflection — `Class.forName("com.facebook.react.R$id").getField("view_tag_native_id")` — because there is no compile-time way to reference an RN resource ID from a module that must stay usable in plain-Android host apps too | Trivial — `view.tag` is a public Android API, no reflection, no RN dependency at all                            |
| **Forces Fabric `formsView=true`?** | Yes                                                                                                                                                                                                                                      | Yes (same trait list as `nativeId`/`accessible` in `ViewShadowNode.cpp`)                                        |
| **Intended purpose**                | Native-side view identification / interop                                                                                                                                                                                                | End-to-end test automation (Detox, Appium, Maestro) — **not** originally designed for runtime resolution at all |

## 2. Limitations shared by both — structural, not prop-specific

These come from Fabric's view tree and the DFS walk itself, not from which prop you pick. Fixing one
doesn't fix the other for these:

- **Duplicate value → silent ambiguity.** The walk is a pre-order DFS returning the first match; a
  second element with the same value is simply unreachable, with no error, no warning.
  `NativeIdFailureCasesScreen` case 4 demonstrates this deliberately for `nativeID` — the identical
  risk exists for `testID` since it's the same walk shape.
- **Virtual `<Text>` nodes never resolve.** A `<Text nativeID="...">` (or `testID`) nested inside
  another `<Text>` is a virtual text node — RN never creates a real Android View for it, so the tag
  is genuinely unreachable no matter which prop carries it. Verified in case 1.
- **A non-forwarding wrapper drops the prop before it reaches native.** If a custom component
  doesn't spread `...rest` (or explicitly forwards `nativeID`/`testID`) onto its underlying View,
  the value never crosses the JS→native boundary at all — this is a pure-JS failure mode, identical
  for both props. Verified in case 3.
- **`FlatList`/`RecyclerView` clipping detaches the View.** Android's default
  `removeClippedSubviews=true` physically removes a scrolled-off row's View from the tree — the walk
  stops finding it even though React still considers it mounted. Verified in
  `RecyclerViewNativeTreeWalkScreen`.
- **Cross-window content (Modal/Dialog/BottomSheet) is unreachable by a naive walk.** `<Modal>`
  renders into a separate Android `Dialog` window, not a descendant of the Activity's decorView — a
  walk rooted only there never visits it, regardless of which prop is set. This is a limitation of a
  naive single-window resolver, not of the props themselves: this SDK's `NativeIdViewFinder` now
  searches every open window via `AppWindows` (`WindowManagerGlobal` reflection) specifically to
  close this gap for `nativeID`. The equivalent fix would be needed for a `testID`-based walk too —
  nothing about `testID` makes it exempt.
- **`formsView=true` has a (minor) perf cost.** Every tagged element is exempted from Fabric's
  view-flattening optimization, whether tagged via `nativeID` or `testID` — negligible for a handful
  of anchors, worth knowing about if a campaign tags dozens of elements per screen.
- **No built-in duplicate-detection warning.** Neither prop's walk logs or throws on finding a
  second match. Appcues, by contrast, hard-fails the whole flow on a non-unique selector (see the
  competitor doc linked above) — a safer default worth adopting for either prop.

## 3. Limitations specific to `nativeID`

- **Reflection dependency.** Reading it from a module with no RN compile dependency requires
  `Class.forName("com.facebook.react.R$id").getField("view_tag_native_id")` — a private/internal RN
  resource, not a published API. It's been stable across the RN versions this branch targets, but
  nothing contractually guarantees the field name or its continued existence in a future RN release.
  A host app without RN on the classpath at all gets a cheap, safe `null` after the first failed
  lookup (see `ReactViewIdentifiers`/`NativeIdViewFinder`), so the failure mode is graceful — but it
  is still reflection into an implementation detail.
- **Invisible to standard e2e tooling.** Detox/Appium/Maestro match on `testID` (Android) /
  `accessibilityIdentifier` (iOS) by convention — none of them look at `nativeID`. An app that
  already tags its UI for QA automation gets zero reuse for tooltip/coach-mark targeting from those
  existing tags; every element needs a *second*, separate `nativeID` pass.

## 4. Limitations specific to `testID`

These are the ones that matter most if a resolution mechanism is built on `testID` instead of
`nativeID` — and they're more likely to bite in a real app than `nativeID`'s reflection concern,
because `testID` is a widely-adopted convention, not a niche one.

- **Shares the one general-purpose `View.tag` slot with everything else that might use it — the
  headline risk.** Unlike `nativeID`'s dedicated, RN-reserved key, plain `view.tag` is fair game
  for:
    - Other native Android libraries/SDKs doing their own bookkeeping via `View.setTag()` (a very
      common pattern — e.g. `RecyclerView` view-holder caching idioms, some analytics/attribution
      SDKs).
    - The host app's own native code.
    - This very SDK's own re-tagging trick: `CoachmarkExploration.start()` and friends literally *
      *overwrite** `view.tag` with an internal anchor-tag string (`match.tag = anchorTag`) so
      `MoECoachMarkHelper`'s `View.findViewWithTag()` lookup can find it. If a screen sets a real
      `testID` for its own e2e suite, this overwrite **silently destroys that value** for as long as
      the campaign holds the tag. This exact risk is called out in `CoachmarkExploration.kt`'s own
      doc comment: reusing the plain tag slot is "harmless here since none of this exploration
      module's screens set `testID`, but a real integration should pick a dedicated view id slot
      instead of the default tag if `testID` usage nearby is a possibility."
- **Higher real-world collision probability than `nativeID`'s reflection risk.** `testID` is the
  standard, widely-taught RN e2e-testing convention — most production apps with any test automation
  already use it pervasively. `nativeID` is comparatively rare, used mostly for niche native-interop
  cases. A resolution mechanism riding on `testID` is riding on the one tag value an app is
  statistically most likely to *already have set for an unrelated purpose*, and most likely to have
  automated tests that assert against it.
- **Directly conflicts with the app's own QA infrastructure while a campaign is active.** If a live
  tooltip/coach-mark campaign re-tags a View's plain `tag` for resolution purposes, any Detox/Appium
  test that matches on that element's `testID` during that window would fail to find it — a
  production SDK feature interfering with the app's own test suite, not just a targeting edge case.

## 5. Side-by-side summary

| Dimension                                                                    | `nativeID`               | `testID`                                       |
|------------------------------------------------------------------------------|--------------------------|------------------------------------------------|
| Dedicated slot (no collision with other native code)                         | ✅ Yes                    | ❌ No — shares plain `View.tag`                 |
| Reflection required to read from a non-RN-dependent module                   | ❌ Yes                    | ✅ No — public API                              |
| Reused by standard e2e frameworks                                            | ❌ No (invisible to them) | ⚠️ Yes — and that's exactly the collision risk |
| Duplicate-value ambiguity                                                    | ⚠️ Same risk             | ⚠️ Same risk                                   |
| Virtual `<Text>` / non-forwarding wrapper / FlatList clipping / cross-window | ⚠️ Same risk             | ⚠️ Same risk                                   |
| Forces `formsView=true` (flattening exemption)                               | ⚠️ Same cost             | ⚠️ Same cost                                   |

## 6. Recommendation

- **`nativeID` is the safer default for a runtime resolution mechanism** specifically because of its
  dedicated tag slot — it cannot silently collide with other native code's use of `View.tag`, and it
  cannot clash with the app's own e2e test tags. Its reflection dependency is a real but
  low-probability, gracefully-degrading risk; `testID`'s collision risk is a real and comparatively
  likely one in any app with existing test automation.
- **Fall back to `testID` only when `nativeID` is genuinely unavailable** — and report which one
  actually resolved rather than silently merging them. This exploration branch's own DesignMode
  picker learned this the hard way: it originally used a single
  `ReactViewIdentifiers.readPreferredId()` helper that merged both into one field, then later split
  it into two explicit fields (`nativeIdTag`/`testIdTag`, logged as two separate lines) specifically
  so it's visible which prop actually matched. A resolution walk should keep the same
  nativeID-first-then-testID-fallback order, but surface which one it was rather than hiding the
  fallback.
- **Neither prop solves the shared structural limitations** (duplicates, virtual text,
  non-forwarding wrappers, list clipping, cross-window). Those need independent fixes — cross-window
  is already addressed via `AppWindows`; duplicate-detection (a debug-time warning, following
  Appcues'/the Flutter doc's proposed pattern) is the next gap worth closing for either prop.
