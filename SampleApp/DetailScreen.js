import React from 'react';
import { View } from 'react-native';
import { Header } from 'react-native-elements';
import ReactMoE from 'react-native-moengage'

export class DetailScreen extends React.Component {
  static navigationOptions = {
    title: 'Detail',
  };
    render() {
      ReactMoE.showInApp()
      return (
        <View style = {{flex: 1}}>
          {/* <Header backgroundColor = '#567'
            leftComponent={{ icon: 'refresh', color: '#fff' }}
            centerComponent={{ text: 'Home', style: { color: '#fff' } }}
            rightComponent={{ icon: 'settings', color: '#fff' }}
          /> */}
        </View>
      );
    }
}

export default DetailScreen