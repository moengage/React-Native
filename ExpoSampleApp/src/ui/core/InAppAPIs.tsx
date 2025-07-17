import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import ReactMoE, { MoEngageNudgePosition } from 'react-native-moengage';

const inAppApiActions = [
  {
    text: 'Show InApp',
    action: () => {
      ReactMoE.showInApp();
    },
  },
  {
    text: 'Set Context',
    action: () => {
      ReactMoE.setCurrentContext(['a', 'b']);
    },
  },
  {
    text: 'Reset Context',
    action: () => {
      ReactMoE.resetCurrentContext();
    },
  },
  {
    text: 'Show Nudge (Position)',
    action: () => {
      ReactMoE.showNudge();
      ReactMoE.showNudge(MoEngageNudgePosition.Top);
    },
  },
];

const InAppAPIs = () => (
  <View style={{ flex: 1 }}>
    <FlatList
      data={inAppApiActions}
      keyExtractor={(_, idx) => idx.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <TouchableOpacity
            style={styles.button}
            onPress={item.action}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>{item.text}</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  item: {
    marginTop: 20,
    marginStart: 14,
    marginEnd: 14,
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  button: {
    padding: 12,
    backgroundColor: '#088A85',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'none',
  },
});

export default InAppAPIs;