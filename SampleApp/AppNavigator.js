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
import MultipleInAppsScreen from "./MultipleInAppsScreen"
import PersonalizeScreen from "./PersonalizeScreen";
import JwtAuthenticationScreen from "./JwtAuthenticationScreen";
import TooltipExplorationMenuScreen from './src/tooltipExploration/TooltipExplorationMenuScreen';
import TooltipMenuScreen from './src/tooltipExploration/TooltipMenuScreen';
import AllApproachesScreen from './src/tooltipExploration/AllApproachesScreen';
import RecyclerViewNativeTreeWalkScreen from './src/tooltipExploration/RecyclerViewNativeTreeWalkScreen';
import NativeIdFailureCasesScreen from './src/tooltipExploration/NativeIdFailureCasesScreen';
import ModalPresentationsScreen from './src/tooltipExploration/ModalPresentationsScreen';
import BeaconScreen from './src/tooltipExploration/BeaconScreen';
import WalkthroughScreen from './src/tooltipExploration/WalkthroughScreen';
import SpotlightScreen from './src/tooltipExploration/SpotlightScreen';
import CoachmarkScreen from './src/tooltipExploration/CoachmarkScreen';
import TooltipScrollTrackingScreen from './src/tooltipExploration/TooltipScrollTrackingScreen';

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
        <Stack.Screen name="MultipleInAppsScreen" component={MultipleInAppsScreen} headerTitle="MultipleInAppsScreen"/>
        <Stack.Screen name="PersonalizeScreen" component={PersonalizeScreen} headerTitle="Personalize"/>
        <Stack.Screen name="JwtAuthenticationScreen" component={JwtAuthenticationScreen} headerTitle="JWT Authentication"/>
        <Stack.Screen name="TooltipExplorationMenuScreen" component={TooltipExplorationMenuScreen} headerTitle="Tooltip Exploration"/>
        <Stack.Screen name="TooltipMenuScreen" component={TooltipMenuScreen} headerTitle="Tooltip"/>
        <Stack.Screen name="AllApproachesScreen" component={AllApproachesScreen} headerTitle="All Approaches"/>
        <Stack.Screen name="RecyclerViewNativeTreeWalkScreen" component={RecyclerViewNativeTreeWalkScreen} headerTitle="Native Tree Walk in FlatList"/>
        <Stack.Screen name="NativeIdFailureCasesScreen" component={NativeIdFailureCasesScreen} headerTitle="nativeID Failure Cases"/>
        <Stack.Screen name="ModalPresentationsScreen" component={ModalPresentationsScreen} headerTitle="Dialog & Bottom Sheet"/>
        <Stack.Screen name="BeaconScreen" component={BeaconScreen} headerTitle="Beacon"/>
        <Stack.Screen name="WalkthroughScreen" component={WalkthroughScreen} headerTitle="Walkthrough"/>
        <Stack.Screen name="SpotlightScreen" component={SpotlightScreen} headerTitle="Spotlight"/>
        <Stack.Screen name="CoachmarkScreen" component={CoachmarkScreen} headerTitle="Coachmark"/>
        <Stack.Screen name="TooltipScrollTrackingScreen" component={TooltipScrollTrackingScreen} headerTitle="Tooltip in a Scrolling List"/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}