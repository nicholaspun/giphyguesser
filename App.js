import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Alert, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CircleButton = props => (
  <TouchableOpacity style={styles.circleButton}>
    <Icon name={props.name} size={30} color={props.color}/>
  </TouchableOpacity>
)

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      playing: false,
      guessing: false,
      gif: null,
      keyword: null,
      correct: false,
    }
    this.handleStart = this.handleStart.bind(this)
    this.handleKeyWordChange = this.handleKeyWordChange.bind(this)
    this.searchGif = this.searchGif.bind(this)
  }

  handleStart() {
    this.setState({playing: true});
  }

  handleKeyWordChange(keyword) {
    this.setState({keyword: keyword});
  }

  searchGif() {

  }

  viewSwitcher = () => {
    if (!this.state.playing) {
      return (
        <View style={styles.container}>
          <Button title='Start New Game' onPress={this.handleStart}/>
        </View>
      )
    }
    else if (!this.state.guessing && !this.state.correct) {
      return (
        <View style={styles.container}>
          <TextInput
            placeholder='Enter a Keyword'
            placeholderTextColor='gray'
            value={this.state.keyword}
            onChangeText={this.handleKeyWordChange}
            style={{ width: 200, height: 44, padding: 8, borderColor: 'gray', borderWidth: 1}}
            onEndEditing={this.state.searchGif}
            returnKeyType={'go'}
          />
          <View style={styles.keywordOptions}>
            <CircleButton name='check' color='green'/>
            <CircleButton name='refresh' color='red'/>
          </View>
        </View>
      )
    }
    else if (!this.state.guessing) {
      return (
        <View style={styles.container}>
          <Text>Keyword is Correct, null it and start new game</Text>
        </View>
      )
    }
    else {
      return (
        <View style={styles.container}>
          <Text>Guess</Text>
        </View>
      )
    }
  }

  _handleButtonPress = () => {
      Alert.alert(
        'Button pressed!',
        'You did it!',
      );
    };

  render() {
    return (
      <View style={styles.container}>{this.viewSwitcher()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keywordOptions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  circleButton: {
    padding: 8
  }
});
