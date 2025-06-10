# React Native Expo MoEngage

This is an Expo plugin for integrating the MoEngage SDK into your React Native project.

## Installation

```bash
npm install react-native-expo-moengage
```

## Usage

Add the plugin to your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-expo-moengage",
        {
          "android": {
              "configFilePath": "<Android_Config_Path>",
              "smallIconPath": "<Small_Icon_Path>",
              "largeIconPath": "<Large_Icon_Path>",
              "includeFirebaseMessagingDependencies": false,
              "_comment1": "enable includeFirebaseMessagingDependencies to include firebase messaging library while prebuilding moengage expo plugin",
              "isExpoNotificationIntegration": false,
              "_comment2": "enable includeFirebaseMessagingDependencies to include moengage firebase service class for receiving notification while supporting expo notification",
              "shouldIncludeMoEngageFirebaseMessagingService": false,
              "_comment3": "enable includeFirebaseMessagingDependencies to include moengage firebase service class for receiving notification"
          }
        }
      ]
    ]
  }
}
```