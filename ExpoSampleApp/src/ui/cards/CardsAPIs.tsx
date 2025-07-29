import React, { useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import CardsHelper from '../../utils/CardsHelper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const cardHelper = new CardsHelper();

type CardsAPIsProps = {
  navigation: NativeStackNavigationProp<any>;
};

const CardsScreenClickableList = [
  {
    id: 0,
    title: 'New Card Count',
    action: () => cardHelper.getNewCardCount(),
  },
  {
    id: 1,
    title: 'UnClicked Card Count',
    action: () => cardHelper.getUnClickedCount(),
  },
  {
    id: 2,
    title: 'Cards Category',
    action: () => cardHelper.getCardsCategory(),
  },
  {
    id: 3,
    title: 'Is All Category Enabled',
    action: () => cardHelper.isAllCategoryEnabled(),
  },
  {
    id: 4,
    title: 'Refresh Cards',
    action: () => cardHelper.refreshCards(),
  },
  {
    id: 5,
    title: 'Cards UI',
    action: (props: CardsAPIsProps) => props.navigation.navigate('SelfHandledCardUI'),
  },
  {
    id: 6,
    title: 'Fetch Cards',
    action: () => cardHelper.fetchCards(),
  },
  {
    id: 7,
    title: 'Card Delivered',
    action: () => cardHelper.cardDelivered(),
  },
];

export const CardsAPIs = (props: CardsAPIsProps) => {
  useEffect(() => {
    cardHelper.initialise();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={CardsScreenClickableList}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => item.action(props)}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>{item.title}</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

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

export default CardsAPIs;