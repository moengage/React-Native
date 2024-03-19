import React, { PureComponent } from "react";
import { MoEngageLogger, MoEngageNudgePosition } from "react-native-moengage";
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

export default class ShowNudgeScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Show Nudge",
      title: "Show Nudge Title",
    };
  };

  constructor(props) {
    super(props);
    Dimensions.addEventListener("change", () => {
      MoEngageLogger.debug("orientation change");
      ReactMoE.onOrientationChanged()
    });
    this.dataList = [
      {
        key: "showNudgeTop",
        value: "Nudge - Top",
      },
      {
        key: "showNudgeBottom",
        value: "Nudge - Bottom",
      },
      {
        key: "showNudgeBottomLeft",
        value: "Nudge - BottomLeft",
      },
      {
        key: "showNudgeBottomRight",
        value: "Nudge - BottomRight",
      },
      {
        key: "showNudgeAny",
        value: "Nudge - Any",
      },
    ];
  }

  _keyExtractor = (item, index) => `${index}_${item.key}`;

  handleRowTapped = (index) => {
    let data = this.dataList[index];
    switch (data.key) {
      case "showNudgeTop":
        ReactMoE.showNudge(MoEngageNudgePosition.Top);
        break;
      case "showNudgeBottom":
        ReactMoE.showNudge(MoEngageNudgePosition.Bottom);
        break;
      case "showNudgeBottomLeft":
        ReactMoE.showNudge(MoEngageNudgePosition.BottomLeft);
        break;
      case "showNudgeBottomRight":
        ReactMoE.showNudge(MoEngageNudgePosition.BottomRight);
        break;
      case "showNudgeAny":
        ReactMoE.showNudge();
        break;
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