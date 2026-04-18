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

// Extract offering_context from campaign payload. Returns null if not available.
const extractOfferingAttributes = (campaign: ExperienceCampaign): Record<string, any> | null => {
  try {
    const offeringsRaw = campaign?.payload?.offerings;
    if (typeof offeringsRaw === 'string') {
      const offerings = JSON.parse(offeringsRaw);
      if (Array.isArray(offerings) && offerings.length > 0) {
        const context = offerings[0]?.offering_context;
        if (context && typeof context === 'object' && Object.keys(context).length > 0) {
          return context;
        }
      }
    }
  } catch (_) {
    // parsing failed
  }
  return null;
};

const parseList = (s: string): string[] =>
  s.split(',').map((x) => x.trim()).filter(Boolean);

const PersonalizeAPIs = () => {
  const [statusInput, setStatusInput] = useState('active');
  const [keysInput, setKeysInput] = useState('');
  const [lastCampaign, setLastCampaign] = useState<ExperienceCampaign | null>(null);
  const [offeringAttrs, setOfferingAttrs] = useState<Record<string, any> | null>(null);

  const showError = (e: any) => Alert.alert('Error', e?.message || String(e));

  const requireCampaign = (): boolean => {
    if (!lastCampaign) {
      Alert.alert('No campaign', "Run 'Fetch Experiences' first to obtain a campaign to track.");
      return false;
    }
    return true;
  };

  const requireOfferingAttrs = (): boolean => {
    if (!offeringAttrs) {
      Alert.alert(
        'No offering attributes',
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
      if (result.experiences.length > 0) {
        const campaign = result.experiences[0];
        setLastCampaign(campaign);
        setOfferingAttrs(extractOfferingAttributes(campaign));
      }
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

  const onTrackExperienceShown = () => {
    if (!requireCampaign()) return;
    try {
      personalize.trackExperienceShown([lastCampaign!]);
      Alert.alert('Tracked', `Experience Shown: ${lastCampaign!.experienceKey}`);
    } catch (e) {
      showError(e);
    }
  };

  const onTrackExperienceClicked = () => {
    if (!requireCampaign()) return;
    try {
      personalize.trackExperienceClicked(lastCampaign!);
      Alert.alert('Tracked', `Experience Clicked: ${lastCampaign!.experienceKey}`);
    } catch (e) {
      showError(e);
    }
  };

  const onTrackOfferingShown = () => {
    if (!requireOfferingAttrs()) return;
    try {
      personalize.trackOfferingShown([offeringAttrs!]);
      Alert.alert('Tracked', 'Offering Shown');
    } catch (e) {
      showError(e);
    }
  };

  const onTrackOfferingClicked = () => {
    if (!requireCampaign()) return;
    if (!requireOfferingAttrs()) return;
    try {
      personalize.trackOfferingClicked(lastCampaign!, offeringAttrs!);
      Alert.alert('Tracked', `Offering Clicked: ${lastCampaign!.experienceKey}`);
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
      <TouchableOpacity style={styles.button} onPress={onTrackExperienceShown}>
        <Text style={styles.buttonText}>Track Experience Shown</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onTrackExperienceClicked}>
        <Text style={styles.buttonText}>Track Experience Clicked</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onTrackOfferingShown}>
        <Text style={styles.buttonText}>Track Offering Shown</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onTrackOfferingClicked}>
        <Text style={styles.buttonText}>Track Offering Clicked</Text>
      </TouchableOpacity>

      {lastCampaign && (
        <Text style={styles.footer}>Last campaign: {lastCampaign.experienceKey}</Text>
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
