import React, { useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import ReactMoE from 'react-native-moengage';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    setupExpoNotifications();
  }, []);

  const apiScreens = [
    { key: 'CardsAPIs', title: 'Cards APIs' },
    { key: 'CoreAPIs', title: 'Core APIs' },
    { key: 'GeofenceAPIs', title: 'Geofence APIs' },
    { key: 'InAppAPIs', title: 'InApp APIs' },
    { key: 'InboxAPIs', title: 'Inbox APIs' },
    { key: 'PushAPIs', title: 'Push APIs' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={apiScreens}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate(item.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>{item.title}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    marginTop: 20,
    marginStart: 14,
    marginEnd: 14,
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  button: {
    padding: 12,
    backgroundColor: '#088A85',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'none',
  },
});

function setupExpoNotifications() {
  registerForPushNotificationsAsync();

  Notifications.addNotificationReceivedListener(notification => {
    console.log('Received notification:', notification);
  });
  Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification response:', response);
  });
  Notifications.addPushTokenListener(token => {
    console.log('Received push token:', token);
    ReactMoE.passFcmPushToken(token.data);
  });
}

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

async function requestPushNotificationPermission() {
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

export default HomeScreen;