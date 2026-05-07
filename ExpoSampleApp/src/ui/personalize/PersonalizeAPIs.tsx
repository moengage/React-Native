import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import ReactMoEngagePersonalize, {
  ExperienceCampaign,
  ExperienceStatus,
} from 'react-native-moengage-personalize';
import { WORKSPACE_ID } from '../../key';

const personalize = new ReactMoEngagePersonalize(WORKSPACE_ID);

// Extract ALL valid offerings from the campaign's payload. The offering key is
// dashboard-configurable, so we scan all entries. An entry may be either a stringified
// JSON array (server data_type "string") or an already-parsed array (data_type "json"),
// after the iOS plugin unwraps the {value, data_type} envelope. Android delivers the
// same shape via its native mapToAny(). Returns the full list — callers pass the array
// to offeringsShown(plural) and the first element to offeringShown / offeringClicked.
const extractOfferings = (campaign: ExperienceCampaign): Record<string, any>[] => {
  const payload = campaign?.payload;
  if (!payload || typeof payload !== 'object') return [];
  const result: Record<string, any>[] = [];
  for (const entry of Object.values(payload)) {
    let offerings: unknown = null;
    if (Array.isArray(entry)) {
      offerings = entry;
    } else if (typeof entry === 'string') {
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
      if (ctx && typeof ctx === 'object' && Object.keys(ctx).length > 0) {
        result.push(offering);
      }
    }
  }
  return result;
};

const parseList = (s: string): string[] =>
  s.split(',').map((x) => x.trim()).filter(Boolean);

const PersonalizeAPIs = () => {
  const [statusInput, setStatusInput] = useState('active');
  const [keysInput, setKeysInput] = useState('');
  const [campaigns, setCampaigns] = useState<ExperienceCampaign[]>([]);
  const [offerings, setOfferings] = useState<Record<string, any>[]>([]);

  const showError = (e: any) => Alert.alert('Error', e?.message || String(e));

  const requireCampaign = (): boolean => {
    if (campaigns.length === 0) {
      Alert.alert('No campaign', "Run 'Fetch Experiences' first to obtain a campaign to track.");
      return false;
    }
    return true;
  };

  const requireOfferings = (): boolean => {
    if (offerings.length === 0) {
      Alert.alert(
        'No offerings',
        'The fetched campaign does not contain offerings. Fetch an experience with offerings configured to use this.'
      );
      return false;
    }
    return true;
  };

  const onFetchMeta = async () => {
    try {
      const statuses = parseList(statusInput) as ExperienceStatus[];
      const result = await personalize.fetchExperiencesMeta(statuses);
      console.log("fetchExperiencesMeta", result);
      const lines = result.experiences
        .map((e) => `- ${e.experienceKey} (${e.status})`)
        .join('\n');
      Alert.alert(
        'Fetch Meta',
        `source: ${result.source}\ncount: ${result.experiences.length}\n${lines || '(none)'}`
      );
    } catch (e) {
      showError(e);
    }
  };

  const onFetchExperiences = async () => {
    try {
      const keys = parseList(keysInput);
      if (keys.length === 0) {
        Alert.alert('Missing input', 'Enter at least one experience key (comma-separated).');
        return;
      }
      const result = await personalize.fetchExperiences(keys);
      console.log("fetchExperiences", result);
      setCampaigns(result.experiences);
      setOfferings(result.experiences.flatMap(extractOfferings));
      const expLines = result.experiences
        .map((e) => `- ${e.experienceKey} [${e.source}]`)
        .join('\n');
      const failLines = result.failures
        .map((f) => `- ${f.reason}: ${f.experienceKeys.join(', ')}`)
        .join('\n');
      Alert.alert(
        'Fetch Experiences',
        `experiences (${result.experiences.length}):\n${expLines || '(none)'}\n\nfailures (${result.failures.length}):\n${failLines || '(none)'}`
      );
    } catch (e) {
      showError(e);
    }
  };

  const onTrackExperiencesShown = () => {
    if (!requireCampaign()) return;
    try {
      console.log("experiencesShown", campaigns);
      personalize.experiencesShown(campaigns);
      Alert.alert('Tracked', `Experiences Shown: ${campaigns.length}`);
    } catch (e) {
      showError(e);
    }
  };

  const onTrackExperienceShown = () => {
    if (!requireCampaign()) return;
    try {
      const first = campaigns[0]!;
      console.log("experienceShown", first);
      personalize.experienceShown(first);
      Alert.alert('Tracked', `Experience Shown: ${first.experienceKey}`);
    } catch (e) {
      showError(e);
    }
  };

  const onTrackExperienceClicked = () => {
    if (!requireCampaign()) return;
    try {
      const first = campaigns[0]!;
      console.log("experienceClicked", first);
      personalize.experienceClicked(first);
      Alert.alert('Tracked', `Experience Clicked: ${first.experienceKey}`);
    } catch (e) {
      showError(e);
    }
  };

  const onTrackOfferingsShown = () => {
    if (!requireOfferings()) return;
    try {
      console.log("offeringsShown", offerings);
      personalize.offeringsShown(offerings);
      Alert.alert('Tracked', `Offerings Shown: ${offerings.length}`);
    } catch (e) {
      showError(e);
    }
  };

  const onTrackOfferingShown = () => {
    if (!requireOfferings()) return;
    try {
      const first = offerings[0];
      console.log("offeringShown", first);
      personalize.offeringShown(first);
      Alert.alert('Tracked', 'Offering Shown');
    } catch (e) {
      showError(e);
    }
  };

  const onTrackOfferingClicked = () => {
    if (!requireCampaign()) return;
    if (!requireOfferings()) return;
    try {
      const firstCampaign = campaigns[0]!;
      const firstOffering = offerings[0];
      console.log("offeringClicked", { experience: firstCampaign, offeringPayload: firstOffering });
      personalize.offeringClicked(firstCampaign, firstOffering);
      Alert.alert('Tracked', `Offering Clicked: ${firstCampaign.experienceKey}`);
    } catch (e) {
      showError(e);
    }
  };

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

      <TouchableOpacity style={styles.button} onPress={onFetchMeta}>
        <Text style={styles.buttonText}>Fetch Experience Meta</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onFetchExperiences}>
        <Text style={styles.buttonText}>Fetch Experiences</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onTrackExperiencesShown}>
        <Text style={styles.buttonText}>Track Experiences Shown (plural)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onTrackExperienceShown}>
        <Text style={styles.buttonText}>Track Experience Shown (singular)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onTrackExperienceClicked}>
        <Text style={styles.buttonText}>Track Experience Clicked</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onTrackOfferingsShown}>
        <Text style={styles.buttonText}>Track Offerings Shown (plural)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onTrackOfferingShown}>
        <Text style={styles.buttonText}>Track Offering Shown (singular)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onTrackOfferingClicked}>
        <Text style={styles.buttonText}>Track Offering Clicked</Text>
      </TouchableOpacity>

      {campaigns.length > 0 && (
        <Text style={styles.footer}>
          Campaigns ({campaigns.length}): {campaigns.map((c) => c.experienceKey).join(', ')}
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#088A85',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'none',
    textAlign: 'center',
  },
  footer: { marginTop: 16, fontStyle: 'italic', color: '#555' },
});

export default PersonalizeAPIs;
