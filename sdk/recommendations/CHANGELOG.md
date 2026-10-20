# Release Date

## Release Version

- [major] Added support for fetching recommendations
- Android
  - [minor] updating `android-bom` to `4.6.0`
  - [patch] Updating `gradle-config-plugin` to `2.0.2`
- iOS
  - [minor] Adding support for  `MoEngage-iOS-SDK` to `11.04.0`
  - [minor] Adding support for  `MoEngageRecommendations` to `1.0.0`
  - [minor] Declared the iOS plugin pod as a static framework. The MoEngage iOS SDK now links its app-only modules statically, and CocoaPods rejects a target using use_frameworks! whose transitive dependencies include statically linked binaries — without this, pod install fails for integrating apps.
