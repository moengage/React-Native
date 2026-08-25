# Release Date

## Release Version

- iOS
  - [patch] Declared the iOS plugin pod as a static framework. The MoEngage iOS SDK now links its app-only modules statically, and CocoaPods rejects a target using `use_frameworks!` whose transitive dependencies include statically linked binaries — without this, `pod install` fails for integrating apps.

# 12-08-2026

## 1.1.1

- Android
  - Handled a case where updating from a version below 14.09.00 failed to update the storage schema

# 02-07-2026

## 1.1.0

- Android
  - updating `android-bom` to `2.3.0`
- iOS
  - updating `MoEngagePluginPersonalize` to `1.1.0`

# 11-06-2026 

## 1.0.2

- Android
  - Downgrading Compile Java Version to 17

- iOS
  - updating `MoEngagePluginPersonalize` to `1.1.0`
# 19-05-2026

## 1.0.1

- Removing the snapshot build from android module.

# 08-05-2026

## 1.0.0

- Added personalization feature module and support.
