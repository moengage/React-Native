import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { explorationStyles as styles } from './styles';

const NUDGE_TYPES = [
  { key: 'TooltipMenuScreen', title: 'Tooltip' },
  { key: 'BeaconScreen', title: 'Beacon' },
  { key: 'WalkthroughScreen', title: 'Walkthrough' },
  { key: 'SpotlightScreen', title: 'Spotlight' },
  { key: 'CoachmarkScreen', title: 'Coachmark' },
  { key: 'TooltipScrollTrackingScreen', title: 'Tooltip in a Scrolling List' },
];

export default function TooltipExplorationMenuScreen({ navigation }: any) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text nativeID="nudge_menu_description" testID="nudge_menu_description" style={styles.description}>
        Five nudge types, six pages — pick one to try it live (Tooltip has both a plain demo and
        a scrolling-list scroll-tracking demo).
      </Text>
      {NUDGE_TYPES.map((type) => (
        <TouchableOpacity
          key={type.key}
          nativeID={`nudge_menu_button_${type.key}`}
          testID={`nudge_menu_button_${type.key}`}
          style={styles.button}
          onPress={() => navigation.navigate(type.key)}
        >
          <Text style={styles.buttonText}>{type.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
