import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, SafeAreaView, Alert, AppState } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ReactMoE, { 
  MoEProperties, 
  MoEGeoLocation, 
  MoEAppStatus, 
  MoEInitConfig, 
  MoEPushConfig,
  MoEngageLogConfig,
  MoEngageLogLevel,
  MoEAnalyticsConfig
} from 'react-native-moengage';
import ReactMoEngageCards from 'react-native-moengage-cards';
import { MOENGAGE_APP_ID } from './src/key';
import CardsHelper from './src/CardsHelper';

export default function App() {
  const [newCardsCount, setNewCardsCount] = useState(0);
  const [unclickedCardsCount, setUnclickedCardsCount] = useState(0);
  const appState = useRef(AppState.currentState);
  const cardsHelper = new CardsHelper();

  useEffect(() => {
    // Initialize MoEngage SDK
    initializeMoEngage();
    
    // Set up event listeners for MoEngage SDK events
    setupEventListeners();
    
    // Initialize Cards Feature
    initializeCards();
    
    // Setup AppState change listener for Android
    const appStateListener = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
        // Reinitialize MoEngage SDK for Android
        ReactMoE.initialize(MOENGAGE_APP_ID, getInitConfig());
      }
      appState.current = nextAppState;
    });
    
    return () => {
      // Clean up event listeners when component unmounts
      removeEventListeners();
      appStateListener.remove();
    };
  }, []);

  const getInitConfig = () => {
    return new MoEInitConfig(
      new MoEPushConfig(true), // Enable push notifications
      new MoEngageLogConfig(MoEngageLogLevel.VERBOSE, true), // Enable verbose logging
      new MoEAnalyticsConfig(false) // Disable analytics tracking initially
    );
  };

  const initializeMoEngage = () => {
    // Initialize MoEngage SDK with app ID and config
    ReactMoE.initialize(MOENGAGE_APP_ID, getInitConfig());
    
    // Set app status as install (for new installations)
    ReactMoE.setAppStatus(MoEAppStatus.Install);
  };
  
  const initializeCards = () => {
    // Initialize MoEngage Cards feature
    cardsHelper.initialise();
    
    // Update cards counts
    updateCardCounts();
  };
  
  const updateCardCounts = async () => {
    const newCount = await cardsHelper.getNewCardCount();
    const unclickedCount = await cardsHelper.getUnClickedCount();
    
    setNewCardsCount(newCount);
    setUnclickedCardsCount(unclickedCount);
  };
  
  const setupEventListeners = () => {
    // Listen for push notifications
    ReactMoE.setEventListener("pushClicked", (payload) => {
      console.log("Push notification clicked:", payload);
      Alert.alert("Push Clicked", JSON.stringify(payload));
    });
    
    // Listen for push token generation
    ReactMoE.setEventListener("pushTokenGenerated", (token) => {
      console.log("Push token generated:", token);
    });
    
    // Listen for in-app campaign shown events
    ReactMoE.setEventListener("inAppCampaignShown", (inAppInfo) => {
      console.log("In-app campaign shown:", inAppInfo);
    });
    
    // Listen for in-app campaign click events
    ReactMoE.setEventListener("inAppCampaignClicked", (inAppInfo) => {
      console.log("In-app campaign clicked:", inAppInfo);
    });

    // Listen for in-app campaign dismissed events
    ReactMoE.setEventListener("inAppCampaignDismissed", (inAppInfo) => {
      console.log("In-app campaign dismissed:", inAppInfo);
    });

    // Listen for self-handled in-app campaign events
    ReactMoE.setEventListener("inAppCampaignSelfHandled", (payload) => {
      console.log("In-app campaign self-handled:", payload);
      if (payload && Object.keys(payload).length !== 0) {
        Alert.alert(
          "Self Handled Campaign",
          `Campaign ID: ${payload.campaignData.campaignId}\nCampaign Name: ${payload.campaignData.campaignName}`
        );
      }
    });
  };
  
  const removeEventListeners = () => {
    ReactMoE.removeEventListener("pushClicked");
    ReactMoE.removeEventListener("pushTokenGenerated");
    ReactMoE.removeEventListener("inAppCampaignShown");
    ReactMoE.removeEventListener("inAppCampaignClicked");
    ReactMoE.removeEventListener("inAppCampaignDismissed");
    ReactMoE.removeEventListener("inAppCampaignSelfHandled");
  };
  
  const trackEvent = () => {
    // Create properties object
    const properties = new MoEProperties();
    properties.addAttribute("string_attribute", "test_string");
    properties.addAttribute("number_attribute", 123456);
    properties.addAttribute("boolean_attribute", true);
    properties.addDateTimeAttribute("date_attribute", new Date());
    
    // Track event with properties
    ReactMoE.trackEvent("Test_Event", properties);
    
    Alert.alert("Event Tracked", "Test_Event was tracked with properties");
  };
  
  const setUserAttribute = () => {
    // Set unique ID for the user
    ReactMoE.setUserUniqueID("test_user_id");
    
    // Set user attributes
    ReactMoE.setUserName("Test User");
    ReactMoE.setUserFirstName("Test");
    ReactMoE.setUserLastName("User");
    ReactMoE.setUserEmailID("test@example.com");
    ReactMoE.setUserContactNumber("1234567890");
    
    // Set gender (1 for male, 2 for female)
    ReactMoE.setUserGender(1);
    
    // Set location
    const location = new MoEGeoLocation(37.7749, -122.4194);
    ReactMoE.setUserLocation(location);
    
    // Set custom attribute
    ReactMoE.setUserAttribute("custom_attribute", "custom_value");
    
    Alert.alert("User Attributes", "User attributes have been set");
  };
  
  const showInAppMessage = () => {
    // Show in-app message if available
    ReactMoE.showInApp();
  };

  const getSelfHandledInApp = () => {
    // Get self-handled in-app campaign
    ReactMoE.getSelfHandledInApp();
  };
  
  const fetchCards = async () => {
    try {
      // Fetch all cards
      const cardsData = await cardsHelper.fetchCards();
      
      if (cardsData && cardsData.cards.length > 0) {
        Alert.alert(
          "Cards Retrieved", 
          `Retrieved ${cardsData.cards.length} cards`
        );
      } else {
        Alert.alert("No Cards", "No cards are available");
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
      Alert.alert("Error", "Failed to fetch cards");
    }

    // Update card counts
    updateCardCounts();
  };

  const refreshCards = () => {
    cardsHelper.refreshCards();
    setTimeout(updateCardCounts, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>MoEngage Expo Example</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analytics</Text>
          <Button title="Track Event" onPress={trackEvent} />
          <View style={styles.spacer} />
          <Button title="Set User Attributes" onPress={setUserAttribute} />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>In-App Messaging</Text>
          <Button title="Show In-App Message" onPress={showInAppMessage} />
          <View style={styles.spacer} />
          <Button title="Get Self-Handled In-App" onPress={getSelfHandledInApp} />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cards</Text>
          <View style={styles.infoRow}>
            <Text>New Cards: {newCardsCount}</Text>
            <Text>Unclicked Cards: {unclickedCardsCount}</Text>
          </View>
          <Button title="Fetch Cards" onPress={fetchCards} />
          <View style={styles.spacer} />
          <Button title="Refresh Cards" onPress={refreshCards} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SDK Controls</Text>
          <Button title="Enable SDK" onPress={() => ReactMoE.enableSdk()} />
          <View style={styles.spacer} />
          <Button title="Disable SDK" onPress={() => ReactMoE.disableSdk()} />
          <View style={styles.spacer} />
          <Button title="Logout User" onPress={() => {
            ReactMoE.logout();
            Alert.alert("User Logged Out", "User has been logged out from MoEngage");
          }} />
        </View>
        
        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  spacer: {
    height: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  }
});