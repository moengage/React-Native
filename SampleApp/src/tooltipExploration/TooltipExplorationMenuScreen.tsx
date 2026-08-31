import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { explorationStyles as styles } from './styles';

const NUDGE_TYPES = [
  { key: 'TooltipMenuScreen', title: 'Tooltip' },
  { key: 'BeaconScreen', title: 'Beacon' },
  { key: 'WalkthroughScreen', title: 'Walkthrough' },
  { key: 'SpotlightScreen', title: 'Spotlight' },
  { key: 'CoachmarkScreen', title: 'Coachmark' },
];

export default function TooltipExplorationMenuScreen({ navigation }: any) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.description}>
        Five nudge types, five separate pages — pick one to try it live.
      </Text>
      {NUDGE_TYPES.map((type) => (
        <TouchableOpacity
          key={type.key}
          style={styles.button}
          onPress={() => navigation.navigate(type.key)}
        >
          <Text style={styles.buttonText}>{type.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
