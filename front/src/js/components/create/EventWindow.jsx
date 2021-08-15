import React, { Component } from "react";
import "../../../css/EventWindow.scss";
import "../../../css/grid.scss";

import { connect } from "react-redux";
import store from "../../store";
import { createPageActions } from "../../actions/actions";

const styles = {
  hidden: {
    visibility: "hidden",
  },

  visible: {
    visibility: "visible",
  },
};

const mapStateToProps = (store) => ({
  create: store.create,
});

const mapDispatchToProps = {
  setActiveRoom: createPageActions.setActiveRoom,
  setGraph: createPageActions.setGraph,
};

class EventWindowState {
  constructor(pr) {
    this.props = pr;
    this.currentSelected = "Room";
  }
}

class EventWindowBind extends Component {
  constructor(props) {
    super(props);
    this.state = new EventWindowState(props);
  }

  checkEmptyTextBoxes = (prevProps, props) => {
    let empty = false;
    [
      "requireItemName",
      "eventQ",
      "eventA",
      "solveItemName",
      "solveItemDesc",
    ].forEach((val) => {
      if (this.state.currentSelected == "Room") {
        if (props.create.graph.graph[prevProps.create.activeRoom][val] == "") {
          empty = true;
        }
      } else {
        if (
          props.create.graph.graph[prevProps.create.activeRoom].doorVals.find(
            (y) => y.dir == this.state.currentSelected
          )[val] == ""
        ) {
          empty = true;
        }
      }
    });
    return empty;
  };

  // determines if the event if for the active room or its N, S, W, or E door
  // won't change if there are empty text boxes
  selectForEvent = (e) => {
    if (this.state.currentSelected != e.target.value) {
      if (this.checkEmptyTextBoxes(this.props, this.props)) {
        alert("You cannot leave any input fields empty.");
        return;
      }
      this.setState({
        currentSelected: e.target.value,
      });
    }
  };

  // changes the event values in the store when one of the input fields changes
  onChangeStateVal = (e) => {
    let valType = e.target.type == "checkbox" ? "checked" : "value";
    if (this.state.currentSelected == "Room") {
      let tempGraph = this.props.create.graph;
      tempGraph.graph[this.props.create.activeRoom][
        e.target.attributes.name.value
      ] = e.target[valType];
      this.props.setGraph(tempGraph);
    } else {
      let tempGraph = this.props.create.graph;
      tempGraph.graph[this.props.create.activeRoom].doorVals.find(
        (y) => y.dir == this.state.currentSelected
      )[e.target.attributes.name.value] = e.target[valType];
      this.props.setGraph(tempGraph);
    }
  };

  // sets the starting room
  setStart = () => {
    let tempGraph = { ...this.props.create.graph };
    if (this.props.create.graph.startRoom == this.props.create.activeRoom) {
      tempGraph.startRoom = null;
    } else if (
      this.props.create.graph.endRoom == this.props.create.activeRoom
    ) {
      tempGraph.startRoom = this.props.create.activeRoom;
      tempGraph.endRoom = null;
    } else {
      tempGraph.startRoom = this.props.create.activeRoom;
    }
    this.props.setGraph(tempGraph);
  };

  // sets the ending room
  setEnd = () => {
    let tempGraph = { ...this.props.create.graph };
    if (this.props.create.graph.endRoom == this.props.create.activeRoom) {
      tempGraph.endRoom = null;
    } else if (
      this.props.create.graph.startRoom == this.props.create.activeRoom
    ) {
      tempGraph.endRoom = this.props.create.activeRoom;
      tempGraph.startRoom = null;
    } else {
      tempGraph.endRoom = this.props.create.activeRoom;
    }
    this.props.setGraph(tempGraph);
  };

  // coordinate combinations to use for checking if a square can be removed
  combinations = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  // returns true if the room with coordinates (x+i, y+j) will still
  //  be an accessible room on the map if room (x, y) is removed
  // returns false otherwise
  checkSquareStillValid = (x, y, i, j) => {
    let valid = false;

    // this loops over the squares adjacent to the one being checked
    // combinations of (a, b) => (-1, -1), (-1, 1), (1, -1), (1, 1)
    this.combinations.forEach((c) => {
      // goes over all of the rooms to find a room with coordinates:
      //    "x" = (x + i) + c[0]
      //    "y" = (y + j) + c[1]
      Object.entries(this.props.create.graph.coordinates).forEach(
        (adjacent) => {
          // if an adjacent room is found, this square will still be accessible, so return true
          if (
            adjacent[1].x == x + i + c[0] &&
            adjacent[1].y == y + j + c[1] &&
            !(x == x + i + c[0] && y == y + j + c[1])
          ) {
            valid = true;
          }
        }
      );
    });
    return valid;
  };

  // attempts to remove the active room from the map
  removeRoom = () => {
    let newGraph = { ...this.props.create.graph };

    // the end room cannot be removed
    if (Object.keys(this.props.create.graph.graph).length == 1) {
      alert("You cannot remove the only room.");
      return;
    }
    if (window.confirm("Are you sure you want to remove this room?")) {
      // check that the surrounding rooms are still accessible

      // gets the coordinates of the active room
      let coords =
        this.props.create.graph.coordinates[this.props.create.activeRoom];
      let valid = true;

      // checks the coordinates objects in the graph
      // when it finds a match for a room adjacent to the active room, it will
      // make sure that the room will still be accessible if the active room is
      // removed
      if (Object.keys(newGraph.coordinates).length > 2) {
        this.combinations.forEach((c) => {
          Object.entries(this.props.create.graph.coordinates).forEach((r) => {
            if (r[1].x == coords.x + c[0] && r[1].y == coords.y + c[1]) {
              if (!this.checkSquareStillValid(coords.x, coords.y, c[0], c[1])) {
                valid = false;
              }
            }
          });
        });
      }

      // if the room can be deleted
      if (valid) {
        let tempGraph = this.props.create.graph;
        delete tempGraph.graph[this.props.create.activeRoom];
        this.props.setGraph(tempGraph);
        let oldActive = this.props.create.activeRoom;
        // set the active room to another room in the map
        if (
          this.props.create.activeRoom !=
          Object.keys(this.props.create.graph.graph)[0]
        ) {
          this.props.setActiveRoom(
            Object.keys(this.props.create.graph.graph)[0]
          );
        } else {
          this.props.setActiveRoom(
            Object.keys(this.props.create.graph.graph)[1]
          );
        }
        // remove the room from the graph
        if (newGraph.startRoom == oldActive) {
          newGraph.startRoom = null;
        }
        if (newGraph.endRoom == oldActive) {
          newGraph.endRoom = null;
        }
        delete newGraph.graph[oldActive];
        delete newGraph.coordinates[oldActive];
        this.props.setGraph(newGraph);
      }
      // alert the user if the room cannot be deleted
      else {
        alert("Removing this square will make part of the map inaccessible.");
      }
    }
  };

  // helper function for getting the active room or one of its doors
  getRoomOrDoor = () => {
    if (this.state.currentSelected == "Room") {
      return this.props.create.graph.graph[this.props.create.activeRoom];
    } else {
      return this.props.create.graph.graph[
        this.props.create.activeRoom
      ].doorVals.find((y) => y.dir == this.state.currentSelected);
    }
  };

  // helper function for determining the styling of the "Room" and direction buttons
  getButtonStyle = (val) => {
    return {
      backgroundColor: val ? "#8ffad1" : "",
      borderColor: val ? "#6fdab1" : "",
    };
  };

  // helper function for determining the styling of the "Room" and direction buttons
  getTextBoxStyle = (val) => {
    return {
      backgroundColor: this.getRoomOrDoor()[val] == "" ? "#ffcfcf" : "",
      borderColor: this.getRoomOrDoor()[val] == "" ? "#d46363" : "",
    };
  };
  
  getCoordsText = () => {
    let coords = this.props.create.graph.coordinates[this.props.create.activeRoom];
    return `[${coords.x}, ${coords.y}]`;
  }

  // handles error checking for empty text boxes when trying to switch rooms
  componentDidUpdate(prevProps) {
    if (
      this.props.create.graph.graph[prevProps.create.activeRoom] &&
      prevProps.create.activeRoom != this.props.create.activeRoom
    ) {
      if (this.checkEmptyTextBoxes(prevProps, this.props)) {
        alert("You cannot leave any input fields empty.");
        this.props.setActiveRoom(prevProps.create.activeRoom);
      }
    }
  }

  render() {
    return (
      <div
        id="ew"
        className="canvas grid"
        style={
          this.props.create.activeRoom == undefined
            ? styles.hidden
            : this.props.style
        }
      >
        <h1>
          Room Coordinates:
          <span style={{ color: "#8ffad1", marginRight: "200px" }}>
            {" " + this.getCoordsText()}
          </span>
          <div style={{ float: "right" }}>
            <input
              className="room-button"
              type="button"
              onClick={this.selectForEvent.bind(this)}
              id="room-btn"
              value="Room"
              style={this.getButtonStyle(this.state.currentSelected == "Room")}
            />
            <input
              className="direction-button"
              type="button"
              onClick={this.selectForEvent.bind(this)}
              id="n-btn"
              value="N"
              style={this.getButtonStyle(this.state.currentSelected == "N")}
            />
            <input
              className="direction-button"
              type="button"
              onClick={this.selectForEvent.bind(this)}
              id="s-btn"
              value="S"
              style={this.getButtonStyle(this.state.currentSelected == "S")}
            />
            <input
              className="direction-button"
              type="button"
              onClick={this.selectForEvent.bind(this)}
              id="w-btn"
              value="W"
              style={this.getButtonStyle(this.state.currentSelected == "W")}
            />
            <input
              className="direction-button"
              type="button"
              onClick={this.selectForEvent.bind(this)}
              id="e-btn"
              value="E"
              style={this.getButtonStyle(this.state.currentSelected == "E")}
            />
          </div>
        </h1>

        <h4>Choose event type:</h4>
        <select
          id="event-select"
          name="eventType"
          value={this.getRoomOrDoor().eventType}
          onChange={this.onChangeStateVal.bind(this)}
        >
          <option val="None">No Event</option>
          <option val="Question">Question</option>
        </select>

        <div style={{ float: "right" }}>
          <input
            className="remove-button"
            type="button"
            onClick={this.removeRoom}
            id="remove-btn"
            value="Remove"
          />
        </div>

        <div style={{ float: "right" }}>
          <input
            className="se-button"
            type="button"
            onClick={this.setStart}
            id="start-btn"
            value="Start"
            style={this.getButtonStyle(
              this.props.create.graph.startRoom == this.props.create.activeRoom
            )}
          />
          <input
            className="se-button"
            type="button"
            onClick={this.setEnd}
            id="end-btn"
            value="End"
            style={this.getButtonStyle(
              this.props.create.graph.endRoom == this.props.create.activeRoom
            )}
          />
        </div>

        {/* This is only rendered if the room has an event attached to it */}
        <div
          style={
            this.getRoomOrDoor().eventType !== "No Event"
              ? styles.visible
              : styles.hidden
          }
        >
          <div>
            <h4>Event question:</h4>
            <input
              id="event-q"
              type="text"
              placeholder="Question"
              name="eventQ"
              value={this.getRoomOrDoor().eventQ}
              onChange={this.onChangeStateVal.bind(this)}
              style={this.getTextBoxStyle("eventQ")}
            ></input>
            <h4>Event answer:</h4>
            <input
              id="event-a"
              type="text"
              placeholder="Question"
              name="eventA"
              value={this.getRoomOrDoor().eventA}
              onChange={this.onChangeStateVal.bind(this)}
              style={this.getTextBoxStyle("eventA")}
            ></input>
          </div>

          <h4>
            Require Item to Trigger Event:{" "}
            <input
              type="checkbox"
              id="req-item-choice"
              name="requireItem"
              checked={this.getRoomOrDoor().requireItem}
              onChange={this.onChangeStateVal.bind(this)}
            ></input>
          </h4>

          {/* This is only rendered if the event requires an item to be triggered */}
          <div
            style={
              this.getRoomOrDoor().requireItem &&
              this.getRoomOrDoor().eventType !== "No Event"
                ? styles.visible
                : styles.hidden
            }
          >
            <h4>Item Name:</h4>
            <input
              id="req-item-name"
              type="text"
              placeholder="Name"
              name="requireItemName"
              value={this.getRoomOrDoor().requireItemName}
              onChange={this.onChangeStateVal.bind(this)}
              style={this.getTextBoxStyle("requireItemName")}
            ></input>
          </div>

          <h4>
            Item received upon solving:{" "}
            <input
              type="checkbox"
              id="solve-item-choice"
              name="solveItem"
              checked={this.getRoomOrDoor().solveItem}
              onChange={this.onChangeStateVal.bind(this)}
            ></input>
          </h4>

          {/* This is only rendered if an item will be awarded when completing the event */}
          <div
            style={
              this.getRoomOrDoor().solveItem &&
              this.getRoomOrDoor().eventType !== "No Event"
                ? styles.visible
                : styles.hidden
            }
          >
            <h4>Item Name:</h4>
            <input
              id="solve-item-name"
              type="text"
              placeholder="Name"
              name="solveItemName"
              value={this.getRoomOrDoor().solveItemName}
              onChange={this.onChangeStateVal.bind(this)}
              style={this.getTextBoxStyle("solveItemName")}
            ></input>
            <h4>Item Description:</h4>
            <input
              id="solve-item-desc"
              type="text"
              placeholder="Description"
              name="solveItemDesc"
              value={this.getRoomOrDoor().solveItemDesc}
              onChange={this.onChangeStateVal.bind(this)}
              style={this.getTextBoxStyle("solveItemDesc")}
            ></input>
          </div>
        </div>

        <div
          className="close-event-window"
          onClick={() => {
            this.props.setActiveRoom(undefined);
          }}
        >
          CLOSE
        </div>
      </div>
    );
  }
}

const EventWindow = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventWindowBind);

export default EventWindow;
