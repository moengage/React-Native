import React, { useEffect, useCallback } from "react";
import {useFocusEffect} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
  BackHandler,
  Alert
} from "react-native";
import ReactMoE, {
  MoEAppStatus,
} from "react-native-moengage";
import RNRestart from 'react-native-restart';

import ReactMoEGeofence from 'react-native-moengage-geofence';
import { MOENGAGE_APP_ID, SECONDARY_APP_ID } from "./src/key";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateAppId } from "./src/AndroidPlatform";

const onAppExit = () => {
  Alert.alert(
    'Exit',
    'Exit the app',
    [
      {
        text: 'Cancel',
      },
      {
        text: 'Ok',
        onPress: () => {
          BackHandler.exitApp();
        },
      },
    ],
    { cancelable: false },
  );
};

export const HomeScreen = (props) => {

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        onAppExit();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [onAppExit]),
  );

  useEffect(() => {
    ReactMoE.setAppStatus(MoEAppStatus.Install);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={[
          {
            id: "0",
            title: "Track Events",
            action: () => {
              props.navigation.navigate("TrackEvent");
            },
          },
          {
            id: "1",
            title: "Set User Attributes",
            action: () => {
              props.navigation.navigate("UserAttribute")
            },
          },
          {
            id: "2",
            title: "Push Notification",
            action: () => {
              props.navigation.navigate("PushNotification")
            },
          },
          {
            id: "3",
            title: "InApp",
            action: () => {
              //To show inApp
              props.navigation.navigate("InAppDetailScreen");
            },
          },
          {
            id: "4",
            title: "Inbox",
            action: () => {
              props.navigation.navigate("InboxDetailScreen");
            },
          },
          {
            id: "5",
            title: "Start Geofence Monitoring",
            action: () => {
              ReactMoEGeofence.startGeofenceMonitoring(MOENGAGE_APP_ID);
            }
          },
          {
            id: "6",
            title: "Enable SDK",
            action: () => {
              ReactMoE.enableSdk();
            },
          },
          {
            id: "7",
            title: "Disable SDK",
            action: () => {
              ReactMoE.disableSdk();
            },
          },
          {
            id: "8",
            title: "Logout",
            action: () => {
              //For User Logout
              ReactMoE.logout();
            },
          },
          {
            id: "9",
            title: "Enable Ad Id Tracking(Android)",
            action: () => {
              ReactMoE.enableAdIdTracking();
            }
          },
          {
            id: "10",
            title: "Disable Ad Id Tracking(Android)",
            action: () => {
              ReactMoE.disableAdIdTracking();
            }
          },
          {
            id: "11",
            title: "Enable android-id tracking(Android)",
            action: () => {
              ReactMoE.enableAndroidIdTracking();
            }
          },
          {
            id: "12",
            title: "Disable android-id tracking(Android)",
            action: () => {
              ReactMoE.disableAndroidIdTracking();
            }
          },
          {
            id: "13",
            title: "Opt in data",
            action: () => {
              ReactMoE.enableDataTracking()
            }
          },
          {
            id: "14",
            title: "Opt out data",
            action: () => {
              ReactMoE.disableDataTracking();
            }
          },
          {
            id: '15',
            title: 'Request Push Permission(Android)',
            action: () => {
                ReactMoE.requestPushPermissionAndroid();
            },
          },
          {
            id:'16',
            title: 'Navigate to Settings(Android)',
            action: () => {
                ReactMoE.navigateToSettingsAndroid();
            }
          },
          {
            id:'17',
            title:'Mock push permission granted(Android)',
            action: () => {
              ReactMoE.pushPermissionResponseAndroid(true);
            }
          },
          {
            id:'18',
            title:'Mock push permission denied(Android)',
            action: () => {
              ReactMoE.pushPermissionResponseAndroid(false);
            }
          },
          {  
            id: "19",
            title: "Stop Geofence Monitoring",
            action: () => {
              ReactMoEGeofence.stopGeofenceMonitoring(MOENGAGE_APP_ID);
            }
          },
          {
            id: "20",
            title: "Self Handled Cards",
            action: () => {
              props.navigation.navigate("CardsScreen");
            }
          },
          {
            id: "21",
            title: "Delete User (Android)",
            action: async () => {
              const userDeletionData = await ReactMoE.deleteUser();
              console.log("User Deletion State: ", userDeletionData);
            }
          },
          {
            id: "22",
            title: "Enable Device Id (Android)",
            action: async () => {
              ReactMoE.enableDeviceIdTracking();
            }
          },
          {
            id: "23",
            title: "Disable Device Id (Android)",
            action: async () => {
              ReactMoE.disableDeviceIdTracking();
            }
          },
          {
            id: "24",
            title: "Update Push Permission Count (Android)",
            action: async () => {
              ReactMoE.updatePushPermissionRequestCountAndroid(1);
            }
          },
          {
            id: "25",
            title: "Reload Application (with different Id)",
            action: async () => {
              ReactMoE.logout();
              await AsyncStorage.setItem('AppId', SECONDARY_APP_ID);
              updateAppId(SECONDARY_APP_ID);
              RNRestart.restart();
            }
          }
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

export default HomeScreen;
