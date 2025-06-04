import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";
import ReactMoE, { MoEProperties } from "react-native-moengage";
import { YOUR_APP_ID } from "../key";

addMoEngageListeners()

const App = () => {
  useEffect(() => {
    ReactMoE.initialize(YOUR_APP_ID);
  }, []);

  const actions = [
    {
      title: "Track Event",
      onPress: () => {
        let moeProperties = new MoEProperties();
        moeProperties.addAttribute("key", "value");
        ReactMoE.trackEvent("SampleEvent", moeProperties);
      },
    },
    {
      title: "Set User Attribute",
      onPress: () => {
        ReactMoE.setUserAttribute("user_name", "John Doe");
        ReactMoE.setUserAttribute("user_email", "john.doe@example.com");
      },
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MoEngage SDK Integration</Text>
      <FlatList
        data={actions}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.buttonWrapper}>
            <Button title={item.title} onPress={item.onPress} />
          </View>
        )}
        contentContainerStyle={{ width: '100%' }}
      />
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
  buttonWrapper: {
    marginBottom: 16,
    width: '100%',
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