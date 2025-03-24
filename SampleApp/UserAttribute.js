import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { AlertBox, fire } from "react-native-alertbox";
import ReactMoE, {
  MoEGeoLocation,
  MoEngageLogger,
} from "react-native-moengage";

export class UserAttribute extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "UserAttribute",
    };
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <AlertBox />
        <FlatList
          data={[
            {
              id: "0",
              title: "Set Default User Attributes",
              action: () => {
                //User Attribute
                ReactMoE.setUserUniqueID("ReactNative@moengage.com");
                ReactMoE.setUserName("React Native");
                ReactMoE.setUserFirstName("React");
                ReactMoE.setUserLastName("Native");
                ReactMoE.setUserEmailID("ReactNative@moengage.com");
                ReactMoE.setUserContactNumber("8741020097");
                ReactMoE.setUserBirthday("1970-01-01T12:00:00Z");
                ReactMoE.setUserGender("Male"); //OR Female
                ReactMoE.setAlias("RN");

                ReactMoE.setUserLocation(new MoEGeoLocation(77.3201, -77.3201));

                ReactMoE.setUserAttribute("qazAttribute", "qaz123");

                ReactMoE.setUserAttributeLocation(
                  "user_login_location",
                  new MoEGeoLocation(10.3223, -88.6026)
                );

                ReactMoE.setUserAttributeISODateString(
                  "userDate",
                  new Date().toISOString()
                );
              },
            },
            {
              id: "1",
              title: "Set UniqueID",
              action: () => {
                fire({
                  title: 'Enter UniqueID',
                  message: null,
                  actions: [
                    { text: 'Cancel' },
                    { text: 'OK', onPress: result => ReactMoE.setUserUniqueID(result.uniqueid) },
                  ],
                  fields: [
                    {
                      name: 'uniqueid',
                      placeholder: 'Enter username',
                    },
                  ],
                });
              },
            },
            {
              id: "2",
              title: "Set User Alias",
              action: () => {
                fire({
                  title: 'Enter Alias',
                  message: null,
                  actions: [
                    { text: 'Cancel' },
                    { text: 'OK', onPress: result => ReactMoE.setAlias(result.alias) },
                  ],
                  fields: [
                    {
                      name: 'alias',
                      placeholder: 'Enter alias',
                    },
                  ],
                });
              },
            },
            {
              id: "3",
              title: "Set FirstName",
              action: () => {
                fire({
                  title: 'Enter FirstName',
                  message: null,
                  actions: [
                    { text: 'Cancel' },
                    { text: 'OK', onPress: result => ReactMoE.setUserFirstName(result.firstname) },
                  ],
                  fields: [
                    {
                      name: 'firstname',
                      placeholder: 'Enter firstname',
                    },
                  ],
                });
              },
            },
            {
              id: "4",
              title: "Set LastName",
              action: () => {
                fire({
                  title: 'Enter Lastname',
                  message: null,
                  actions: [
                    { text: 'Cancel' },
                    { text: 'OK', onPress: result => ReactMoE.setUserLastName(result.lastname) },
                  ],
                  fields: [
                    {
                      name: 'lastname',
                      placeholder: 'Enter lastname',
                    },
                  ],
                });
              },
            },
            {
              id: "5",
              title: "Set EmailID",
              action: () => {
                fire({
                  title: 'Enter EmailId',
                  message: null,
                  actions: [
                    { text: 'Cancel' },
                    { text: 'OK', onPress: result => ReactMoE.setUserEmailID(result.emailid) },
                  ],
                  fields: [
                    {
                      name: 'emailid',
                      placeholder: 'Enter EmailId',
                    },
                  ],
                });
              },
            },
            {
              id: "6",
              title: "Set ContactNumber",
              action: () => {
                fire({
                  title: 'Enter Number',
                  message: null,
                  actions: [
                    { text: 'Cancel' },
                    { text: 'OK', onPress: result => ReactMoE.setUserContactNumber(result.number) },
                  ],
                  fields: [
                    {
                      name: 'number',
                      placeholder: 'Enter number',
                    },
                  ],
                });
              },
            },
            {
              id: "7",
              title: "Set Birthday",
              action: () => {
                ReactMoE.setUserBirthday("1970-01-01T12:00:00Z");
              }
            },
            {
              id: "8",
              title: "Set Gender",
              action: () => {
                fire({
                  title: 'Enter Gender',
                  message: null,
                  actions: [
                    { text: 'Cancel' },
                    { text: 'OK', onPress: result => ReactMoE.setUserGender(result.gender) },
                  ],
                  fields: [
                    {
                      name: 'gender',
                      placeholder: 'Enter gender',
                    },
                  ],
                });
              },
            },
            {
              id: "9",
              title: "Set Location",
              action: () => {
                ReactMoE.setUserLocation(new MoEGeoLocation(98.34, 66.33));
              }
            },
            {
              id: "10",
              title: "Set Custom UserAtrribute",
              action: () => {
                ReactMoE.setUserAttribute("qazAttribute", "qaz123");
                ReactMoE.setUserAttribute("intAttribute", 77);
                ReactMoE.setUserAttribute("floatAttribute", 77.333);
                ReactMoE.setUserAttribute("booleanAttribute", false);
                ReactMoE.setUserAttribute("arrayOfInt", [1, 2, 3]);
                ReactMoE.setUserAttribute("arrayOfString", ['sample', 'sampledd', 'sampleg']);
                ReactMoE.setUserAttribute("arrayOfFloat", [23.44, 56.33, 34.44, 24.44]);
              }
            },
            {
              id: "12",
              title: "Set ISO Date",
              action: () => {
                ReactMoE.setUserAttributeISODateString(
                  "userDate",
                  new Date().toISOString()
                );
              }
            },
            {
              id: "13",
              title: "Set Custom Location",
              action: () => {
                ReactMoE.setUserAttributeLocation(
                  "user_login_location",
                  new MoEGeoLocation(10.3223, -88.6026)
                );
              }
            },
            {
              id: "14",
              title: "set JSONArray",
              action: () => {
                ReactMoE.setUserAttribute(
                  "moe_user_attr_int_json_array",
                  [1, 2, 3]
                );
                ReactMoE.setUserAttribute(
                  "moe_user_attr_string_json_array",
                  ["str1", "str2", "str3"]
                );
                ReactMoE.setUserAttribute(
                  "moe_user_attr_float_json_array",
                  [1.1, 2.2, 3.3]
                );
                ReactMoE.setUserAttribute(
                  "moe_user_attr_empty_json_array",
                  []
                );
                ReactMoE.setUserAttribute(
                  "moe_user_attr_null_json_array",
                  [1, null, 2]
                );
                ReactMoE.setUserAttribute(
                  "moe_user_attr_undefined_json_array",
                  [1, undefined, 2]
                );
                ReactMoE.setUserAttribute(
                  "moe_user_attr_mix_json_array",
                  [1, "str1", 2.2]
                );
                ReactMoE.setUserAttribute(
                  "moe_user_attr_nested_json_array",
                  ["str0", "str1", ["str3", "str4"]]
                );
                ReactMoE.setUserAttribute(
                  "moe_user_attr_json_array_with_obj",
                  [{ "intKey": 1 }, { "strKey": "str" }, { "boolKey": true }]
                );
              }
            },
            {
              id: "15",
              title: "set JSONObject",
              action: () => {
                ReactMoE.setUserAttribute(
                  "moe_user_attr_single_lvl_json_object",
                  { "intKey": 1, "stringKey": "str2", "boolKey": false }
                );
                ReactMoE.setUserAttribute(
                  "moe_user_attr_double_lvl_json_object",
                  { "intKey": 1, "stringKey": "str2", "boolKey": false, "nested_key": { "nKStr": "str", "nKInt": 1, "doubleNK": { "dNK": 1 } } }
                );
                ReactMoE.setUserAttribute(
                  "moe_user_attr_empty_json_object",
                  {}
                );
                ReactMoE.setUserAttribute(
                  "moe_user_attr_null_json_object",
                  { "intKey": 1, "undefined_key": undefined, "nullKey": null }
                );
                ReactMoE.setUserAttribute(
                  "moe_user_attr_nested_json_object_with_array",
                  { "intKey": 1, "stringKey": "str2", "boolKey": false, "nested_key": [1, 2, 3, { "array_key": 1 }] }
                );
              }
            },
            {
              id: "16",
              title: "set identity (string)",
              action: () => {
                ReactMoE.identifyUser("react-native-uid");
              }
            },
            {
              id: "17",
              title: "set identity (object)",
              action: () => {
                ReactMoE.identifyUser({
                  "id": "react-native",
                  "email": "react-native@moengage.com"
                });
              }
            },
            {
              id: "18",
              title: "get identity",
              action: async () => {
                MoEngageLogger.debug("getIdentities: ", await ReactMoE.getUserIdentities())
              }
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

export default UserAttribute;
