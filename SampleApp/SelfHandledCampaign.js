import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import ReactMoE from 'react-native-moengage';

export default class SelfHandledCampaign extends PureComponent {
  constructor(props) {
    super(props);
    this.info = props.route.params.info;
  }
  componentDidMount() {
    ReactMoE.selfHandledShown(this.info);
  }

  handleNonPrimaryActionTap = () => {
    ReactMoE.selfHandledClicked(this.info);
  };

  handleDismissTap = () => {
    ReactMoE.selfHandledDismissed(this.info);
  };

  render() {
    if (this.info == null) {
      return null;
    }

    return (
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <Text style={styles.textLabels}>Campaign Id</Text>
          <Text style={styles.textValues}>
            {' '}
            {this.info.campaignData.campaignId}
          </Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.textLabels}>Campaign Name</Text>
          <Text style={styles.textValues}>
            {' '}
            {this.info.campaignData.campaignName}
          </Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.textLabels}>Expiry Time</Text>
          <Text style={styles.textValues}>
            {this.info.campaign.dismissInterval}
          </Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.textLabels}>Payload</Text>
          <Text style={styles.textValues} numberOfLines={1}>
            {this.info.campaign.payload}
          </Text>
        </View>

          <Text style={styles.textLabels}>ScreenNames</Text>
          <Text style={styles.textValues} numberOfLines={2}>
            {this.info.campaign.displayRules.screenNames.join(', ')}
          </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleNonPrimaryActionTap}>
            <Text style={styles.buttonText}>Non Primary Action</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleDismissTap}>
            <Text style={styles.buttonText}>Dismiss Action</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    paddingTop: 20,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
  },
  textLabels: {
    textAlign: 'left',
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  textValues: {
    textAlign: 'right',
    fontSize: 18,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#336699',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
  },
});
