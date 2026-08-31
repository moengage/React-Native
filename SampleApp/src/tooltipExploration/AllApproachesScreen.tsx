import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  TooltipAnchorView,
  dismissFloatingWindowOverlay,
  dismissOverlay,
  findAndShowToolTipByAccessibilityLabel,
  findAndShowToolTipByNativeId,
} from 'react-native-moengage-tooltip-exploration';
import { explorationStyles as styles } from './styles';

type Approach = 'fabricViewManager' | 'nativeIdWalk' | 'accessibilityLabelWalk';

const APPROACHES: { key: Approach; label: string }[] = [
  { key: 'fabricViewManager', label: 'Fabric\nViewManager' },
  { key: 'nativeIdWalk', label: 'nativeID\nwalk' },
  { key: 'accessibilityLabelWalk', label: 'a11yLabel\nwalk' },
];

export default function AllApproachesScreen() {
  const [approach, setApproach] = useState<Approach>('fabricViewManager');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text nativeID="all_approaches_description" testID="all_approaches_description" style={styles.description}>
        All three anchor-resolution "ways" from one screen — switch tabs to compare how each finds
        its target and renders its tooltip. Every anchor below is functionally identical (a labelled
        box); only the resolution mechanism and rendering surface differ.
      </Text>

      <View style={styles.segmentRow}>
        {APPROACHES.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            nativeID={`segment_button_${key}`}
            testID={`segment_button_${key}`}
            style={[styles.segmentButton, approach === key && styles.segmentButtonActive]}
            onPress={() => setApproach(key)}
          >
            <Text style={[styles.segmentText, approach === key && styles.segmentTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {approach === 'fabricViewManager' && <FabricViewManagerSection />}
      {approach === 'nativeIdWalk' && <NativeIdWalkSection />}
      {approach === 'accessibilityLabelWalk' && <AccessibilityLabelWalkSection />}
    </ScrollView>
  );
}

function FabricViewManagerSection() {
  const [label, setLabel] = useState<string | undefined>(undefined);

  return (
    <View>
      <Text nativeID="fabric_view_manager_description" testID="fabric_view_manager_description" style={styles.description}>
        Mounts a real registered ViewManager (MoETooltipAnchorView) inside the RN tree — the tooltip
        is embedded via the anchor's own native overlay, not floated over the screen. Relies on RN's
        Fabric interop layer for a non-codegen'd ViewManager.
      </Text>
      <TooltipAnchorView
        nativeID="fabric_anchor_target"
        testID="fabric_anchor_target"
        tooltipLabel={label}
        style={styles.anchor}
      >
        <Text style={styles.anchorText}>Anchor Target</Text>
      </TooltipAnchorView>
      <TouchableOpacity
        nativeID="fabric_button_show"
        testID="fabric_button_show"
        style={styles.button}
        onPress={() => setLabel('Tooltip via Fabric ViewManager')}
      >
        <Text style={styles.buttonText}>Show Tooltip</Text>
      </TouchableOpacity>
      <TouchableOpacity
        nativeID="fabric_button_dismiss"
        testID="fabric_button_dismiss"
        style={styles.button}
        onPress={() => setLabel(undefined)}
      >
        <Text style={styles.buttonText}>Dismiss</Text>
      </TouchableOpacity>
      <Text nativeID="fabric_status" testID="fabric_status" style={styles.status}>
        Status: {label ? 'Shown' : 'Idle'}
      </Text>
    </View>
  );
}

function NativeIdWalkSection() {
  const [status, setStatus] = useState('Idle');

  return (
    <View>
      <Text nativeID="native_id_walk_description" testID="native_id_walk_description" style={styles.description}>
        No ref, no measure call from JS — native recursively walks the real Android view tree
        looking for a View tagged nativeID="tooltip_target", resolves its current on-screen rect,
        and renders a tooltip bubble into the Activity's content view.
      </Text>
      <View nativeID="tooltip_target" testID="tooltip_target" style={styles.anchor}>
        <Text style={styles.anchorText}>Anchor Target (nativeID)</Text>
      </View>
      <TouchableOpacity
        nativeID="native_id_walk_button_show"
        testID="native_id_walk_button_show"
        style={styles.button}
        onPress={() => {
          findAndShowToolTipByNativeId('tooltip_target', 'Tooltip via native tree walk');
          setStatus('Shown');
        }}
      >
        <Text style={styles.buttonText}>Show Tooltip</Text>
      </TouchableOpacity>
      <TouchableOpacity
        nativeID="native_id_walk_button_dismiss"
        testID="native_id_walk_button_dismiss"
        style={styles.button}
        onPress={() => {
          dismissOverlay();
          setStatus('Dismissed');
        }}
      >
        <Text style={styles.buttonText}>Dismiss</Text>
      </TouchableOpacity>
      <Text nativeID="native_id_walk_status" testID="native_id_walk_status" style={styles.status}>
        Status: {status}
      </Text>
    </View>
  );
}

function AccessibilityLabelWalkSection() {
  const [status, setStatus] = useState('Idle');

  return (
    <View>
      <Text nativeID="a11y_walk_description" testID="a11y_walk_description" style={styles.description}>
        Same walk, matching on contentDescription (RN's accessibilityLabel prop) instead of a
        dedicated tag, rendered through a floating WindowManager window instead of the decor view.
      </Text>
      <View
        accessibilityLabel="tooltip_target"
        nativeID="a11y_anchor_target"
        testID="a11y_anchor_target"
        style={styles.anchor}
      >
        <Text style={styles.anchorText}>Anchor Target (accessibilityLabel)</Text>
      </View>
      <TouchableOpacity
        nativeID="a11y_walk_button_show"
        testID="a11y_walk_button_show"
        style={styles.button}
        onPress={() => {
          findAndShowToolTipByAccessibilityLabel('tooltip_target', 'Tooltip via accessibility label walk');
          setStatus('Shown');
        }}
      >
        <Text style={styles.buttonText}>Show Tooltip</Text>
      </TouchableOpacity>
      <TouchableOpacity
        nativeID="a11y_walk_button_dismiss"
        testID="a11y_walk_button_dismiss"
        style={styles.button}
        onPress={() => {
          dismissFloatingWindowOverlay();
          setStatus('Dismissed');
        }}
      >
        <Text style={styles.buttonText}>Dismiss</Text>
      </TouchableOpacity>
      <Text nativeID="a11y_walk_status" testID="a11y_walk_status" style={styles.status}>
        Status: {status}
      </Text>
    </View>
  );
}
