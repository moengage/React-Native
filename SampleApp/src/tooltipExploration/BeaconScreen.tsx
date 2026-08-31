import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { dismissBeacon, findAndShowBeaconByNativeId } from 'react-native-moengage-tooltip-exploration';
import { explorationStyles as styles } from './styles';

export default function BeaconScreen() {
  const [status, setStatus] = useState('Idle');

  return (
    <View style={styles.container}>
      <Text nativeID="beacon_description" testID="beacon_description" style={styles.description}>
        JS only tags the element with nativeID and calls one native function — native resolves the
        view, draws the pulsating dot, and handles the tap-to-reveal card entirely on its own.
      </Text>
      <View nativeID="beacon_target" testID="beacon_target" style={styles.anchor}>
        <Text style={styles.anchorText}>Feature Icon</Text>
      </View>
      <TouchableOpacity
        nativeID="beacon_button_show"
        testID="beacon_button_show"
        style={styles.button}
        onPress={() => {
          findAndShowBeaconByNativeId('beacon_target', 'New: try the Feature Icon.');
          setStatus('Shown');
        }}
      >
        <Text style={styles.buttonText}>Show Beacon</Text>
      </TouchableOpacity>
      <TouchableOpacity
        nativeID="beacon_button_dismiss"
        testID="beacon_button_dismiss"
        style={styles.button}
        onPress={() => {
          dismissBeacon();
          setStatus('Dismissed');
        }}
      >
        <Text style={styles.buttonText}>Dismiss</Text>
      </TouchableOpacity>
      <Text nativeID="beacon_status" testID="beacon_status" style={styles.status}>
        Status: {status}
      </Text>
    </View>
  );
}
