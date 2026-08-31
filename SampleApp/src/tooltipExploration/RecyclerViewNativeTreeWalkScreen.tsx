import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { dismissOverlay, findAndShowByNativeId } from 'react-native-moengage-tooltip-exploration';
import { explorationStyles as styles } from './styles';

const ROW_COUNT = 40;
// FlatList's Android default is initialNumToRender=10 — anything past that isn't mounted yet,
// so this row is guaranteed to have no backing native View (and no nativeID tag) until scrolled into view.
const OFFSCREEN_ROW_INDEX = 30;

const ROWS = Array.from({ length: ROW_COUNT }, (_, index) => ({
  id: index,
  nativeId: `recycler_row_${index}`,
  title: `Row ${index}`,
}));

export default function RecyclerViewNativeTreeWalkScreen() {
  const [status, setStatus] = useState('Idle');

  const showTooltipForRow = (nativeId: string, title: string) => {
    findAndShowByNativeId(nativeId, `Tooltip on ${title}`);
    setStatus(
      `Requested tooltip for nativeID="${nativeId}". If nothing appears, check Logcat for ` +
        'MoETooltipNativeTreeWalk — the row may be clipped (removeClippedSubviews) or not yet mounted.',
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Same native tree walk as the plain screen, now inside a FlatList (RN's RecyclerView-style
        list). Tap a visible row to anchor a tooltip to that exact row's real view. Two things to
        watch: (1) the tooltip is a one-shot overlay — it does not track scroll, so scrolling after
        it appears leaves it behind at its original screen position; (2) FlatList on Android defaults
        `removeClippedSubviews` to true, which detaches a row's native View from the tree as soon as
        it scrolls out of the clipping rect — the walk stops finding it even though React still
        considers the row mounted.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          showTooltipForRow(
            ROWS[OFFSCREEN_ROW_INDEX].nativeId,
            ROWS[OFFSCREEN_ROW_INDEX].title,
          )
        }
      >
        <Text style={styles.buttonText}>
          Try Row {OFFSCREEN_ROW_INDEX} (off-screen, not yet mounted)
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          dismissOverlay();
          setStatus('Dismissed');
        }}
      >
        <Text style={styles.buttonText}>Dismiss</Text>
      </TouchableOpacity>
      <Text style={styles.status}>Status: {status}</Text>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={ROWS}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            nativeID={item.nativeId}
            style={styles.row}
            onPress={() => showTooltipForRow(item.nativeId, item.title)}
          >
            <Text style={styles.rowText}>{item.title}</Text>
            <Text style={styles.rowSubText}>nativeID="{item.nativeId}" — tap to anchor tooltip</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
