# MoEngage Expo Plugin

This Expo config plugin allows you to easily integrate MoEngage SDK into your Expo app with minimal configuration. The plugin handles all the necessary native code modifications for both Android and iOS platforms.

## Installation

```bash
# Using npm
npm install moengage-expo-plugin

# Using yarn
yarn add moengage-expo-plugin
```

## Configuration

Add the plugin to your Expo config (app.json or app.config.js):

```json
{
  "expo": {
    "plugins": [
      [
        "moengage-expo-plugin",
        {
          "appId": "YOUR_MOENGAGE_APP_ID",
          "dataCenter": "DATA_CENTER_1",
          "enableLogs": true,
          "disablePeriodicFlush": false,
          "android": {
            "fcmSenderId": "YOUR_FCM_SENDER_ID",
            "debug": true
          },
          "appGroupId": "group.com.your.app"
        }
      ]
    ]
  }
}
```

## Configuration Options

| Option                | Type      | Required | Default       | Description                                                      |
|-----------------------|-----------|----------|---------------|------------------------------------------------------------------|
| appId                 | string    | Yes      | -             | Your MoEngage Application ID                                     |
| dataCenter            | string    | No       | DATA_CENTER_1 | MoEngage data center (DATA_CENTER_1/2/3/4)                       |
| enableLogs            | boolean   | No       | false         | Enable logging for MoEngage SDK                                  |
| disablePeriodicFlush  | boolean   | No       | false         | Disable periodic data sync with MoEngage servers                 |
| appGroupId            | string    | No       | -             | iOS app group ID for rich notifications (iOS only)               |
| android.fcmSenderId   | string    | No       | -             | Firebase Cloud Messaging sender ID for push notifications        |
| android.debug         | boolean   | No       | false         | Enable debug mode for development builds                         |

## Usage

After configuring the plugin, you need to run the build command to apply the native changes:

```bash
expo prebuild
```

This will generate native iOS and Android projects with MoEngage properly integrated.

### Initialize MoEngage in your JavaScript code

```javascript
import ReactMoE, { 
  MoEInitConfig, 
  MoEPushConfig, 
  MoEngageLogConfig, 
  MoEngageLogLevel,
  MoEAnalyticsConfig,
  MoEAppStatus
} from 'react-native-moengage';

// Initialize MoEngage SDK
const initializeMoEngage = () => {
  const moEInitConfig = new MoEInitConfig(
    new MoEPushConfig(true), // Enable push notifications
    new MoEngageLogConfig(MoEngageLogLevel.VERBOSE, true), // Enable verbose logging
    new MoEAnalyticsConfig(false) // Disable analytics tracking initially
  );
  
  ReactMoE.initialize("YOUR_MOENGAGE_APP_ID", moEInitConfig);
  
  // Set app status (for new installations)
  ReactMoE.setAppStatus(MoEAppStatus.Install);
};

// Set up event listeners
ReactMoE.setEventListener("pushClicked", (payload) => {
  console.log("Push notification clicked:", payload);
});

ReactMoE.setEventListener("inAppCampaignShown", (inAppInfo) => {
  console.log("In-app campaign shown:", inAppInfo);
});
```

## Features

The MoEngage Expo plugin supports the following features:

- Push notifications
- In-app messaging
- User attribute tracking
- Event tracking
- Cards
- Self-handled campaigns

## Additional Modules

MoEngage offers additional modules that you can include in your app:

- Cards: `react-native-moengage-cards`
- Inbox: `react-native-moengage-inbox`
- Geofence: `react-native-moengage-geofence`

Install these modules separately as needed:

```bash
# Using npm
npm install react-native-moengage-cards

# Using yarn
yarn add react-native-moengage-cards
```

## Note for iOS

For iOS, if you want to handle rich notifications, you need to add notification service extensions. This will require additional configuration in your native iOS project after running `expo prebuild`.

## License

This project is licensed under the MIT License - see the LICENSE file for details.