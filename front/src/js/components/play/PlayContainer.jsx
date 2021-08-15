import React, { Component } from "react";
import PlayGrid from "./PlayGrid";

import "../../../css/play/play.scss";
import play from "../../../images/play.png";
import pause from "../../../images/pause.png";
import restart from "../../../images/restart.png";

import { Link } from "react-router-dom";
// Contains the information about the play state
class PlayContainerState {
  constructor() {
    this.currentRoom = undefined;
    this.remainingTime = 0;
    this.playing = false;
    this.visitedRooms = [];
    this.currentEvent = undefined;
    this.showEventWindow = false;
    this.eventWindowResult = "";
    this.gameOver = false;
    this.gameWin = false;

    this.eventResponse = "";

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
    if (!startRoom) {
      startRoom = Object.keys(this.props.graph.graph)[0];
    }
    // Reset the map information
    this.setState({
      playing: true,
      currentRoom: startRoom,
      remainingTime: this.props.timeLimit,
      visitedRooms: [startRoom],
      currentEvent: undefined,
      showEventWindow: false,
      gameOver: false,
      gameWin: false,
    });

    // Reset the timer information
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.props.timeLimit !== 0) {
      this.intervalId = setInterval(() => {
        let remainingTime = this.state.remainingTime - 1;
        if (remainingTime <= 0) {
          this.restart();
          this.setState({
            playing:false,
            gameOver: true,
          });
          remainingTime = 0;
        }
        this.setState({ remainingTime: remainingTime });
      }, 1000);
    }
  }

  // Either resume playing from paused or initialize the first play
  play() {
    if(this.state.gameOver || this.state.gameWin) {
      this.restart();
      return;
    }
    let room = this.state.currentRoom;
    let remainingTime = this.state.remainingTime;
    let visitedRooms = this.state.visitedRooms;

    // If the current room was undefined, we need to restart the game
    if (room === undefined) {
      room = this.props.graph.startRoom;
      if (!room) {
        room = Object.keys(this.props.graph.graph)[0];
      }
      remainingTime = this.props.timeLimit;
      visitedRooms = [];
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
    if (this.props.timeLimit !== 0) {
      this.intervalId = setInterval(() => {
        let remainingTime = this.state.remainingTime - 1;
        if (remainingTime <= 0) {
          this.restart();
          this.setState({
            playing:false,
            gameOver: true,
          });
          remainingTime = 0;
        }
        this.setState({ remainingTime: remainingTime });
      }, 1000);
    }
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

  // Attempt to enter a room. If the room
  // doesn't need an event, just go to it.
  // If it does, set the event and show the event window
  tryToVisit(room) {
    let visitedRooms = [...this.state.visitedRooms];

    // If the room has already been visited, go to it freely
    if (visitedRooms.indexOf(room) === -1) {
      // If the room has a question event, set the event and show
      // the event window
      if (this.props.graph.graph[room].eventType === "Question") {
        this.setState({
          currentEvent: {
            type: "Question",
            room,
          },
          showEventWindow: true,
        });
      } else if (this.props.graph.graph[room].eventType === "No Event") {
        // If the room does not have an event, just go to it
        visitedRooms.push(room);
        this.setState({ visitedRooms, currentRoom: room });
        // Check if the room is the end room, show the win
        // prompt if so
        if (room === this.props.graph.endRoom) {
          this.setState({
            gameWin: true,
            playing: false,
            currentRoom: undefined,
          });
          if (this.intervalId) clearInterval(this.intervalId);
        }
      }
    } else {
      this.setState({ currentRoom: room });
    }
  }

  // Set the current event
  setCurrentEvent(event) {
    this.setState({ currentEvent: event });
  }

  // Event handler for user typing in the event window response
  // text field
  handleEventResponse(e) {
    this.setState({
      eventResponse: e.target.value,
    });
  }

  // Triggered when a user clicks the submit button on the
  // event window. Checks whether the input matches the correct
  // answer stored in the event. If it matches, go to that room.
  // If not, then tell the user it was wrong.
  submitEvent() {
    let response = this.state.eventResponse;
    let correctAnswer =
      this.props.graph.graph[this.state.currentEvent.room].eventA;

    if (response.toLowerCase() !== correctAnswer.toLowerCase()) {
      this.setState({ eventWindowResult: "Incorrect!" });
    } else {
      // Answer was correct, so move player into that room
      let visitedRooms = [...this.state.visitedRooms];
      let room = this.state.currentEvent.room;
      visitedRooms.push(room);
      this.setState({
        currentRoom: room,
        visitedRooms,
      });
      // Close the event window
      this.closeEvent();

      // If room is the ending room, win the game
      if (room === this.props.graph.endRoom) {
        this.setState({
          gameWin: true,
          playing: false,
          currentRoom: undefined,
        });
        if (this.intervalId) clearInterval(this.intervalId);
      }
    }
  }

  // Resets the event information and closes the window
  closeEvent() {
    this.setState({
      currentEvent: undefined,
      showEventWindow: false,
      eventResponse: "",
      eventWindowResult: "",
    });
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
            <img src={this.state.playing && !(this.state.gameOver || this.state.gameWin) ? pause : play} alt="play control" />
          </div>
          <div
            className="restart-button flex center-child"
            onClick={() => this.restart()}
          >
            <img src={restart} alt="Restart" />
          </div>
          {this.props.timeLimit !== 0 ? (
            <div className="timer">
              {this.state.remainingTime} seconds remaining
            </div>
          ) : null}
        </div>
        <PlayGrid
          graph={this.props.graph}
          className={"play-grid"}
          currentRoom={this.state.currentRoom}
          playing={this.state.playing}
          visitedRooms={this.state.visitedRooms}
          tryToVisit={(room) => this.tryToVisit(room)}
          setCurrentRoom={(room) => this.setCurrentRoom(room)}
        />
        {this.state.currentRoom === undefined ? (
          <div className="play-prompt">Press the play button to start!</div>
        ) : null}
        {
          this.state.currentRoom !== undefined && 
          !this.state.playing &&
          !(
            this.state.gameWin || 
            this.state.gameOver
          ) ? (
          <div className="pause-prompt flex center-child">
            <img src={pause} alt="paused" />
          </div>
        ) : null}
        {this.state.gameOver || this.state.gameWin ? (
          <div
            className={`game-end flex flex-col flex-center ${
              this.state.gameOver ? "game-end-lose" : "game-end-win"
            }`}
          >
            <div className="game-end-message">
              {this.state.gameOver ? "GAME OVER" : "YOU WIN"}
            </div>
            <div className="game-end-links flex flex-row">
              {!this.state.gameOver ? (
                <div className="game-end-link">
                  <Link to={"/map/" + this.props.uid}>Rate This Map</Link>
                </div>
              ) : null}
              <div className="game-end-link">
                <Link to={"/library"}>Browse More</Link>
              </div>
            </div>
          </div>
        ) : null}
        {this.state.showEventWindow ? (
          <div className="event-window flex center-child">
            <div className="event-window-inner flex flex-col flex-center">
              <div className="event-question">
                {this.props.graph.graph[this.state.currentEvent.room].eventQ}
              </div>
              <div className="event-input">
                <input
                  type="text"
                  placeholder="Response..."
                  value={this.state.eventResponse}
                  onChange={(e) => this.handleEventResponse(e)}
                />
              </div>
              <div className="event-submit flex flex-row">
                <div
                  className="event-submit-button green"
                  onClick={() => this.submitEvent()}
                >
                  GO
                </div>
                <div
                  className="event-submit-button red"
                  onClick={() => this.closeEvent()}
                >
                  CLOSE
                </div>
              </div>
              {this.state.eventWindowResult !== "" ? (
                <div className="event-result">
                  {this.state.eventWindowResult}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default PlayContainer;
