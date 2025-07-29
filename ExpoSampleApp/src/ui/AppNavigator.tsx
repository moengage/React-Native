import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import CardsAPIs from './cards/CardsAPIs';
import CoreAPIs from './core/CoreAPIs';
import GeofenceAPIs from './geofence/GeofenceAPIs';
import InAppAPIs from './core/InAppAPIs';
import InboxAPIs from './inbox/InboxAPIs';
import PushAPIs from './core/PushAPIs';
import HomeScreen from './HomeScreen';
import { SelfHandledCardUI } from './cards/SelfHandledCardUI';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationIndependentTree>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#088A85' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
        initialRouteName="HomeScreen"
      >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="CardsAPIs" component={CardsAPIs} />
        <Stack.Screen name="CoreAPIs" component={CoreAPIs} />
        <Stack.Screen name="GeofenceAPIs" component={GeofenceAPIs} />
        <Stack.Screen name="InAppAPIs" component={InAppAPIs} />
        <Stack.Screen name="InboxAPIs" component={InboxAPIs} />
        <Stack.Screen name="PushAPIs" component={PushAPIs} />
        <Stack.Screen name="SelfHandledCardUI" component={SelfHandledCardUI} />
      </Stack.Navigator>
    </NavigationIndependentTree>
  );
}

export default AppNavigator;