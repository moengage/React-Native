import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';
import ReactMoE from 'react-native-moengage';
import { WORKSPACE_ID } from '../../key';

const pushApiActions = [
  {
    title: 'Request Push Permission(Android)',
    action: () => {
      ReactMoE.requestPushPermissionAndroid();
    },
  },
  {
    title: 'Navigate to Settings(Android)',
    action: () => {
      ReactMoE.navigateToSettingsAndroid();
    },
  },
  {
    title: 'Pass FCM Push Token (android)',
    action: () => {
      ReactMoE.passFcmPushToken('dummyToken');
    },
  },
  {
    title: 'Register FCM Push Payload (android)',
    action: () => {
      ReactMoE.passFcmPushPayload({
        gcm_title: 'pushtoinbox',
        push_from: 'moengage',
        gcm_notificationType: 'normalnotification',
        gcm_activityName: 'com.moe.pushlibrary.activities.MoEActivity',
        gcm_alert: 'pushtoinbox',
        gcm_campaign_id: new Date().getTime(),
        moe_app_id: WORKSPACE_ID,
      });
    },
  },
  {
    title: 'Register For Push (iOS)',
    action: () => {
      ReactMoE.registerForPush();
    },
  },
  {
    title: 'Register for Provisional Push (iOS)',
    action: () => {
      ReactMoE.registerForProvisionalPush();
    },
  },
];

const PushAPIs = () => (
  <View style={{ flex: 1 }}>
    <FlatList
      data={pushApiActions}
      keyExtractor={(_, idx) => idx.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <TouchableOpacity
            style={styles.button}
            onPress={item.action}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>{item.title}</Text>
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

export default PushAPIs;