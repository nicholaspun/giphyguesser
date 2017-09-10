import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableHighlight,
  KeyboardAvoidingView
} from 'react-native';

let API_KEY = "1da9e73147fd49008bd755b144fab994";

const CircleButton = (props) => (
  <TouchableOpacity style={styles.circleButton} onPress={props.onPress}>
    <Icon name={props.name} size={30} color={props.color}/>
  </TouchableOpacity>
)

var {height, width} = Dimensions.get('window');

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
      keyword: '',
      correct: false,
      firstGuess: true,
      firstKeyWord: true,
      guessesLeft: 5,
      pickerWin: false,
    }
    this.searchGif = this.searchGif.bind(this)
  }

  handleStart = () => {
    this.setState({playing: true});
  }

  newGame = () => {
    this.setState({guessing: false, correct: false, keyword: null, gif: false, guess: '', firstGuess: true, firstKeyWord: true, gifLst: false, guessesLeft: 5, pickerWin: false})
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
    if (result === false) {
      let newGuessesLeft = this.state.guessesLeft - 1;
      this.setState({guess: '', guessesLeft: newGuessesLeft});
      if (newGuessesLeft <= 0) {
        this.setState({pickerWin: true, guessing: false, correct: true});
      }
    }
    if (this.state.firstGuess) {
      this.setState({firstGuess: false});
    }
  }

  async searchGif() {
    this.setState({loading: true});
    let gifLst = await getImageURLfromTag(this.state.keyword);
    console.log(gifLst);
    if (gifLst.length) {
      this.setState({gifLst: gifLst});
      this.setState({gif: gifLst[this.state.gifIndex].images.original, loading: false});
    }
    else {
      this.setState({loading: false});
    }
    this.setState({firstKeyWord: false});
  }

  showInvalidTag = () => {
    console.log(this.state.gifLst.length);
    if (this.state.gifLst === false && !this.state.firstKeyWord) {
      console.log("test");
      return <Text style={{ "margin": 10, 'color': 'red' }}>Cannot find tag</Text>
    }
  }

  showGif = (gif) => {
    if (gif) {
    return(
      <View>
        <Image
          source={{uri: gif.url}}
          style={{width: 200, height: 200}}/>
          <View style={styles.keywordOptions}>
            <CircleButton name='check' color='green' style={styles.option} onPress={this.handleConfirmKeyword}/>
            <CircleButton name='refresh' color='red' style={styles.option} onPress={this.handleRefreshKeyword}/>
          </View>
      </View>
      )
    }
    else if (this.state.loading) {
      return (
        <View style={styles.loading}>
            <ActivityIndicator animating={true} color='white'/>
        </View>
      )
    }
  }

  showWrongGuess = () => {
    let first = this.state.firstGuess;
    if (!this.state.correct && !first) {
      return (
        <Text style={{ "margin": 10, 'color': 'red' }}>You have guessed incorrectly!</Text>
      )
    }
  }

  showWinner = () => {
    if (this.state.pickerWin) {
      return <Text style={{ "margin": 10, 'color': 'white', 'fontSize': 36}}>Tag Setter Wins!</Text>
    }
    else {
      return <Text style={{ "margin": 10, 'color': 'white', 'fontSize': 36}}>Tag Guessers Win!</Text>
    }
  }

  viewSwitcher = () => {
    if (!this.state.playing) {
      return (
        <View style={styles.container}>
            <Image source={require('./assets/header.png')} resizeMode='contain' style={{width: 300, height: 100, margin: 16}}/>
            <Button color='white' title='Start New Game' onPress={this.handleStart}/>
        </View>
      )
    }
    else if (!this.state.guessing && !this.state.correct) {
      return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.container}>
              <Text style={{ "margin": 30, 'color': 'white' }}>   Start by having the first player enter a tag for a gif, then pass the device to the other players who have 5 tries to guess the tag.</Text>
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
              {this.showInvalidTag()}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )
    }
    else if (!this.state.guessing) {
      return (
        <View style={styles.container}>
          {this.showWinner()}
          <Button color='white' title='Start New Game' onPress={this.newGame}/>
        </View>
      )
    }
    else {
      return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.container}>
              <Text style={{ 'color': 'white', 'fontSize': 20 }}>Guesses Remaining: {this.state.guessesLeft}</Text>
              <Image
                source={{uri: this.state.gif.url}}
                style={{width: 200, height: 200, padding: 8, margin: 8}}/>
              <TextInput
                placeholder='Enter your guess'
                placeholderTextColor='gray'
                value={this.state.guess}
                onChangeText={this.handleGuessChange}
                style={styles.textInput}
                onEndEditing={this.validateGuess}
                returnKeyType={'go'}
              />
              {this.showWrongGuess()}
              <Button color='white' title='Restart' onPress={this.newGame} style={{margin: 25}}/>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
    backgroundColor: '#212121',
    alignItems: 'center',
    justifyContent: 'center'
  },
  keywordOptions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  circleButton: {
    margin: 8
  },
  textInput: {
    width: 200,
    height: 44,
    color: 'white',
    backgroundColor: '#121212',
    padding: 8,
    margin: 8,
    borderColor: '#111',
    borderWidth: 1
  },
  loading: {
    width:200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollView: {
    flexGrow: 1,
  },
  option: {
    flex: 1
  },
});

async function getImageURLfromTag(tags){
  tags = tags.split(" ").join("+");
  let url = `http://api.giphy.com/v1/gifs/search?q=${tags}&api_key=${API_KEY}&limit=${10}`;
  let responseString = await fetch(url);
  let response = await responseString.json();
  return(response.data);
}
