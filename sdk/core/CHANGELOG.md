# 25-11-2024

## 11.1.1
- Fixing the lint issue for `getMoEInAppRules` with `noImplicitAny` as false in tsconfig file
- Android
    - `moe-android-sdk` version updated to `13.05.01`
    - `inapp` version updated to `8.7.0`
- iOS
    - Fixed the compiler issue in Apple TV.
    
# 30-09-2024

## 11.1.0
- Added support for Multiple SelfHandled InApps.
- iOS
    - Added support for Provisional Push.
    - MoEngage-iOS-SDK version updated to `9.20.0`.

# 07-08-2024

## 11.0.0
- iOS
  - BugFix: Resolved the issue of tracking User Attribute TRUE/FALSE as 0/1.
  - Pinned plugin dependency version
  - MoEngage-iOS-SDK version updated to `9.18.1`.

# 31-07-2024

## 10.3.0
- Fixing the typescript configuration warnings.
- Android
  - `moe-android-sdk` version updated to `13.04.00`
  - `inapp` version updated to `8.5.0`
  - Added support for AGP `8.4.0` and above
  - Kotlin version updated to `1.9.23`
  - Compile SDK version updated to `34`
- iOS
    - MoEngage-iOS-SDK version updated to `~>9.18.0`.

# 03-07-2024

## 10.2.0

- Support for JSONArray and JSONObject in Event & User Attributes.
- Support for forcing SDK to a specific MoEngage Environment.

- Android
  - `moe-android-sdk` version updated to `13.02.00`
  - `inapp` version updated to `8.3.1`

# 16-05-2024

## 10.1.0
- Support for Data Center 6
- Android
  - `moe-android-sdk` version updated to `13.01.00`
  - `inapp` version updated to `8.3.0`

# 14-05-2024

## 10.0.1
- BugFix
    - Adding backward compatibility support for react-native version with react-native-moengage `10.x.x`
    
# 07-05-2024

## 10.0.0
- Added support for Turbo Architecture
- Breaking APIs in Javascript

| Then         | Now               |
|:------------:|:-----------------:|
| optOutDataTracking(false) | enableDataTracking() |
| optOutDataTracking(true) | disableDataTracking() |


- iOS
    - Removed support for SDK initialization from Info.plist.
    - Removed APIs

    | Removed APIs                |
    |:---------------------------:|
    | - (void)initializeDefaultInstance:(NSDictionary*)launchOptions; |
    | - (void)initializeDefaultInstanceWithState:(MoEngageSDKState)sdkState andLaunchOptions:(NSDictionary*)launchOptions;            |
    | - (void)initializeDefaultInstance:(BOOL)isSdkEnabled andLaunchOptions:(NSDictionary*)launchOptions;  |
    | - (void)initializeDefaultSDKConfig:(MoEngageSDKConfig*)sdkConfig withSDKState:(BOOL)isSdkEnabled andLaunchOptions:(NSDictionary*)launchOptions    |
- Android
    - Making `moe-android-sdk` and `inapp` dependecies as implementation

# 08-04-2024

## 9.1.0
- Added Intrusive InApp support for TV.
- iOS
    - MoEngage-iOS-SDK version updated to `~>9.17.0`.

# 18-03-2024

## 9.0.0
- Added Nudge Support
- Bugfix
  - Exception thrown `MoEInAppSelfHandledCampaign is an invalid object` while logging
- iOS
    - MoEngage-iOS-SDK version updated to `~>9.16.1`.
- Android
  - Support for MoEngage Core 13.00.00 and above
  - Added support for AGP `8.2.2` and above

# 12-02-2024

## 8.7.1
- Android
    - Support for Java 17

# 29-01-2024

## 8.7.0
- TV OS support.
- iOS
    - MoEngage-iOS-SDK version updated to `~>9.15.0`.
    
# 29-11-2023

## 8.6.0
- Support for tracking an array of numbers and strings in user attributes
- Android
    - Added API to delete User details from MoEngage Server
    - Add support for AGP `8.0.2` and above
    - Upgrade Kotlin Version to 1.7.10
- iOS
    - MoEngage-iOS-SDK version updated to `~>9.13.0`.

# 30-10-2023

## 8.5.4
- Android
  - BugFix
    - MoEngage SDK throwing incompatible version error on app open

# 31-08-2023

## 8.5.3
- iOS
    - MoEngage-iOS-SDK version updated to `~>9.11.0`.
    
# 17-08-2023

## 8.5.2
- Android
  - BugFix
    - MoEngageLogLevel throwing undefined property
    - Self Handled InApp delivery controls not working.

# 18-07-2023

## 8.5.1
- Adding Strict TypeCheck For TypeScript files
- Support for configuring the React-Native Plugin console logs

- iOS
    - MoEngage-iOS-SDK version updated to `~>9.10.0`.
# 25-05-2023

## 8.5.0
- Android
  - Support for handling Foreground Push Notification Click
  - Target & Compile SDK version updated to 33
  - BugFix
    - Self handled InApps Callback fix in Event Triggered Campaign
- iOS
    - MoEngage-iOS-SDK version updated to `~>9.8.0`.

# 16-02-2023

## 8.4.0
- iOS
    - MoEngage-iOS-SDK version updated to `~>9.4.0`.
  
# 09-02-2023

## 8.3.0
- Android
  - Android 13 push notification Opt-in with rationale via In-Apps
  - Device Id enable / disable support
  - BugFix
    - Adding PushClick Callback Redirection Support if Application is in Foreground/Background State

# 16-01-2023

## 8.2.0
- iOS
    - MoEngage-iOS-SDK version updated to `~>9.2.0`.
    - Updated API

      | Then                                                                                                                                     | Now                                                                                                                                                        |
      |:----------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------:|
      | - (void)initializeDefaultSDKConfig:(MOSDKConfig*)sdkConfig andLaunchOptions:(NSDictionary*)launchOptions;   | -(void)initializeDefaultSDKConfig:(MoEngageSDKConfig*)sdkConfig andLaunchOptions:(NSDictionary*)launchOptions;                                      |
      | - (void)initializeDefaultSDKConfigWithState:(MOSDKConfig*)sdkConfig withSDKState:(MoEngageSDKState)sdkState andLaunchOptions:(NSDictionary*)launchOptions; | - (void)initializeDefaultSDKConfigWithState:(MoEngageSDKConfig*)sdkConfig withSDKState:(MoEngageSDKState)sdkState andLaunchOptions:(NSDictionary*)launchOptions; |
      
# 21-11-2022

## 8.1.2
- iOS
    - BugFix
      - Updated the import statement to make the plugin compatible with C++ codebase.
      
# 09-11-2022

## 8.1.1
- iOS
    - BugFix
      - Added missing `MoEngageRichNotification` dependency to the plugin.
    
# 28-10-2022

## 8.1.0
- Android
  - AGP version updated to `7.3.1`
  - Gradle version updated to `7.4`
  - Target SDK version - 31
  - Compile SDK Version - 31
  - Support for Android SDK version `12.4.00`
  - InApp `6.4.0`

- iOS
    - Deprecated API

| Then                                                                                                                                     | Now                                                                                                                                                        |
|:----------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------:|
| - (void)initializeDefaultInstance:(BOOL)isSdkEnabled andLaunchOptions:(NSDictionary*)launchOptions                                       | - (void)initializeDefaultInstanceWithState:(MoEngageSDKState)sdkState andLaunchOptions:(NSDictionary*)launchOptions;                                       |
| - (void)initializeDefaultSDKConfig:(MOSDKConfig*)sdkConfig withSDKState:(BOOL)isSdkEnabled andLaunchOptions:(NSDictionary*)launchOptions | - (void)initializeDefaultSDKConfigWithState:(MOSDKConfig*)sdkConfig withSDKState:(MoEngageSDKState)sdkState andLaunchOptions:(NSDictionary*)launchOptions; |

## 27-10-2022

### 8.0.0
- Support for Android SDK version `12.3.02` and above.
- Support for iOS SDK version `8.3.1` and above.
- TS Lint warnings resolved.
- Breaking Changes
  - InApp Model `MoEInAppCampaign` broken down from a single object to multiple objects
    - `MoEInAppData`
    - `MoEClickData`
    - `MoESelfHandledCampaignData`
  - Push Models
    - `MoEPushCampaign` --> `MoEPushPayload`
  - Breaking APIs in Javascript

| Then         | Now               |
|:------------:|:-----------------:|
| initialize() | initialize(appId) |

- Removed APIs

| Removed APIs                |
|:---------------------------:|
| selfHandledPrimaryClicked() |
| enableSDKLogs()             |
| optOutInAppNotification()   |
| optOutPushNotification()    |

- Android 
  - Build Configuration Updates
    - Minimum SDK version - 21
    - Target SDK version - 30
    - Compile SDK Version - 30
  - Mi SDK update to Version 5.x.x, refer to the [Configuring Xiaomi Push](https://developers.moengage.com/hc/en-us/articles/4403466194708) and update the integration.
  - Deprecated APIs

| Then                                                           | Now                                                                           |
|:--------------------------------------------------------------:|:-----------------------------------------------------------------------------:|
| MoEInitializer.initialize(Context, MoEngage.Builder)           | MoEInitializer.initializeDefaultInstance(Context, MoEngage.Builder)           |
| MoEInitializer.initialize(Context, MoEngage.Builder, SdkState) | MoEInitializer.initializeDefaultInstance(Context, MoEngage.Builder, SdkState) |

- iOS
    - `MOReactInitializer` renamed to `MoEngageInitializer`
    - Deprecated APIs

| Then                                                                                                                                  | Now                                                                                                                                       |
|:-------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------:|
| - (void)intializeSDKWithLaunchOptions:(NSDictionary*)launchOptions;                                                                   | - (void)initializeDefaultInstance:(NSDictionary*)launchOptions;                                                                           |
| - (void)intializeSDKWithState:(BOOL)isSdkEnabled andLaunchOptions:(NSDictionary*)launchOptions;                                       | - (void)initializeDefaultInstance:(BOOL)isSdkEnabled andLaunchOptions:(NSDictionary*)launchOptions;                                       |
| - (void)intializeSDKWithConfig:(MOSDKConfig*)sdkConfig andLaunchOptions:(NSDictionary*)launchOptions;                                 | - (void)initializeDefaultSDKConfig:(MOSDKConfig*)sdkConfig andLaunchOptions:(NSDictionary*)launchOptions;                                 |
| - (void)intializeSDKWithConfig:(MOSDKConfig*)sdkConfig withSDKState:(BOOL)isSdkEnabled andLaunchOptions:(NSDictionary*)launchOptions; | - (void)initializeDefaultSDKConfig:(MOSDKConfig*)sdkConfig withSDKState:(BOOL)isSdkEnabled andLaunchOptions:(NSDictionary*)launchOptions; |


### 7.4.1
Release Date: 15th July 2022
- Device identifier tracking update as per Google's User data policy. Advertising Id is only tracked after user consent.

### 7.4.0
Release Date: 12th May 2022
- Bugfix iOS: Fixed the PushClick callback issue in terminated state, that was appearing when the react-native version is above 0.65.
      
### 7.3.0
Release Date: 16th September 2021
- HTML InApp Support Added.
- Bugfix: 
  - Handled `trackEvent()` with null properties.
- iOS
    - Native SDK version updated to `~>7.1.0`.
    - Base plugin version dependency updated to `~>2.1.0`.
- Android
    - Native SDK updated to support version `11.4.00` and above.
    - Bugfix:
      - `enableSDKLogs()` not working on Android.
      
### 7.2.0
Release Date: 11th May 2021
- Android Multi-Instance Phase 1 update.

### 7.1.0
Release Date: 17th March 2021
- Added support to pass Array(String/Number) as event attributes in addAttribute method of MoEProperties.

### 7.0.0
Release Date: 25th February 2021
- iOS 
    - Plugin now supports iOS 10.0 and above
    - Native Dependencies updated to support MoEngage-iOS-SDK `7.*` and above
    - Base plugin version dependency updated to `~> 2.0.2`.
- Android 
    - Native SDK updated to support `11.0.04` and above
    - Base Plugin updated to `2.0.00`
    - API to pass PushKit Token JS
- Added APIs to enable and disable MoEngage SDK.
- Added API to register a callback for push token generated event.

### 6.1.7
Release Date: 15th February 2021
- Android artifacts use manven central instead of Jcenter.
  - Android Native SDK version `10.6.01`
  - Android Plugin Base `1.2.01`

### 6.1.6
Release Date: 21st January 2021
- BugFix iOS: Token registered event skipped as its currently not supported in React Native.

### 6.1.5
Release Date: 18th January 2021
- iOS Base Plugin dependency updated to support version `1.2` and above.

### 6.1.4
Release Date: 7th December 2020
- Support for extending Native Android Callbacks if required.
- Native Android SDK version required is `10.5.00` or above.
- iOS Base Plugin Updated to version `1.1.1` to ensure SDK sets the UNUserNotification Center delegate only in cases where its `nil`.

### 6.1.3
Release Date: 25th November 2020
- Android Base plugin dependency type updated to ensure compatability across gradle versions.

### 6.1.2
Release Date: 23rd November 2020
- Android Base Plugin Updated to enable Custom Callbacks.

### 6.1.1
Release Date: 22nd October 2020
- Bugfix
  - Events not being marked as non-interactive on Android
  
### 6.1.0
Release Date: 23rd September, 2020
- Support for Push Templates added 

 ### 6.0.0
 Release Date: 7th August 2020
 -  Breaking change in Initialization of iOS platform, refer to the [developer docs](https://docs.moengage.com/docs/sdk-initialization-1#ios) to know more about the changes. 
  - Support for Self-Handled In-App
  - Support for In-App V3
  - Event listeners now return a model Object instead of JSON
  - `setUserBirthday()` only accepts ISO-8601 String 
  - Breaking changes in APIs
  - Android SDK updated to `10.2.02`
  - iOS SDK dependency changed to support versions greater than `6.0.0`.

|                            Then                           |                            Now                            |
|:---------------------------------------------------------:|:---------------------------------------------------------:|
|              ReactMoE.isExistingUser(boolean)             |            ReactMoE.setAppStatus(MoEAppStatus)            |
|          ReactMoE.trackEvent(string, JSONObject)          |         ReactMoE.trackEvent(string, MoEProperties         |
|          ReactMoE.setUserLocation(number, number)         |          ReactMoE.setUserLocation(MoEGeoLocation)         |
| ReactMoE.setUserAttributeLocation(string, number, number) | ReactMoE.setUserAttributeLocation(string, MoEGeoLocation) |
|                ReactMoE.setLogLevel(number)               |                  ReactMoE.enableSDKLogs()                 |

  - Android Specific Changes
    - APIs to pass push token and payload has changed

|                 Then                 |                   Now                   |
|:------------------------------------:|:---------------------------------------:|
|    ReactMoE.passPushToken(string)    |    ReactMoE.passFcmPushToken(string)    |
| ReactMoE.passPushPayload(JSONObject) | ReactMoE.passFcmPushPayload(JSONObject) |
 
 ### 5.0.0 
 Release Date: 18th Feb 2020
  - New Event Listeners added for both iOS and Android platforms i.e, `pushClicked`, `inAppCampaignShown` and `inAppCampaignShown`.
  - Earlier iOS Push and InApp Events deprecated to have it common for both Android and iOS (`notificationClicked`,`inAppShown` and `inAppClicked`)
  - APIs to pass push token and payload from React-Native Component/Javascript (Android Only API)
  - Fixing datatype conversion for user attributes long getting converted to double.

### 4.1.0
 Release Date: 23rd Dec 2019
 - Android SDK version updated to 9.8.01
 - integration_type and integration_version added for both Android and iOS



