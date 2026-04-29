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
import { MoEngageLogger } from "react-native-moengage";
import { MOENGAGE_APP_ID } from "./src/key";

const personalize = new ReactMoEngagePersonalize(MOENGAGE_APP_ID);

// Extract ALL valid offerings from the campaign's payload. The offering key is
// dashboard-configurable, so we scan all entries. An entry may be either a stringified
// JSON array (server data_type "string") or an already-parsed array (data_type "json"),
// after the iOS plugin unwraps the {value, data_type} envelope. Android delivers the
// same shape via its native mapToAny(). Returns the full list — callers pass the array
// to offeringsShown(plural) and the first element to offeringShown / offeringClicked.
const extractOfferings = (campaign) => {
  const payload = campaign?.payload;
  if (!payload || typeof payload !== "object") return [];
  const result = [];
  for (const entry of Object.values(payload)) {
    let offerings = null;
    if (Array.isArray(entry)) {
      offerings = entry;
    } else if (typeof entry === "string") {
      try {
        offerings = JSON.parse(entry);
      } catch (_) {
        continue;
      }
    } else {
      continue;
    }
    if (!Array.isArray(offerings)) continue;
    for (const offering of offerings) {
      const ctx = offering && offering.offering_context;
      if (ctx && typeof ctx === "object" && Object.keys(ctx).length > 0) {
        result.push(offering);
      }
    }
  }
  return result;
};

const parseList = (s) => s.split(",").map((x) => x.trim()).filter(Boolean);

export default function PersonalizeScreen() {
  const [statusInput, setStatusInput] = useState("active");
  const [keysInput, setKeysInput] = useState("");
  const [lastCampaign, setLastCampaign] = useState(null);
  const [offerings, setOfferings] = useState([]);

  const showError = (e) => Alert.alert("Error", e?.message || String(e));

  const onFetchMeta = async () => {
    try {
      const statuses = parseList(statusInput);
      const result = await personalize.fetchExperiencesMeta(statuses);
      console.log(result)
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
      console.log(result)
      if (result.experiences.length > 0) {
        const campaign = result.experiences[0];
        setLastCampaign(campaign);
        setOfferings(extractOfferings(campaign));
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

  const onTrackExperiencesShown = () => {
    if (!requireCampaign()) return;
    try {
      MoEngageLogger.debug("experiencesShown", lastCampaign);
      personalize.experiencesShown([lastCampaign]);
      Alert.alert("Tracked", `Experiences Shown: ${lastCampaign.experienceKey}`);
    } catch (e) {
      showError(e);
    }
  };

  const onTrackExperienceShown = () => {
    if (!requireCampaign()) return;
    try {
      MoEngageLogger.debug("experienceShown", lastCampaign);
      personalize.experienceShown(lastCampaign);
      Alert.alert("Tracked", `Experience Shown: ${lastCampaign.experienceKey}`);
    } catch (e) {
      showError(e);
    }
  };

  const onTrackExperienceClicked = () => {
    if (!requireCampaign()) return;
    try {
      MoEngageLogger.debug("experienceClicked", lastCampaign);
      personalize.experienceClicked(lastCampaign);
      Alert.alert("Tracked", `Experience Clicked: ${lastCampaign.experienceKey}`);
    } catch (e) {
      showError(e);
    }
  };

  const requireOfferings = () => {
    if (offerings.length === 0) {
      Alert.alert(
        "No offerings",
        "The fetched campaign does not contain offerings. Fetch an experience with offerings configured to use this."
      );
      return false;
    }
    return true;
  };

  const onTrackOfferingsShown = () => {
    if (!requireOfferings()) return;
    try {
      MoEngageLogger.debug("offeringsShown", offerings);
      personalize.offeringsShown(offerings);
      Alert.alert("Tracked", `Offerings Shown: ${offerings.length}`);
    } catch (e) {
      showError(e);
    }
  };

  const onTrackOfferingShown = () => {
    if (!requireOfferings()) return;
    try {
      const first = offerings[0];
      MoEngageLogger.debug("offeringShown", first);
      personalize.offeringShown(first);
      Alert.alert("Tracked", "Offering Shown");
    } catch (e) {
      showError(e);
    }
  };

  const onTrackOfferingClicked = () => {
    if (!requireCampaign()) return;
    if (!requireOfferings()) return;
    try {
      const first = offerings[0];
      MoEngageLogger.debug("offeringClicked", { experience: lastCampaign, offeringPayload: first });
      personalize.offeringClicked(lastCampaign, first);
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
      <Button title="Track Experiences Shown (plural)" onPress={onTrackExperiencesShown} />
      <Button title="Track Experience Shown (singular)" onPress={onTrackExperienceShown} />
      <Button title="Track Experience Clicked" onPress={onTrackExperienceClicked} />
      <Button title="Track Offerings Shown (plural)" onPress={onTrackOfferingsShown} />
      <Button title="Track Offering Shown (singular)" onPress={onTrackOfferingShown} />
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
