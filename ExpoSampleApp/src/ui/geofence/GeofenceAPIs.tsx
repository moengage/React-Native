import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';
import ReactMoEGeofence from 'react-native-moengage-geofence';
import { WORKSPACE_ID } from '../../key';

const geofenceApiActions = [
  {
    text: 'Start Geofence',
    action: () => {
      ReactMoEGeofence.startGeofenceMonitoring(WORKSPACE_ID);
    },
  },
  {
    text: 'Stop Geofence',
    action: () => {
      ReactMoEGeofence.stopGeofenceMonitoring(WORKSPACE_ID);
    },
  },
];

const GeofenceAPIs = () => (
  <View style={{ flex: 1 }}>
    <FlatList
      data={geofenceApiActions}
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

export default GeofenceAPIs;