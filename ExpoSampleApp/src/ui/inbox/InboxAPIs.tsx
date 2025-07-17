import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import MoEReactInbox from 'react-native-moengage-inbox';
import { WORKSPACE_ID } from '../../key';

const InboxAPIs = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    const inbox = await MoEReactInbox.fetchAllMessages();
    if (inbox !== undefined) {
      setMessages(inbox.messages || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    MoEReactInbox.initialize(WORKSPACE_ID);
    fetchMessages();
  }, [fetchMessages]);

  const trackClick = (message: any) => {
    MoEReactInbox.trackMessageClicked(message);
  };

  const deleteMessage = async (message: any) => {
    await MoEReactInbox.deleteMessage(message);
    fetchMessages();
  };

  const getUnClickedCount = async () => {
    const count = await MoEReactInbox.getUnClickedCount();
    Alert.alert('Unread Message Count', count.toString(), [{ text: 'OK' }]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.rowItemMainContainer}>
      <Text style={styles.rowItemText}>cid = {item.campaignId}</Text>
      <Text style={styles.rowItemText}>Title = {item.text.title}</Text>
      <Text style={styles.rowItemText}>subtitle = {item.text.subtitle}</Text>
      <Text style={styles.rowItemText}>Message = {item.text.message}</Text>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.button} onPress={() => trackClick(item)}>
            <Text style={styles.buttonText}>Track Click</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.button} onPress={() => deleteMessage(item)}>
            <Text style={styles.buttonText}>Delete Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity style={[styles.unreadButton, styles.button]} onPress={getUnClickedCount}>
        <Text style={styles.buttonText}>Show Unread Count</Text>
      </TouchableOpacity>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.campaignId as string}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, width: '100%', backgroundColor: '#add8e6', padding: 5 }} />
        )}
        refreshing={loading}
        onRefresh={fetchMessages}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f0ffff',
  },
  rowItemMainContainer: {
    minHeight: 200,
    backgroundColor: '#f0ffff',
    padding: 10,
  },
  rowItemText: {
    padding: 10,
    fontSize: 15,
    color: 'black',
  },
  text: {
    alignItems: 'center',
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'black',
    color: 'white',
  },
  buttonView: {
    padding: 10,
    flex: 1,
  },
  unreadButton: {
    margin: 10,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  unreadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    padding: 12,
    backgroundColor: '#088A85',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'none',
    textAlign: 'center',
  },
});

export default InboxAPIs;