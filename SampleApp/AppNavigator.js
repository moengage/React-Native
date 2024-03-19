import React from 'react';
import HomeScreen from "./HomeScreen";
import DetailScreen from "./DetailScreen";
import InAppDetailScreen from "./InAppDetailScreen";
import InboxDetailScreen from "./InboxDetailScreen";
import SelfHandledCampaign from "./SelfHandledCampaign";
import TrackEvent from "./TrackEvent";
import UserAttribute from "./UserAttribute";
import PushNotification from "./PushNotification";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './RootNavigation';
import { CardsScreen } from './src/component/CardsScreen';
import { SelfHandledCardUI } from './src/component/SelfHandledCardUI';
import ShowNudgeScreen from './ShowNudgeScreen';

const Stack = createNativeStackNavigator()

export default AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: '#088A85',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} 
      initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} headerTitle="Home Screen"/>
        <Stack.Screen name="InAppDetailScreen" component={InAppDetailScreen} headerTitle="SelfHandled Campaigns"/>
        <Stack.Screen name="InboxDetailScreen" component={InboxDetailScreen} headerTitle="Inbox"/>
        <Stack.Screen name="TrackEvent" component={TrackEvent} headerTitle="Track Events"/>
        <Stack.Screen name="UserAttribute" component={UserAttribute} headerTitle="User Attributes"/>
        <Stack.Screen name="PushNotification" component={PushNotification} headerTitle="Push Notification"/>
        <Stack.Screen name="DetailScreen" component={DetailScreen} headerTitle="InApp"/>
        <Stack.Screen name="SelfHandledCampaign" component={SelfHandledCampaign} headerTitle="Self Handled Cards"/>
        <Stack.Screen name="CardsScreen" component={CardsScreen} headerTitle="Cards" />
        <Stack.Screen name="SelfHandledCardUI" component={SelfHandledCardUI} headerTitle="Self-Handled Cards UI" />
        <Stack.Screen name="ShowNudgeScreen" component={ ShowNudgeScreen } headerTitle="Show Nudge" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}