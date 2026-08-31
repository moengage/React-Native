import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  dismissCoachmark,
  startCoachmarkByNativeIds,
} from 'react-native-moengage-tooltip-exploration';
import { explorationStyles as styles } from './styles';

const STEPS = [
  { nativeId: 'cm_step_1', title: 'Search', body: 'Find anything from here.' },
  { nativeId: 'cm_step_2', title: 'Profile', body: 'Manage your account here.' },
];

export default function CoachmarkScreen() {
  const [status, setStatus] = useState('Idle');

  return (
    <View style={styles.container}>
      <Text nativeID="coachmark_description" testID="coachmark_description" style={styles.description}>
        JS only tags each step's element with nativeID and calls one native function with the
        ordered lists — native resolves each view, dims the screen, lifts that step above the scrim
        (no cutout), and advances on tap entirely on its own.
      </Text>
      {STEPS.map((step, index) => (
        <View
          key={step.nativeId}
          nativeID={step.nativeId}
          testID={step.nativeId}
          style={[styles.anchor, { backgroundColor: index === 0 ? '#088A85' : '#222222' }]}
        >
          <Text
            nativeID={`${step.nativeId}_text`}
            testID={`${step.nativeId}_text`}
            style={styles.anchorText}
          >
            {step.title}
          </Text>
        </View>
      ))}
      <TouchableOpacity
        nativeID="coachmark_button_start"
        testID="coachmark_button_start"
        style={styles.button}
        onPress={() => {
          startCoachmarkByNativeIds(
            STEPS.map((step) => step.nativeId),
            STEPS.map((step) => step.title),
            STEPS.map((step) => step.body),
          );
          setStatus('Started');
        }}
      >
        <Text style={styles.buttonText}>Start Coachmark</Text>
      </TouchableOpacity>
      <TouchableOpacity
        nativeID="coachmark_button_dismiss"
        testID="coachmark_button_dismiss"
        style={styles.button}
        onPress={() => {
          dismissCoachmark();
          setStatus('Dismissed');
        }}
      >
        <Text style={styles.buttonText}>Dismiss</Text>
      </TouchableOpacity>
      <Text nativeID="coachmark_status" testID="coachmark_status" style={styles.status}>
        Status: {status}
      </Text>
    </View>
  );
}
