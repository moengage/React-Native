import React, { PureComponent } from "react";
import AntIcon from "react-native-vector-icons/AntDesign";
import { MoEngageLogger, MoESelfHandledCampaignData } from "react-native-moengage";
import { MOENGAGE_APP_ID } from "./src/key.js";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import ReactMoE from "react-native-moengage";


export default class MultipleInAppsScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: "Multiple InApps",
      title: "Self Handled InApps List"
    };
  };

  trackClick = (campaign) => {
    ReactMoE.selfHandledInAppClicked(campaign, this.state.dataSource.accountMeta);
  }

  trackShown = (campaign) => {
    ReactMoE.selfHandledInAppShown(campaign, this.state.dataSource.accountMeta);
  }

  trackDismissed = (campaign) => {
    ReactMoE.selfHandledInAppDismissed(campaign, this.state.dataSource.accountMeta);
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: undefined
    }
  }

  async componentDidMount() {
    var selfHandledData = await ReactMoE.getSelfHandledInApps();
    MoEngageLogger.debug("selfHandled Data", selfHandledData);
    this.setState({
      isLoading: false,
      dataSource: selfHandledData
    })
  }

  flatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#add8e6",
          padding: 5
        }}
      />
    );
  }
  _renderRowItem = ({ item, index }) => {
    return (
      <View key = {index} style={styles.rowItemMainContainer} >
        <Text style={styles.rowItemText}>cid = {item.campaignData.campaignId} </Text>
        <Text style={styles.rowItemText}>CampaignName = {item.campaignData.campaignName} </Text>
        <Text style={styles.rowItemText}>Payload = {item.campaign.payload} </Text>
        <Text style={styles.rowItemText}>Contexts = {item.campaign.displayRules.contexts} </Text>

        <View style={{ flexDirection: "row" }}>
          <View style={styles.buttonView}>
            <TouchableOpacity onPress={() => this.trackShown(item)}>
              <Text style={styles.text} >Shown</Text>
            </TouchableOpacity>
          </View> 

          <View style={styles.buttonView}>
            <TouchableOpacity onPress={() => this.trackClick(item)}>
              <Text style={styles.text} >Clicked</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonView}>
            <TouchableOpacity onPress={() => this.trackDismissed(item)}>
              <Text style={styles.text} >Dismissed</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View >
    );
  };

  render() {
    let { dataSource } = this.state;
    if (dataSource ==  undefined) { return }
    return (
      <View style={styles.mainContainer}>
        <FlatList
          data={dataSource.campaigns}
          renderItem={this._renderRowItem}
          ItemSeparatorComponent={this.flatListItemSeparator}
          keyExtractor={(item) => item.campaignData.campaignId}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  rowItemMainContainer: {
    minHeight: 200,
    backgroundColor: '#f0ffff',
    padding: 10,
  },
  rowItemText: {
    padding: 10,
    fontSize: 15,
    color: "black",
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
    padding: 2,
    flex: 1,
  },
  container: {
    flex: 1
  },
  icon: {
    paddingLeft: 10
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: 120
  }
});
