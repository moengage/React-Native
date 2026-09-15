# SpmSampleApp

Minimal sample app that integrates the MoEngage React Native SDK on iOS
through React Native's **experimental Swift Package Manager support**
([react-native 0.87+](https://reactnative.dev/blog/2026/08/11/react-native-0.87#experimental-swift-package-manager-support-for-ios)).
No CocoaPods.

The five `react-native-moengage*` packages are consumed straight from
[`../sdk`](../sdk) via `file:` links, so this app always builds the
**working-tree SDK code** — their shipped `Package.swift` manifests are picked
up by React Native's SPM autolinker as self-managed packages, and the MoEngage
native SDKs resolve from their SPM repos (`moengage/apple-sdk`,
`moengage/iOS-PluginBase`, `moengage/apple-plugin-*`).

The app is deliberately free of navigation and other community native
libraries: every native package in the dependency graph ships its own
`Package.swift`, so **no `spm scaffold` step and no manifest patching is
needed**. (For MoEngage alongside community libraries under SPM — e.g.
react-navigation — see the notes at the bottom.)

## Building

```bash
npm install
npm run spm            # = cd ios && npx react-native spm — sync the SPM graph
```

`npm run spm` is the SwiftPM counterpart of `pod install`: it runs codegen,
regenerates the autolinking graph, and downloads/links React Native's prebuilt
XCFrameworks (cached per RN version under `~/Library/Caches/ReactNative`, so
only the first run is slow).

**It is required after a fresh clone, after any `node_modules` reset, and after
any dependency change** — and unlike the CocoaPods flow, nothing runs it for
you: `@react-native-community/cli`'s run command only knows how to invoke
`pod install` (`automaticPodsInstallation`), with no SwiftPM equivalent. That is
why `npm run ios` below chains it explicitly. It is deliberately *not* an npm
`postinstall` hook: it is macOS/Xcode-only and downloads GBs of artifacts, so a
failure there would break `npm install` itself on other platforms and in
dependency-only CI jobs.

Then open `ios/SpmSampleApp.xcodeproj` in Xcode and run the `SpmSampleApp`
scheme, or use `npm run ios` (which syncs the SPM graph first), or build
directly with:

```bash
xcodebuild -project SpmSampleApp.xcodeproj -scheme SpmSampleApp \
  -destination 'generic/platform=iOS Simulator' ARCHS=arm64 build
```

To run the JS app, set your workspace APP ID in `src/key.js` and start Metro
with `npm start`.

## Notes

- `ios/Podfile` is a **decoy** — CocoaPods is not used, but
  `@react-native-community/cli` only detects an iOS project by finding a
  Podfile. Never run `pod install` here.
- Simulator builds are arm64-only: the transitive
  `MoEngageKMMConditionEvaluator.xcframework` ships no x86_64 slice.
- The SPM injection into `SpmSampleApp.xcodeproj` (package references, build
  settings, the "Sync SPM Autolinking" build phase, and
  `.spm-injected.json`) is committed, as React Native's tooling intends —
  `npx react-native spm` only re-syncs the generated packages under
  `ios/build/` (gitignored).
- Community libraries: `react-native-screens` >= 4.27.0 scaffolds under SPM
  (needs one extra header search path); most other libs work via
  `npx react-native spm scaffold`. This app intentionally avoids them to keep
  the MoEngage SPM test surface isolated.
