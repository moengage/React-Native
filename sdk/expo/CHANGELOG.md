# Release Date

## Release Version

- Android
  - [major] `android-bom` version updated from `2.3.0` to `4.3.0`
  - [minor] `com.google.firebase:firebase-messaging` version updated from `24.1.0` to `25.0.1`
  - [major] compile and target sdk updated to `36`

# 11-06-2026

## 1.2.0

- iOS
  - Internal improvements for testing.
  - Automated expo new cocoapods source integration
- Android
  - Downgrading Compile Java Version to 17

# 15-04-2026

## 1.1.1

- Android
    - Migrating the common gradle configuration to the gradle config

# 09-02-2026

## 1.1.0

- License Update
- Fixing the failing cases due to types/node version update
- Android
  - Compatibility changes for "Bundling `MoEFireBaseMessagingService` in Plugin's manifest to reduce integration steps for developers using FCM Push." in core plugin
- iOS
  - Added no-code SDK file based initialization

# 25-08-2025

## 1.0.1

- Remove `postinstall` hook to support project without typescript and [workaround yarn bug](https://github.com/yarnpkg/yarn/issues/7694).

# 29-07-2025

## 1.0.0

- Support for Expo Plugin