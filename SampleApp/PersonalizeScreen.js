import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import ReactMoEngagePersonalize from "react-native-moengage-personalize";
import { MOENGAGE_APP_ID } from "./src/key";

const personalize = new ReactMoEngagePersonalize(MOENGAGE_APP_ID);

const OFFERING_ATTRS = {
  moe_offering_id: "offer_001",
  moe_offering_name: "Demo Offering",
};

const parseList = (s) => s.split(",").map((x) => x.trim()).filter(Boolean);

export default function PersonalizeScreen() {
  const [statusInput, setStatusInput] = useState("active");
  const [keysInput, setKeysInput] = useState("");
  const [lastCampaign, setLastCampaign] = useState(null);

  const showError = (e) => Alert.alert("Error", e?.message || String(e));

  const onFetchMeta = async () => {
    try {
      const statuses = parseList(statusInput);
      const result = await personalize.fetchExperiencesMeta(statuses);
      const lines = result.experiences
        .map((e) => `- ${e.experienceKey} (${e.status})`)
        .join("\n");
      Alert.alert(
        "Fetch Meta",
        `source: ${result.source}\ncount: ${result.experiences.length}\n${lines || "(none)"}`
      );
    } catch (e) {
      showError(e);
    }
  };

  const onFetchExperiences = async () => {
    try {
      const keys = parseList(keysInput);
      if (keys.length === 0) {
        Alert.alert("Missing input", "Enter at least one experience key (comma-separated).");
        return;
      }
      const result = await personalize.fetchExperiences(keys);
      if (result.experiences.length > 0) {
        setLastCampaign(result.experiences[0]);
      }
      const expLines = result.experiences
        .map((e) => `- ${e.experienceKey} [${e.source}]`)
        .join("\n");
      const failLines = result.failures
        .map((f) => `- ${f.reason}: ${f.experienceKeys.join(", ")}`)
        .join("\n");
      Alert.alert(
        "Fetch Experiences",
        `experiences (${result.experiences.length}):\n${expLines || "(none)"}\n\nfailures (${result.failures.length}):\n${failLines || "(none)"}`
      );
    } catch (e) {
      showError(e);
    }
  };

  const requireCampaign = () => {
    if (!lastCampaign) {
      Alert.alert(
        "No campaign",
        "Run 'Fetch Experiences' first to obtain a campaign to track."
      );
      return false;
    }
    return true;
  };

  const onTrackExperienceShown = () => {
    if (!requireCampaign()) return;
    try {
      personalize.trackExperienceShown([lastCampaign]);
      Alert.alert("Tracked", `Experience Shown: ${lastCampaign.experienceKey}`);
    } catch (e) {
      showError(e);
    }
  };

  const onTrackExperienceClicked = () => {
    if (!requireCampaign()) return;
    try {
      personalize.trackExperienceClicked(lastCampaign);
      Alert.alert("Tracked", `Experience Clicked: ${lastCampaign.experienceKey}`);
    } catch (e) {
      showError(e);
    }
  };

  const onTrackOfferingShown = () => {
    try {
      personalize.trackOfferingShown([OFFERING_ATTRS]);
      Alert.alert("Tracked", "Offering Shown");
    } catch (e) {
      showError(e);
    }
  };

  const onTrackOfferingClicked = () => {
    if (!requireCampaign()) return;
    try {
      personalize.trackOfferingClicked(lastCampaign, OFFERING_ATTRS);
      Alert.alert("Tracked", `Offering Clicked: ${lastCampaign.experienceKey}`);
    } catch (e) {
      showError(e);
    }
  };

  const Button = ({ title, onPress }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Statuses (comma-separated, blank = all)</Text>
      <TextInput
        style={styles.input}
        value={statusInput}
        onChangeText={setStatusInput}
        placeholder="active,paused,scheduled"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.label}>Experience Keys (comma-separated)</Text>
      <TextInput
        style={styles.input}
        value={keysInput}
        onChangeText={setKeysInput}
        placeholder="welcome_banner,home_hero"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Button title="Fetch Experience Meta" onPress={onFetchMeta} />
      <Button title="Fetch Experiences" onPress={onFetchExperiences} />
      <Button title="Track Experience Shown" onPress={onTrackExperienceShown} />
      <Button title="Track Experience Clicked" onPress={onTrackExperienceClicked} />
      <Button title="Track Offering Shown" onPress={onTrackOfferingShown} />
      <Button title="Track Offering Clicked" onPress={onTrackOfferingClicked} />

      {lastCampaign && (
        <Text style={styles.footer}>
          Last campaign: {lastCampaign.experienceKey}
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
  footer: { marginTop: 16, fontStyle: "italic", color: "#555" },
});
