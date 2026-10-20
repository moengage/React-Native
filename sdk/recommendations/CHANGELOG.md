# 20-10-2026

## 1.0.0

- Added support for fetching recommendations
- Android
  - updating `android-bom` to `4.6.0`
  - Updating `gradle-config-plugin` to `2.0.2`
- iOS
  - Adding support for  `MoEngage-iOS-SDK` to `11.04.0`
  - Adding support for  `MoEngageRecommendations` to `1.0.0`
  - Declared the iOS plugin pod as a static framework. The MoEngage iOS SDK now links its app-only modules statically, and CocoaPods rejects a target using use_frameworks! whose transitive dependencies include statically linked binaries — without this, pod install fails for integrating apps.
