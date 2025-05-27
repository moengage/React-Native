# MoEngage Expo Example App

This is an example app demonstrating how to integrate MoEngage SDK into an Expo application using the MoEngage Expo Plugin.

## Getting Started

### Prerequisites

- Node.js (v14+)
- Expo CLI
- iOS development environment (for iOS)
- Android development environment (for Android)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/moengage-expo-plugin.git
cd moengage-expo-plugin
```

2. Install dependencies for the plugin and example app

```bash
# Build the plugin
cd plugins/moengage-expo-plugin
npm install
npm run build

# Install example app dependencies
cd ../../example
npm install
```

3. Update your MoEngage App ID

Replace `YOUR_MOENGAGE_APP_ID` with your actual MoEngage App ID in these files:
- `example/src/key.ts`
- `example/app.json` (in the plugins section)

### Running the App

```bash
# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android
```

## Features Demonstrated

This example app demonstrates the following MoEngage features:

1. **Core SDK Integration**
   - Basic initialization of MoEngage SDK
   - Handling app state changes

2. **User Attribute Tracking**
   - Setting user attributes (name, email, etc.)
   - Setting user unique ID

3. **Event Tracking**
   - Tracking custom events with properties

4. **In-App Messaging**
   - Displaying in-app messages
   - Handling self-handled in-app campaigns

5. **Cards**
   - Fetching and displaying cards
   - Card action tracking
   - New card count tracking

6. **Push Notifications**
   - Push token handling
   - Push notification click tracking

## Project Structure

- `App.tsx` - Main application component with MoEngage SDK initialization and UI
- `src/CardsHelper.ts` - Helper class for working with MoEngage Cards
- `src/key.ts` - Contains MoEngage App ID

## Notes

- The plugin automatically configures the native iOS and Android projects with the necessary MoEngage SDK dependencies and initialization code.
- For iOS push notifications, you'll need to set up an Apple Push Notification Service (APNS) certificate or key in your MoEngage dashboard.
- For Android push notifications, you'll need to set up Firebase Cloud Messaging (FCM) and provide your FCM server key in the MoEngage dashboard.

## License

This project is licensed under the MIT License - see the LICENSE file for details.