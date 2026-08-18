import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import ReactMoE, {
  MoEAuthenticationType,
  MoEJwtAuthenticationData,
} from "react-native-moengage";

export const JwtAuthenticationScreen = (props) => {
  const [jwtToken, setJwtToken] = useState("");
  const [userIdentifier, setUserIdentifier] = useState("");

  const onSubmit = () => {
    ReactMoE.passAuthenticationDetails({
      authenticationType: MoEAuthenticationType.JWT,
      data: new MoEJwtAuthenticationData(jwtToken, userIdentifier),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>JWT Token</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter JWT token"
        value={jwtToken}
        onChangeText={setJwtToken}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.label}>User Identifier</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter user identifier"
        value={userIdentifier}
        onChangeText={setUserIdentifier}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Pass Authentication Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5FCFF",
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#088A85",
    borderRadius: 5,
    padding: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default JwtAuthenticationScreen;
