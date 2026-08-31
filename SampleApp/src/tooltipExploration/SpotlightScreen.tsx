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
      <Text nativeID="spotlight_description" testID="spotlight_description" style={styles.description}>
        JS only tags the element with nativeID and calls one native function — native resolves the
        view and draws the full-screen dim scrim with a cutout around it. Tap anywhere to dismiss.
      </Text>
      <View nativeID="spotlight_target" testID="spotlight_target" style={styles.anchor}>
        <Text style={styles.anchorText}>Checkout Button</Text>
      </View>
      <TouchableOpacity
        nativeID="spotlight_button_show"
        testID="spotlight_button_show"
        style={styles.button}
        onPress={() => {
          findAndShowSpotlightByNativeId('spotlight_target');
          setStatus('Shown');
        }}
      >
        <Text style={styles.buttonText}>Show Spotlight</Text>
      </TouchableOpacity>
      <TouchableOpacity
        nativeID="spotlight_button_dismiss"
        testID="spotlight_button_dismiss"
        style={styles.button}
        onPress={() => {
          dismissSpotlight();
          setStatus('Dismissed');
        }}
      >
        <Text style={styles.buttonText}>Dismiss</Text>
      </TouchableOpacity>
      <Text nativeID="spotlight_status" testID="spotlight_status" style={styles.status}>
        Status: {status}
      </Text>
    </View>
  );
}
