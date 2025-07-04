import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList, Platform } from "react-native";
import ReactMoE, { MoEProperties } from "react-native-moengage";
import { WORKSPACE_ID } from "../key";
import * as Notifications from 'expo-notifications';

addMoEngageListeners()

const App = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();

  useEffect(() => {
    ReactMoE.initialize(WORKSPACE_ID);

    setupExpoNotifications()
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
        ReactMoE.identifyUser("expo-react-user");
      },
    },
    {
      title: "Register for Push Notifications",
      onPress: async () => {
        const token = await Notifications.getExpoPushTokenAsync();
        setExpoPushToken(token.data);
      },
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MoEngage SDK Integration</Text>
      <Text selectable style={{ fontSize: 12, marginBottom: 8 }}>
        Expo Push Token: {expoPushToken || 'Not registered'}
      </Text>
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

/**
 * Setup Expo Notifications and register listeners
 * Notes: This is optional and only needed if you want to handle notifications using Expo.
 */
function setupExpoNotifications() {
    registerForPushNotificationsAsync()
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
       console.log('Received notification:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    const pushTokenListener = Notifications.addPushTokenListener(token => {
      console.log('Received push token:', token);
      ReactMoE.passFcmPushToken(token.data);
    });
}

/**
 * Expo Notification Setup & Token Registration
 */
async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android' && await Notifications.getNotificationChannelAsync('default') === null) {
    console.log("Creating default channel using expo");
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX
    });
  }

  await requestPushNotificationPermission();
}

/**
 * Request push notification permissions using Expo Notifications
 */
async function requestPushNotificationPermission(): Promise<Boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return false;
  }

  return true;
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