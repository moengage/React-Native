import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import ReactMoEngageRecommendations, {
  RecommendationsFailure,
} from "react-native-moengage-recommendations";
import { MoEngageLogger } from "react-native-moengage";
import { MOENGAGE_APP_ID } from "./src/key";

const recommendations = new ReactMoEngageRecommendations(MOENGAGE_APP_ID);

const parseList = (s) => s.split(",").map((x) => x.trim()).filter(Boolean);

export default function RecommendationsScreen() {
  const [recommendationIdInput, setRecommendationIdInput] = useState("");
  const [itemIdInput, setItemIdInput] = useState("");
  const [includedFieldsInput, setIncludedFieldsInput] = useState("");
  const [items, setItems] = useState(null);

  const onFetchRecommendations = async () => {
    try {
      const result = await recommendations.fetchRecommendations(
        recommendationIdInput.trim(),
        itemIdInput.trim(),
        parseList(includedFieldsInput)
      );
      MoEngageLogger.debug("fetchRecommendations", result);
      setItems(result.items);
      Alert.alert("Fetch Recommendations", `count: ${result.items.length}`);
    } catch (e) {
      setItems(null);
      if (e instanceof RecommendationsFailure) {
        MoEngageLogger.error(
          `fetchRecommendations failed: failureReason=${e.failureReason}, message=${e.message}`
        );
        Alert.alert(
          "Recommendations Failure",
          `failureReason: ${e.failureReason}\nmessage: ${e.message}`
        );
      } else {
        MoEngageLogger.error("fetchRecommendations failed with an unexpected error", e);
        Alert.alert("Error", e?.message || String(e));
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Recommendation ID</Text>
      <TextInput
        style={styles.input}
        value={recommendationIdInput}
        onChangeText={setRecommendationIdInput}
        placeholder="clothing"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.label}>Item ID (optional)</Text>
      <TextInput
        style={styles.input}
        value={itemIdInput}
        onChangeText={setItemIdInput}
        placeholder="shirts"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.label}>Included Fields (comma-separated, optional)</Text>
      <TextInput
        style={styles.input}
        value={includedFieldsInput}
        onChangeText={setIncludedFieldsInput}
        placeholder="size,color"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity style={styles.button} onPress={onFetchRecommendations}>
        <Text style={styles.buttonText}>Fetch Recommendations</Text>
      </TouchableOpacity>

      {items != null && (
        <Text style={styles.footer}>
          Items ({items.length}):{"\n"}
          {items.length > 0 ? JSON.stringify(items, null, 2) : "(none)"}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontSize: 14, fontWeight: "600", marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#088A85",
    padding: 12,
    borderRadius: 6,
    marginVertical: 6,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "600" },
  footer: { marginTop: 16, fontFamily: "Courier", color: "#555" },
});
