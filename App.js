import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View, Button, Alert, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';

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
      loading: false,
      guessing: false,
      gif: false,
      gifLst: false,
      gifIndex: 0,
      guess: '',
      keyword: null,
      correct: false,
    }
    this.searchGif = this.searchGif.bind(this)
  }

  handleStart = () => {
    this.setState({playing: true});
  }

  newGame = () => {
    this.setState({guessing: false, correct: false, keyword: null, gif: false})
  }

  handleConfirmKeyword = () => {
    this.setState({guessing: true})
  }

  handleRefreshKeyword = () => {
    let nextIndex = this.state.gifIndex + 1;
    if (nextIndex >= this.state.gifLst.length) {
      nextIndex = 0;
    }
    this.setState({gif: this.state.gifLst[nextIndex].images.original, gifIndex: nextIndex});
  }

  handleKeyWordChange = (keyword) => {
    this.setState({keyword: keyword});
  }

  handleGuessChange = (guess) => {
    this.setState({guess: guess});
  }

  validateGuess = () => {
    // switching them all to avoid case sensitivity
    let result = (this.state.guess.toLowerCase() === this.state.keyword.toLowerCase())
    console.log(this.state.guess, this.state.keyword, result)
    this.setState({guessing: !result, correct: result})
  }

  async searchGif() {
    this.setState({loading: true})
    let gifLst = await getImageURLfromTag(this.state.keyword);
    this.setState({gifLst: gifLst});
    this.setState({gif: gifLst[this.state.gifIndex].images.original, loading: false});
  }

  showGif = (gif) => {
    if (gif) {
    return(
      <View>
        <Image
          source={{uri: gif.url}}
          style={{width: 200, height: 200}}/>
      </View>
      )
    }
    else if (this.state.loading) {
      return (
        <View style={styles.loading}>
            <ActivityIndicator animating={true}/>
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
        <ScrollView >

          <View style={styles.container}>
            <TextInput
              placeholder='Enter a Keyword'
              placeholderTextColor='gray'
              value={this.state.keyword}
              onChangeText={this.handleKeyWordChange}
              style={styles.textInput}
              onEndEditing={this.searchGif}
              returnKeyType={'go'}
            />
            {this.showGif(this.state.gif)}
            <View style={styles.keywordOptions}>
              <CircleButton name='check' color='green' onPress={this.handleConfirmKeyword}/>
              <CircleButton name='refresh' color='red' onPress={this.handleRefreshKeyword}/>
            </View>
          </View>
        </ScrollView>
      )
    }
    else if (!this.state.guessing) {
      return (
        <View style={styles.container}>
          <Text style={{ "margin": 10 }}>You are Correct!</Text>
          <Button title='Start New Game' onPress={this.newGame}/>
        </View>
      )
    }
    else {
      return (
        <View style={styles.container}>
          <ScrollView>
            <View>
              <Image
                source={{uri: this.state.gif.url}}
                style={{width: 200, height: 200}}/>
            </View>
            <TextInput
              placeholder='Enter your guess'
              placeholderTextColor='gray'
              value={this.state.guess}
              onChangeText={this.handleGuessChange}
              style={styles.textInput}
              onEndEditing={this.validateGuess}
              returnKeyType={'go'}
            />
          </ScrollView>
        </View>
      )
    }
  }

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
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keywordOptions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  circleButton: {
    padding: 8
  },
  textInput: {
    width: 200,
    height: 44,
    color: 'white',
    padding: 8,
    borderColor: 'lightgray',
    borderWidth: 1
  },
  loading: {
    width:200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

async function getImageURLfromTag(tags){
  tags = tags.split(" ").join("+");
  let url = `http://api.giphy.com/v1/gifs/search?q=${tags}&api_key=${API_KEY}&limit=${10}`;
  let responseString = await fetch(url);
  let response = await responseString.json();
  return(response.data);
}
