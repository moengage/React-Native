import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { dismissOverlay, findAndShowToolTipByNativeId } from 'react-native-moengage-tooltip-exploration';
import { explorationStyles as styles } from './styles';

const ROW_COUNT = 40;
// Visible without scrolling (well inside FlatList's initialNumToRender default of 10) — the
// tooltip starts anchored to a row that's already on screen; scrolling afterwards is what
// exercises the two tracking scenarios below.
const TARGET_ROW_INDEX = 3;

const ROWS = Array.from({ length: ROW_COUNT }, (_, index) => ({
  id: index,
  nativeId: `tt_scroll_row_${index}`,
  title: `Row ${index}`,
}));

const TARGET = ROWS[TARGET_ROW_INDEX];

/**
 * Demonstrates the two RecyclerView/FlatList tracking scenarios from `recyclerview-tooltip-handling.md`
 * (repo root), implemented in `MoETooltipHelper`/`ListAnchorTracker` (MoEngage-Android-SDK/tooltip 1.0.8+):
 *
 *  - Scenario A (item moves): scroll slowly after starting — the tooltip bubble should keep
 *    following Row {TARGET_ROW_INDEX} instead of staying pinned at its original screen position.
 *  - Scenario B (item leaves the window): keep scrolling until the target row is clipped out
 *    (`removeClippedSubviews`) or unmounted (past FlatList's render window) — the bubble hides
 *    (via TooltipManager.setHidden, not a dismiss) and reappears the moment the row scrolls back
 *    into view.
 */
export default function TooltipScrollTrackingScreen() {
  const [status, setStatus] = useState('Idle');

  return (
    <View style={styles.container}>
      <Text nativeID="tt_scroll_description" testID="tt_scroll_description" style={styles.description}>
        Tap Show, then scroll the list. Scenario A: scroll a little — the tooltip bubble should
        move with Row {TARGET_ROW_INDEX}. Scenario B: keep scrolling until Row {TARGET_ROW_INDEX}
        is off screen — the bubble should disappear (not dismiss), then reappear when you scroll
        back to it.
      </Text>
      <TouchableOpacity
        nativeID="tt_scroll_button_show"
        testID="tt_scroll_button_show"
        style={styles.button}
        onPress={() => {
          findAndShowToolTipByNativeId(TARGET.nativeId, `Scroll-tracked: ${TARGET.title}`);
          setStatus(`Showing on ${TARGET.nativeId}`);
        }}
      >
        <Text style={styles.buttonText}>Show Tooltip on Row {TARGET_ROW_INDEX}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        nativeID="tt_scroll_button_dismiss"
        testID="tt_scroll_button_dismiss"
        style={styles.button}
        onPress={() => {
          dismissOverlay();
          setStatus('Dismissed');
        }}
      >
        <Text style={styles.buttonText}>Dismiss</Text>
      </TouchableOpacity>
      <Text nativeID="tt_scroll_status" testID="tt_scroll_status" style={styles.status}>
        Status: {status}
      </Text>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={ROWS}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View
            nativeID={item.nativeId}
            testID={item.nativeId}
            style={[styles.row, item.id === TARGET_ROW_INDEX && { backgroundColor: '#088A85' }]}
          >
            <Text
              style={[styles.rowText, item.id === TARGET_ROW_INDEX && { color: '#FFFFFF' }]}
            >
              {item.title}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
