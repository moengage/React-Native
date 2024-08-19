import React, { PureComponent } from "react";
import { MoEngageLogger } from "react-native-moengage";
import { AlertBox, fire } from 'react-native-alertbox';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions
} from "react-native";
import ReactMoE from "react-native-moengage";
import { validateArrayOfString } from "./helper/SampleAppHelper";

export default class InAppDetailScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "In App",
      title: "In App Title",
    };
  };
  constructor(props) {
    super(props);
    self.props = props;
    Dimensions.addEventListener("change", () => {
      MoEngageLogger.debug("orientation change");
      ReactMoE.onOrientationChanged()
    });
    this.dataList = [
      {
        key: "showInApp",
        value: "Show InApp",
      },
      {
        key: "selfHandled",
        value: "Show Self Handled",
      },
      {
        key: "showNudge",
        value: "Show Nudge",
      },
      {
        key: "setCurrentContext",
        value: "Set Current Context",
      },
      {
        key: "resetCurrentContext",
        value: "Reset Current Context",
      },
      {
        key: "multipleSelfHandledInApps",
        value: "Mutiple SelfHandled InApps"
      }
    ];
  }

  _keyExtractor = (item, index) => `${index}_${item.key}`;

  handleRowTapped = async (index) => {
    let data = this.dataList[index];
    switch (data.key) {
      case "showInApp":
        ReactMoE.showInApp();
        break;
      case "selfHandled":
        ReactMoE.getSelfHandledInApp();
        ReactMoE.setEventListener("inAppCampaignSelfHandled", (payload) => {
          MoEngageLogger.debug("inAppCampaignSelfHandled", payload);
          if (payload && Object.keys(payload).length != 0) {
            this.props.navigation.navigate("SelfHandledCampaign", {
              info: payload,
            });
          }
        });
        break;
      case "setCurrentContext":
        fire({
          title: 'Enter Context',
          message: 'Use comma for multiple values',
          actions: [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: text => {
                const result = text.context.split(",");
                if (validateArrayOfString(result)) {
                  ReactMoE.setCurrentContext(result);
                }
              }
            },
          ],
          fields: [{
              name: 'context',
              placeholder: 'Enter context',
          }],
        });
        break;
      case "resetCurrentContext":
        ReactMoE.resetCurrentContext();
        break;
      case "showNudge":
        props.navigation.navigate("ShowNudgeScreen");
        break;
      case "multipleSelfHandledInApps":
        this.props.navigation.navigate("MultipleInAppsScreen");
    }
  };

  _renderRowItem = (rowData) => {
    return (
      <RowItem
        index={rowData.index}
        rowItemData={rowData.item}
        rowTapped={this.handleRowTapped}
      />
    );
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <AlertBox />
        <FlatList
          data={this.dataList}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderRowItem}
          legacyImplementation={false}
          alwaysBounceVertical={false}
          ListFooterComponent={this._renderFooter}
          extraData={this.state}
        />
      </View>
    );
  }
}

class RowItem extends PureComponent {
  rowItemPressed = () => {
    this.props.rowTapped(this.props.index);
  };

  render() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={this.rowItemPressed}
        style={styles.rowItemMainContainer}
      >
        <Text style={styles.rowItemText}>{this.props.rowItemData.value}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  rowItemMainContainer: {
    height: 50,
    backgroundColor: "white",
  },
  rowItemText: {
    padding: 10,
    fontSize: 18,
    color: "black",
  },
});