import React, { Component } from "react";
import PlayGrid from "./PlayGrid";

import "../../../css/play/play.scss";
import play from "../../../images/play.png";
import pause from "../../../images/pause.png";
import restart from "../../../images/restart.png";

import {Link} from 'react-router-dom';

const totalTime = 60;

// Contains the information about the play state
class PlayContainerState {
  constructor() {
    this.currentRoom = undefined;
    this.remainingTime = totalTime;
    this.playing = false;
    this.visitedRooms = [];
    this.currentEvent = undefined;
    this.showEventWindow = false;
    this.gameOver = false;
    this.gameWin = false;

    this.endRoom = undefined;
  }
}

// Render the grid and the controls for playing
class PlayContainer extends Component {
  constructor(props) {
    super(props);
    this.state = new PlayContainerState();
  }

  // Remove the timer interval when the component unmounts
  componentWillUnmount() {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }
  }

  // Initialize the end room if it is null (legacy)
  componentDidMount() {
    let endRoom = this.props.graph.endRoom;
    if (!endRoom) {
      endRoom = Object.keys(this.props.graph.graph)[-1];
    }
    this.setState({
      endRoom,
    });
  }

  // Restart the map
  restart() {

    // Get the start room in case it is null (legacy)
    let startRoom = this.props.graph.startRoom;
    if(!startRoom) {
      startRoom = Object.keys(this.props.graph.graph)[0];
    }
    // Reset the map information
    this.setState({
      playing: true,
      currentRoom: startRoom,
      remainingTime: totalTime,
      visitedRooms: [startRoom],
      currentEvent: undefined,
      showEventWindow: false,
      gameOver: false,
      gameWin:false
    });

    // Reset the timer information
    if(this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      let remainingTime = this.state.remainingTime - 1;
      if (remainingTime <= 0) {
        this.restart();
        this.setState({
          gameOver: true,
        });
        remainingTime = 0;
      }
      this.setState({ remainingTime: remainingTime });
    }, 1000);
  }

  // Either resume playing from paused or initialize the first play
  play() {
    let room = this.state.currentRoom;
    let remainingTime = this.state.remainingTime;
    let visitedRooms = this.state.visitedRooms;
    if (room === undefined) {
      room = this.props.graph.startRoom;
      if (!room) {
        room = Object.keys(this.props.graph.graph)[0];
      }
      remainingTime = totalTime;
      visitedRooms.push(room);
    }
    this.setState({
      playing: true,
      currentRoom: room,
      remainingTime,
      visitedRooms,
      gameOver: false,
      gameWin: false,
    });

    // Start the timer
    this.intervalId = setInterval(() => {
      let remainingTime = this.state.remainingTime - 1;
      if (remainingTime <= 0) {
        this.restart();
        this.setState({
          gameOver: true,
        });
        remainingTime = 0;
      }
      this.setState({ remainingTime: remainingTime });
    }, 1000);
  }

  // Stop the timer and set playing to false
  pause() {
    this.setState({ playing: false });
    clearInterval(this.intervalId);
  }

  // Set the current room
  setCurrentRoom(room) {
    this.setState({ currentRoom: room });
  }

  // Add a room to the set of visited rooms
  setVisited(room) {
    let visitedRooms = [...this.state.visitedRooms];
    if (visitedRooms.indexOf(room) === -1) {
      visitedRooms.push(room);
      this.setState({ visitedRooms });
      if(room === this.props.graph.endRoom) {
        this.setState({ 
          gameWin: true,
          playing: false
        });
        if(this.intervalId) clearInterval(this.intervalId);
      }
    }
  }

  // Set the current event
  setCurrentEvent(event) {
    this.setState({ currentEvent: event });
  }

  // Render the grid and controls
  render() {
    return (
      <div className="play-container card">
        <div className="play-info flex flex-row flex-center">
          <div
            className="play-button flex center-child"
            onClick={() => {
              if (this.state.playing) {
                this.pause();
              } else {
                this.play();
              }
            }}
          >
            <img src={this.state.playing ? pause : play} alt="play control" />
          </div>
          <div
            className="restart-button flex center-child"
            onClick={() => this.restart()}
          >
            <img src={restart} alt="Restart" />
          </div>
          <div className="timer">
            {this.state.remainingTime} seconds remaining
          </div>
        </div>
        <PlayGrid
          graph={this.props.graph}
          className={"play-grid"}
          currentRoom={this.state.currentRoom}
          playing={this.state.playing}
          visitedRooms={this.state.visitedRooms}
          setVisited={(room) => this.setVisited(room)}
          setCurrentRoom={(room) => this.setCurrentRoom(room)}
        />
        {this.state.currentRoom === undefined ? (
          <div className="play-prompt">Press the play button to start!</div>
        ) : null}
        {this.state.currentRoom !== undefined && !this.state.playing ? (
          <div className="pause-prompt flex center-child">
            <img src={pause} alt="paused" />
          </div>
        ) : null}
        {this.state.gameOver || this.state.gameWin ? (
          <div className={`game-end flex flex-col flex-center ${this.state.gameOver ? "game-end-lose" : "game-end-win"}`}>
            <div className="game-end-message">{this.state.gameOver ? "GAME OVER" : "YOU WIN"}</div>
            <div className="game-end-links flex flex-row">
              {
                !this.state.gameOver ?
                <div className="game-end-link">
                  <Link to={"/map/" + this.props.uid}>
                    Rate This Map
                  </Link>
                </div> : null
              }
              <div className="game-end-link"><Link to={"/library"}>Browse More</Link></div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default PlayContainer;
