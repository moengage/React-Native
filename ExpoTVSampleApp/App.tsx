import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import ReactMoE, { MoEProperties } from "react-native-moengage";
import { YOUR_APP_ID } from "./src/key";

addMoEngageListeners()

const App = () => {
  useEffect(() => {
    ReactMoE.initialize(YOUR_APP_ID);
  }, []);

  const trackEvent = () => {
    let moeProperties = new MoEProperties();
    moeProperties.addAttribute("key", "value");
    ReactMoE.trackEvent("SampleEvent", moeProperties);
  };

  const setUserAttribute = () => {
    ReactMoE.setUserAttribute("user_name", "John Doe");
    ReactMoE.setUserAttribute("user_email", "john.doe@example.com");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MoEngage SDK Integration</Text>
      <Button title="Track Event" onPress={trackEvent} />
      <Button title="Set User Attribute" onPress={setUserAttribute} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});

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