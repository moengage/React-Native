import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  dismissSpotlight,
  findAndShowSpotlightByNativeId,
} from 'react-native-moengage-tooltip-exploration';
import { explorationStyles as styles } from './styles';

export default function SpotlightScreen() {
  const [status, setStatus] = useState('Idle');

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        JS only tags the element with nativeID and calls one native function — native resolves the
        view and draws the full-screen dim scrim with a cutout around it. Tap anywhere to dismiss.
      </Text>
      <View nativeID="spotlight_target" style={styles.anchor}>
        <Text style={styles.anchorText}>Checkout Button</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          findAndShowSpotlightByNativeId('spotlight_target');
          setStatus('Shown');
        }}
      >
        <Text style={styles.buttonText}>Show Spotlight</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          dismissSpotlight();
          setStatus('Dismissed');
        }}
      >
        <Text style={styles.buttonText}>Dismiss</Text>
      </TouchableOpacity>
      <Text style={styles.status}>Status: {status}</Text>
    </View>
  );
}
