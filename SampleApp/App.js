/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, { Component, useEffect, useRef } from "react";
import { Dimensions, Platform, StyleSheet, View, Alert, AppState } from "react-native";
import AppNavigator from "./AppNavigator";
import ReactMoE from "react-native-moengage";
import { MoEPushConfig, MoEInitConfig, MoEngageLogConfig, MoEngageLogLevel, MoEngageLogger, MoEAnalyticsConfig } from "react-native-moengage";
import * as RootNavigation from './RootNavigation.js';
import { MOENGAGE_APP_ID } from "./src/key.js";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu",
});
ReactMoE.setEventListener("pushTokenGenerated", (payload) => {
  MoEngageLogger.debug("pushTokenGenerated", payload);
});

ReactMoE.setEventListener("pushClicked", (notificationPayload) => {
  MoEngageLogger.debug("pushClicked", notificationPayload);
  if (notificationPayload.data.isDefaultAction) {
    MoEngageLogger.debug("pushClicked Screen Name default : ", notificationPayload.data.payload.Navigate);
    if (notificationPayload.data.payload.Navigate) {
      RootNavigation.navigate(notificationPayload.data.payload.Navigate, {});
    }
  } else {
    MoEngageLogger.debug("pushClicked Screen Name : ", notificationPayload.data.clickAction.payload.kvPair.Navigate);
    if (notificationPayload.data.clickAction.payload.kvPair.Navigate) {
      RootNavigation.navigate(notificationPayload.data.clickAction.payload.kvPair.Navigate, {});
    }
  }
});

ReactMoE.setEventListener("inAppCampaignShown", (inAppInfo) =>
  MoEngageLogger.debug("inAppCampaignShown", inAppInfo)
);

ReactMoE.setEventListener("inAppCampaignClicked", (inAppInfo) =>
  MoEngageLogger.debug("inAppCampaignClicked", inAppInfo)
);

ReactMoE.setEventListener("inAppCampaignDismissed", (selfHandledInAppInfo) =>
  MoEngageLogger.debug("inAppCampaignDismissed", selfHandledInAppInfo)
);

ReactMoE.setEventListener("inAppCampaignCustomAction", (selfHandledInAppInfo) =>
  MoEngageLogger.debug("inAppCampaignCustomAction", selfHandledInAppInfo)
);

ReactMoE.setEventListener("permissionResult", (permissionResultData) =>
  MoEngageLogger.debug("permissionResult", permissionResultData)
);

ReactMoE.setEventListener("inAppCampaignSelfHandled", (payload) => {
  MoEngageLogger.debug("inAppCampaignSelfHandled", payload);
});

const moEInitConfig = new MoEInitConfig(
  new MoEPushConfig(true),
  new MoEngageLogConfig(MoEngageLogLevel.VERBOSE, false),
  new MoEAnalyticsConfig(false)
);

export const App = () => {

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (Platform.OS === 'android') {
          MoEngageLogger.debug("App comes to foreground");
          ReactMoE.initialize(MOENGAGE_APP_ID, moEInitConfig);
        }
      }

      appState.current = nextAppState;
    });

    MoEngageLogger.debug("App Mounted");
    ReactMoE.initialize(MOENGAGE_APP_ID, moEInitConfig);

    return () => {
      appStateListener.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <AppNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default App;