import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import ReactMoE, {
  MoEGeoLocation,
  MoEProperties,
} from "react-native-moengage";

export class TrackEvent extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Track Events",
    };
  };


  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={[
            {
              id: "0",
              title: "Track Event",
              action: () => {
                ReactMoE.trackEvent("samplevent");
              },
            },
            {
              id: "1",
              title: "Track Event with Attributes",
              action: () => {
                let booked = new MoEProperties();
                booked.addAttribute("quantities", [1, 2]);
                booked.addAttribute("models", ["iPhone 12", "iPhone 11"]);
                booked.addAttribute("mixedArray", ["iphone 12", 4, "iphone 11", 5]);
                booked.addAttribute("product", "iPhone");
                booked.addAttribute("currency", "dollar");
                booked.addAttribute("price", 699);
                booked.addAttribute("new_item", true);
                booked.addDateAttribute("purchase_date", "2020-06-10T12:42:10Z");

                ReactMoE.trackEvent("samplevent", booked);
              },
            },
            {
              id: "2",
              title: "Track NonInteractive Event",
              action: () => {

                let properties = new MoEProperties();
                properties.addDateAttribute("date1", "2020-06-10T12:42:10Z");
                properties.addDateAttribute("date2", new Date().toISOString());
                properties.addLocationAttribute(
                  "entry_location",
                  new MoEGeoLocation(90.00001, 180.00001)
                );
                properties.addLocationAttribute(
                  "exit_location",
                  new MoEGeoLocation(12.456, -15.89)
                );
                properties.addAttribute("fName", "Steve");
                properties.addAttribute("lName", "Jobs");
                properties.setNonInteractiveEvent();
                ReactMoE.trackEvent("samplevent", properties);
              },
            },
          ]}
          renderItem={({ item, separators }) => (
            <TouchableOpacity
              onPress={() => item.action()}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}
            >
              <View style={{ backgroundColor: "white" }}>
                <Text style={styles.item}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  headerStyleVary: {
    paddingLeft: 20,
    paddingRight: 20,
    width: 30,
    height: 30,
    flex: 1,
  },
});

export default TrackEvent;
