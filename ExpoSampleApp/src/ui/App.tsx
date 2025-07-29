import React, { useEffect } from "react";
import ReactMoE from "react-native-moengage";
import { WORKSPACE_ID } from "../key";
import AppNavigator from "./AppNavigator";
import { View, StyleSheet } from "react-native";

addMoEngageListeners();

const App = () => {
  useEffect(() => {
    ReactMoE.initialize(WORKSPACE_ID);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <AppNavigator />
    </View>
  );
}

/**
 * Add the MoEngage event listeners
 */
function addMoEngageListeners() {
  ReactMoE.setEventListener("inAppCampaignShown", (inAppInfo) =>
    console.debug("inAppCampaignShown", inAppInfo)
  );
  ReactMoE.setEventListener("inAppCampaignClicked", (inAppInfo) =>
    console.debug("inAppCampaignClicked", inAppInfo)
  );
  ReactMoE.setEventListener("inAppCampaignDismissed", (selfHandledInAppInfo) =>
    console.debug("inAppCampaignDismissed", selfHandledInAppInfo)
  );
  ReactMoE.setEventListener("inAppCampaignCustomAction", (selfHandledInAppInfo) =>
    console.debug("inAppCampaignCustomAction", selfHandledInAppInfo)
  );
  ReactMoE.setEventListener("pushClicked", (notificationPayload) => {
    console.debug("pushClicked", notificationPayload);
  });
  ReactMoE.setEventListener("permissionResult", (permissionResultData) =>
    console.debug("permissionResult", permissionResultData)
  );
  ReactMoE.setEventListener("inAppCampaignSelfHandled", (payload) => {
    console.debug("inAppCampaignSelfHandled", payload);
  });
}

export default App;