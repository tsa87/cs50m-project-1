import React, { Component }  from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const DEFAULT_WORK_MINS = 25
const DEFAULT_BREAK_MINS = 5

const msToSec = (ms) => Math.floor(ms / 1000)
const minToSec = (min) => min * 60
const secToMin = (sec) => Math.floor(sec / 60)
const toDoubleDigit = (num) => ("0" + num).slice(-2)

class CountDown extends Component {

  state = {
    timeDifferenceSeconds: 0,
    timeDifferenceMinutes: 0,
    futureTime: msToSec(Date.now()) + minToSec(DEFAULT_WORK_MINS),
    pauseTimeStamp: msToSec(Date.now()),
    isPaused: false,
    mode: "Work",
  }

  shouldComponentUpdate() {
    return !this.state.isPaused
  }

  componentDidMount() {
    setInterval( () => this.timeUpdate() , 10)
  }

  timeUpdate() {
    const timeDifference = Math.floor( this.state.futureTime - msToSec(Date.now()) )
    if (timeDifference < 1){
      this.swapMode()
      this.updateFutureTime()
    }
    this.setState(
      {timeDifferenceMinutes: toDoubleDigit(secToMin(timeDifference)) },
      function() {
        this.setState(
          {timeDifferenceSeconds: toDoubleDigit(timeDifference-minToSec(this.state.timeDifferenceMinutes))}
        )
      }
    )
  }

  swapMode = () => {
    if ("Work" == this.state.mode) this.setState({mode: "Rest"})
    else this.setState({mode: "Work"})
  }

  updateFutureTime = () => {
    if ("Work" === this.state.mode) {
      this.setState({futureTime: msToSec(Date.now()) + minToSec(DEFAULT_WORK_MINS)})
    }
    else this.setState({futureTime: msToSec(Date.now())+minToSec(DEFAULT_BREAK_MINS)})
  }

  pauseTimer = () => {
    this.setState( prevState => ({
        isPaused: !prevState.isPaused,
      }),
      function() {
        this.updatePauseTimeStamp()
        this.setState( prevState => (
          { futureTime: prevState.futureTime + msToSec(Date.now()) - prevState.pauseTimeStamp }
        ))
      }
    )
  }

  updatePauseTimeStamp = () => {
    if (this.state.isPaused === true) {
      this.setState( { pauseTimeStamp: msToSec(Date.now()) } )
    }
  }

  resetTimer = () => {
    this.setState({
      futureTime: msToSec(Date.now()) + minToSec(DEFAULT_WORK_MINS),
      isPaused: false,
      mode: "Work",
    })
  }

  render() {
    return (
      <View>

        <Text style={styles.count}>
          {this.state.mode}
        </Text>
        <Text style={styles.count}>
          {this.state.timeDifferenceMinutes}:{this.state.timeDifferenceSeconds}
        </Text>

        <View style={styles.buttonContainer}>
          {(!this.state.isPaused)&&<Button title="Pause" onPress={this.pauseTimer} />}
          {(this.state.isPaused)&&<Button title="Resume" onPress={this.pauseTimer} />}
          <Button title="Reset" onPress={this.resetTimer} />
        </View>

      </View>
    )
  }
}
export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <CountDown />
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },

  count: {
    fontSize: 48,
  },
})
