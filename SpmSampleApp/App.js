/**
 * Single-screen exercise of the MoEngage React Native SDK for the SwiftPM
 * integration test app. Kept free of navigation and other community native
 * libraries on purpose — every native package in this app's graph ships its
 * own Package.swift, so `npx react-native spm` needs no scaffolding.
 *
 * Every autolinked MoEngage package gets at least one CTA below, grouped by
 * package: tapping through the whole list proves each Package.swift produced a
 * product the TurboModule actually resolves at runtime.
 */
import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ReactMoE, {
  MoEGeoLocation,
  MoEInitConfig,
  MoEProperties,
  MoEPushConfig,
} from 'react-native-moengage';
import MoEReactInbox from 'react-native-moengage-inbox';
import MoEngageCards from 'react-native-moengage-cards';
import ReactMoEGeofence from 'react-native-moengage-geofence';
import ReactMoEngagePersonalize, {
  ExperienceStatus,
} from 'react-native-moengage-personalize';

import {MOENGAGE_APP_ID} from './src/key';

const moEInitConfig = new MoEInitConfig(new MoEPushConfig(true));

// Personalize is instance-scoped to a workspace, unlike the other modules.
const personalize = new ReactMoEngagePersonalize(MOENGAGE_APP_ID);

export default function App() {
  const [status, setStatus] = useState('initializing SDK…');

  // Initialize on mount, like the CocoaPods SampleApp does — no button needed.
  useEffect(() => {
    try {
      ReactMoE.initialize(MOENGAGE_APP_ID, moEInitConfig);
      setStatus('SDK initialized');
    } catch (e) {
      setStatus(`initialize failed: ${e.message}`);
    }
  }, []);

  const run = (label, fn) => async () => {
    try {
      const result = await fn();
      setStatus(result != null ? `${label}: ${result}` : `${label} ✓`);
    } catch (e) {
      setStatus(`${label} failed: ${e.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text style={styles.title}>MoEngage · Swift Package Manager</Text>
        <Text style={styles.status}>{status}</Text>

        <View style={styles.section}>
          <Text style={styles.heading}>react-native-moengage</Text>
          <Button
            title="Track Event"
            onPress={run('trackEvent', () => {
              const properties = new MoEProperties();
              properties.addAttribute('source', 'spm-sample');
              ReactMoE.trackEvent('SPM_Sample_Event', properties);
            })}
          />
          <Button
            title="Set User Attribute"
            onPress={run('setUserAttribute', () =>
              ReactMoE.setUserAttribute('sampleAppVariant', 'spm'),
            )}
          />
          <Button
            title="Set Last Known Location"
            onPress={run('setUserLocation', () =>
              ReactMoE.setUserAttributeLocation(
                'last known location',
                new MoEGeoLocation(12.97, 77.59),
              ),
            )}
          />
          <Button
            title="Show InApp"
            onPress={run('showInApp', () => ReactMoE.showInApp())}
          />
          <Button
            title="Register for Push"
            onPress={run('registerForPush', () => ReactMoE.registerForPush())}
          />
          <Button
            title="Logout"
            onPress={run('logout', () => ReactMoE.logout())}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>react-native-moengage-inbox</Text>
          <Button
            title="Inbox: Unclicked Count"
            onPress={run('inboxUnclickedCount', async () => {
              MoEReactInbox.initialize(MOENGAGE_APP_ID);
              return await MoEReactInbox.getUnClickedCount();
            })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>react-native-moengage-cards</Text>
          <Button
            title="Cards: Refresh"
            onPress={run('cardsRefresh', () => {
              MoEngageCards.initialize(MOENGAGE_APP_ID);
              MoEngageCards.refreshCards();
            })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>react-native-moengage-geofence</Text>
          <Button
            // Prompts for location permission on iOS when not already granted.
            title="Geofence: Start Monitoring"
            onPress={run('geofenceStartMonitoring', () =>
              ReactMoEGeofence.startGeofenceMonitoring(MOENGAGE_APP_ID),
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>react-native-moengage-personalize</Text>
          <Button
            title="Personalize: Fetch Experiences Meta"
            onPress={run('fetchExperiencesMeta', async () => {
              const meta = await personalize.fetchExperiencesMeta([
                ExperienceStatus.ACTIVE,
              ]);
              return `${meta.experiences.length} active (${meta.source})`;
            })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  title: {fontSize: 20, fontWeight: '600', margin: 16},
  status: {marginHorizontal: 16, marginBottom: 8, color: '#555'},
  section: {marginHorizontal: 16, marginBottom: 20, gap: 8},
  heading: {fontSize: 13, fontWeight: '600', color: '#888'},
});
