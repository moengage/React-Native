import React, { PureComponent } from "react";
import AntIcon from "react-native-vector-icons/AntDesign";
import { MoEngageLogger } from "react-native-moengage";
import { MOENGAGE_APP_ID } from "./src/key.js";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import MoEReactInbox from "react-native-moengage-inbox";


export default class InboxDetailScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: "Inbox",
      title: "Inbox Title"
    };
  };

  setNavigationParams = () => {
    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={this.getUnClickedCount}>
          <View style={{ flex: 1, paddingRight: 10, justifyContent: "center" }}>
            <Text> <AntIcon name="inbox" size={30} color="white" /></Text>
          </View>
        </TouchableOpacity>
      )
    });
  };

  getUnClickedCount = async () => {
    var count = await MoEReactInbox.getUnClickedCount()
    Alert.alert(
      "Unread Message Count",
      count.toString(),
      [
        {
          text: "OK",
        }
      ]
    );
  };

  constructor(props) {
    super(props);
    this.setNavigationParams();
    this.state = {
      isLoading: true,
      dataSource: []
    }
  }

  async componentDidMount() {
    MoEReactInbox.initialize(MOENGAGE_APP_ID);
    var message = await MoEReactInbox.fetchAllMessages();
    MoEngageLogger.debug("inbox message", message);
    this.setState({
      isLoading: false,
      dataSource: message.messages
    })
  }

  trackClick = (message) => {
    MoEReactInbox.trackMessageClicked(message);
  }

  deleteMessage = async (message) => {
    MoEReactInbox.deleteMessage(message);
    var message = await MoEReactInbox.fetchAllMessages()
    this.setState({
      isLoading: false,
      dataSource: message.messages
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
      <View style={styles.rowItemMainContainer} >
        <Text style={styles.rowItemText}>cid = {item.campaignId} </Text>
        <Text style={styles.rowItemText}>Title = {item.text.title} </Text>
        <Text style={styles.rowItemText}>subtitle = {item.text.subtitle} </Text>
        <Text style={styles.rowItemText}>Message = {item.text.message} </Text>

        <View style={{ flexDirection: "row" }}>

          <View style={styles.buttonView}>
            <TouchableOpacity onPress={() => this.trackClick(item)}>
              <Text style={styles.text} >Track Click</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonView}>
            <TouchableOpacity onPress={() => this.deleteMessage(item)}>
              <Text style={styles.text} >Delete Message</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View >
    );
  };

  render() {
    let { dataSource } = this.state;
    return (
      <View style={styles.mainContainer}>
        <FlatList
          data={dataSource}
          renderItem={this._renderRowItem}
          ItemSeparatorComponent={this.flatListItemSeparator}
          keyExtractor={(item) => item.campaignId}
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
    padding: 10,
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
