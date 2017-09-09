import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, Text, View, Button, Alert, TextInput, TouchableOpacity, Image } from 'react-native';

let API_KEY = "1da9e73147fd49008bd755b144fab994";

const CircleButton = (props) => (
  <TouchableOpacity style={styles.circleButton} onPress={props.onPress}>
    <Icon name={props.name} color={props.color}/>
  </TouchableOpacity>
)


export default class App extends Component {
  constructor() {
    super();
    this.state = {
      playing: false,
      guessing: false,
      gif: false,
      guess: '',
      keyword: null,
      correct: false,
    }
    this.handleStart = this.handleStart.bind(this)
    this.handleKeyWordChange = this.handleKeyWordChange.bind(this)
    this.searchGif = this.searchGif.bind(this)
    this.handleConfirmKeyword = this.handleConfirmKeyword.bind(this)
    this.validateGuess = this.validateGuess.bind(this)
    this.handleGuessChange = this.handleGuessChange.bind(this)
  }

  handleStart() {
    this.setState({playing: true});
  }

  handleConfirmKeyword() {
    this.setState({guessing: true})
  }

  handleKeyWordChange(keyword) {
    this.setState({keyword: keyword});
  }

  handleGuessChange(guess) {
    this.setState({guess: guess});
  }

  validateGuess() {
    let result = (this.state.guess === this.state.keyword)
    console.log(this.state.guess, this.state.keyword, result)
    this.setState({guessing: !result, correct: result})
  }

  async searchGif() {
    let gif = await getImageURLfromTag(this.state.keyword);
    this.setState({gif: gif})
  }

  showGif(gif) {
    if (gif) {
    return(
      <View>
        <Image
          source={{uri: gif.url}}
          style={{width: Number(gif.width), height: Number(gif.height)}}/>
      </View>
      )
    }
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
            onEndEditing={this.searchGif}
            returnKeyType={'go'}
          />
            {this.showGif(this.state.gif)}
            <View style={styles.keywordOptions}>
              <CircleButton name='check' color='green' onPress={this.handleConfirmKeyword}/>
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
          <View>
            <Image
              source={{uri: this.state.gif.url}}
              style={{width: Number(this.state.gif.width), height: Number(this.state.gif.height)}}/>
          </View>
          <TextInput
            placeholder='Enter your guess'
            placeholderTextColor='gray'
            value={this.state.guess}
            onChangeText={this.handleGuessChange}
            style={{ width: 200, height: 44, padding: 8, borderColor: 'gray', borderWidth: 1}}
            onEndEditing={this.validateGuess}
            returnKeyType={'go'}
          />
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

async function getImageURLfromTag(tags){
  tags = tags.split(" ").join("+");
  let url = `http://api.giphy.com/v1/gifs/search?q=${tags}&api_key=${API_KEY}&limit=${1}`;
  let responseString = await fetch(url);
  let response = await responseString.json();
  return(response.data[0].images.original);
}
