import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  dismissWalkthrough,
  startWalkthroughByNativeIds,
} from 'react-native-moengage-tooltip-exploration';
import { explorationStyles as styles } from './styles';

const STEPS = [
  { nativeId: 'wt_step_1', title: 'Settings', label: 'Settings' },
  { nativeId: 'wt_step_2', title: 'Cart', label: 'Cart' },
  { nativeId: 'wt_step_3', title: 'Notifications', label: 'Notifications' },
];

export default function WalkthroughScreen() {
  const [status, setStatus] = useState('Idle');

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        JS only tags each step's element with nativeID and calls one native function with the
        ordered list — native resolves each view, shows one tooltip per step, and advances on tap
        entirely on its own.
      </Text>
      {STEPS.map((step) => (
        <View key={step.nativeId} nativeID={step.nativeId} style={styles.anchor}>
          <Text style={styles.anchorText}>{step.title}</Text>
        </View>
      ))}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          startWalkthroughByNativeIds(
            STEPS.map((step) => step.nativeId),
            STEPS.map((step) => step.label),
          );
          setStatus('Started');
        }}
      >
        <Text style={styles.buttonText}>Start Walkthrough</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          dismissWalkthrough();
          setStatus('Dismissed');
        }}
      >
        <Text style={styles.buttonText}>Dismiss</Text>
      </TouchableOpacity>
      <Text style={styles.status}>Status: {status}</Text>
    </View>
  );
}
