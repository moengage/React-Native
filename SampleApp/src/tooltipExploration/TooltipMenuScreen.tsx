import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { explorationStyles as styles } from './styles';

const WAYS = [
  { key: 'AllApproachesScreen', title: 'All resolution approaches (one screen, switchable)' },
  { key: 'RecyclerViewNativeTreeWalkScreen', title: 'nativeID walk inside a FlatList (RecyclerView-style)' },
  { key: 'NativeIdFailureCasesScreen', title: 'nativeID set but unresolvable (4 failure cases)' },
];

export default function TooltipMenuScreen({ navigation }: any) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {WAYS.map((way) => (
        <TouchableOpacity
          key={way.key}
          style={styles.button}
          onPress={() => navigation.navigate(way.key)}
        >
          <Text style={styles.buttonText}>{way.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
