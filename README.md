# MoEngage Expo Plugin

This repository contains a plugin for easy integration of MoEngage SDK with Expo applications, along with an example app that demonstrates its usage.

## Repository Structure

- **plugins/moengage-expo-plugin/** - The Expo config plugin for MoEngage
- **example/** - Example Expo app using the MoEngage plugin
- **sdk/** - MoEngage SDK source code (reference only, not modified by the plugin)
- **SampleApp/** - Original React Native sample app (reference only)

## MoEngage Expo Plugin

The MoEngage Expo plugin simplifies integrating MoEngage SDK into Expo apps by automating native code modifications. The plugin:

- Configures MoEngage SDK for both iOS and Android platforms
- Sets up push notification handling
- Configures in-app messaging
- Enables analytics tracking
- Supports cards and other MoEngage features

For detailed usage instructions, see [the plugin README](./plugins/moengage-expo-plugin/README.md).

## Example App

The example app demonstrates how to use the MoEngage Expo plugin in a real Expo application. It includes:

- SDK initialization
- Event tracking
- User attribute setting
- In-app messaging
- Cards integration
- Push notification handling

For more information, see [the example app README](./example/README.md).

## Getting Started

1. Build the plugin:

   ```bash
   cd plugins/moengage-expo-plugin
   npm install
   npm run build
   ```

2. Run the example app (after updating your MoEngage App ID in necessary files):

   ```bash
   cd example
   npm install
   npx expo run:ios  # or run:android
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.