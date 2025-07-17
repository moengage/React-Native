import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';
import ReactMoE, { MoEProperties } from 'react-native-moengage';

const coreApiActions = [
  {
    text: 'Track Event',
    action: () => {
      let moeProperties = new MoEProperties();
      moeProperties.addAttribute('key', 'value');
      ReactMoE.trackEvent('SampleEvent', moeProperties);
    },
  },
  {
    text: 'Set User Attribute',
    action: () => {
      ReactMoE.setUserAttribute('user_name', 'John Doe');
      ReactMoE.setUserAttribute('user_email', 'john.doe@example.com');
      ReactMoE.identifyUser('expo-react-user');
    },
  },
  {
    text: 'Logout',
    action: () => {
      ReactMoE.logout();
    },
  },
  {
    text: 'Enable SDK',
    action: () => {
      ReactMoE.enableSdk();
    },
  },
  {
    text: 'Disable SDK',
    action: () => {
      ReactMoE.disableSdk();
    },
  },
  {
    text: 'Enable Ad Id Tracking (Android)',
    action: () => {
      ReactMoE.enableAdIdTracking();
    },
  },
  {
    text: 'Disable Ad Id Tracking (Android)',
    action: () => {
      ReactMoE.disableAdIdTracking();
    },
  },
  {
    text: 'Enable android-id tracking (Android)',
    action: () => {
      ReactMoE.enableAndroidIdTracking();
    },
  },
  {
    text: 'Disable android-id tracking (Android)',
    action: () => {
      ReactMoE.disableAndroidIdTracking();
    },
  },
  {
    text: 'Opt in data',
    action: () => {
      ReactMoE.enableDataTracking();
    },
  },
  {
    text: 'Opt out data',
    action: () => {
      ReactMoE.disableDataTracking();
    },
  },
  {
    text: 'Delete User (Android)',
    action: async () => {
      const userDeletionData = await ReactMoE.deleteUser();
      console.log('User Deletion State: ', userDeletionData);
    },
  },
  {
    text: 'Enable Device Id (Android)',
    action: async () => {
      ReactMoE.enableDeviceIdTracking();
    },
  },
  {
    text: 'Disable Device Id (Android)',
    action: async () => {
      ReactMoE.disableDeviceIdTracking();
    },
  },
];

const CoreAPIs = () => (
  <View style={{ flex: 1 }}>
    <FlatList
      data={coreApiActions}
      keyExtractor={(_, idx) => idx.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <TouchableOpacity
            style={styles.button}
            onPress={item.action}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>{item.text}</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  </View>
);

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

export default CoreAPIs;