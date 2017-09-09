import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import $ from "jquery";

let API_KEY = "1da9e73147fd49008bd755b144fab994";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      playing: true,
      guessing: false,
      keyword: null,
    }
  }

  viewSwitcher = () => {
    if (!this.state.playing) {
      return (
        <View style={styles.container}>
          <Text>Start New Game</Text>
        </View>
      )
    }
    else if (!this.state.guessing && !this.state.keyword) {
      return (
        <View style={styles.container}>
          <Text>Search Giphy + Set Keyword</Text>
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


  render() {
    return <View style={styles.container}>{this.viewSwitcher()}</View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function getImageURLfromTag(tags){
  let url = "err"
  tags = tags.split(" ").join("+");
  let xhr = $.get(String.format("http://api.giphy.com/v1/gifs/search?q={0}&api_key={1}&limit={2}", tags, API_KEY, 1));
  xhr.done(function(data) {
     console.log("success got data", data);
     url = data[0]['url'];
    });
  return url;
}