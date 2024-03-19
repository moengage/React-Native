![Logo](/.github/logo.png)

## MoEngage React-Native Plugin

This repository contains the React-Native plugins for the [MoEngage](https://www.moengage.com) platform.

### Repository Description

| Folder    | Description                                                                       |
|:---------:|:---------------------------------------------------------------------------------:|
| core      | Contains the implementation for the SDK implementation for Core MoEngage Platform |
| inbox     | Contains the implementation for the SDK implementation for Inbox Feature          |
| cards     | Contains the implementation for the SDK implementation for Cards Feature          |
| geofence  | Contains the implementation for the SDK implementation for Geofence Feature       |
| SampleApp | Sample Integration for reference.                                                 |


## How to use the sample application?

- Update your MoEngage app-id in the `SampleApp --> src --> key.js` file. Replace `YOUR_APP_ID` with the App Id on the MoEngage Dashboard.

### Javascript/TypeScript

```js
export const MOENGAGE_APP_ID = "YOUR_APP_ID"
```

### Android

- Add the MoEngage app-id in the `local.properties` file of `SampleApp --> android`. Add the below key and value and replace `YOUR_APP_ID`` with the App Id on the MoEngage Dashboard.

```
moengageAppId=YOUR_APP_ID
```

- Replace the dummy `google-services.json` file with your actual file.

### iOS

- Update your MoEngage app-id in the `SampleApp --> iOS --> SampleApp --> AppDelegate.m` file. Replace `YOUR_APP_ID` with the App Id on the MoEngage Dashboard.

```objc
MoEngageSDKConfig *config = [[MoEngageSDKConfig alloc] initWithAppID:@"YOUR_APP_ID"];
```