import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import ReactMoE from "react-native-moengage";
import { MOENGAGE_APP_ID } from "./src/key";

export class PushNotification extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Push Notification",
    };
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={[
            {
              id: "0",
              title: "Register For Push (iOS)",
              action: () => {
                  ReactMoE.registerForPush();
              },
            },
            {
              id: "1",
              title: "Pass FCM Push Token (android)",
              action: () => {
                ReactMoE.passFcmPushToken("dummyToken");
              },
            },
            {
              id: "2",
              title: "Register FCM Push Payload (android)",
              action: () => {
                ReactMoE.passFcmPushPayload( {
                  "gcm_title": "pushtoinbox",
                  "push_from": "moengage",
                  "gcm_notificationType": "normalnotification",
                  "gcm_activityName": "com.moe.pushlibrary.activities.MoEActivity",
                  "gcm_alert": "pushtoinbox",
                  "gcm_campaign_id": new Date().getTime(),
                  "moe_app_id": MOENGAGE_APP_ID
                })
              },
            },
          ]}
          renderItem={({ item, separators }) => (
            <TouchableOpacity
              onPress={() => item.action()}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}
            >
              <View style={{ backgroundColor: "white" }}>
                <Text style={styles.item}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
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
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  headerStyleVary: {
    paddingLeft: 20,
    paddingRight: 20,
    width: 30,
    height: 30,
    flex: 1,
  },
});

export default PushNotification;
