import React, { Component } from 'react';
import '../../../css/EventWindow.scss';
import '../../../css/grid.scss';

import { connect } from 'react-redux';
import store from "../../store";
import { createPageActions } from '../../actions/actions';

const styles  = {
  styleHidden: {
    "visibility": "hidden"
  },
  
  styleVisible: {
    "visibility": "visible"
  }
}

const mapStateToProps = (store) => ({
  create: store.create
})

const mapDispatchToProps = {
  setActiveRoom: createPageActions.setActiveRoom,
  setGraph: createPageActions.setGraph
}

class EventWindowState {
  constructor(pr) {
    this.props = pr;
    this.currentSelected = "Room";
  }
}

class EventWindowBind extends Component {
  constructor(props){
    super(props);
    this.state = new EventWindowState(props);
    console.log("this is the store");
    console.log(store.getState());
    console.log("these are the props");
    console.log(props);
    console.log("this is the EW state");
    console.log(this.state);
    this.props.create.graph.startRoom = Object.keys(this.props.create.graph.graph)[0];
    this.props.create.graph.endRoom = Object.keys(this.props.create.graph.graph)[0];
  }
  
  // sets the event type
  eventChoose = (e) => {
    let tempGraph = {...this.props.create.graph};
    tempGraph.graph[this.props.create.activeRoom].eventType = e.target.value;
    this.setGraph(tempGraph);
  }
  
  // determines if the event if for the active room or its N, S, W, or E door
  selectForEvent = (e) => {
    console.log("\n\n\ncurrentSelected is about to be", e.target.value, "\n\n\n")
    this.setState({
      currentSelected: e.target.value
    });
  }
  
  // determines if an item will be required to start the event when playing the map
  onReqItem = (checked) => {
    let tempGraph  = {...this.props.create.graph};
    tempGraph.graph[this.props.create.activeRoom].requireItem = checked;
    this.props.setGraph(tempGraph);
    console.log("THE NEW VALUE IS ", tempGraph.graph[this.props.create.activeRoom].requireItem);
    console.log("checked ", checked);
  }
  
  // determines if an item will be given to the player upon finishing the event when playing the map
  onSolveItem = (checked) => {
    let tempGraph  = {...this.props.create.graph};
    tempGraph.graph[this.props.create.activeRoom].solveItem = checked;
    this.props.setGraph(tempGraph);
    console.log("THE NEW VALUE IS ", tempGraph.graph[this.props.create.activeRoom].solveItem);
    console.log("checked ", checked);
  }
 
  onChangeStateVal = (e) => {
    
    console.log("onchangeStateVal graph.graph:", this.props.create.graph.graph);
    console.log("onchangeStateVal activeRoom:", this.props.create.activeRoom);
    console.log("onchangeStateVal st currentSelected:", this.state.currentSelected);
    let valType = e.target.type == "checkbox" ? "checked" : "value";
    if(this.state.currentSelected == "Room") {
      let tempGraph = this.props.create.graph;
      tempGraph.graph[this.props.create.activeRoom][e.target.attributes.name.value] = e.target[valType];
      this.props.setGraph(tempGraph);
    }
    else {
      let tempGraph = this.props.create.graph;
      tempGraph.graph[this.props.create.activeRoom]
                .doorVals.find(y => y.dir == this.state.currentSelected)[e.target.attributes.name.value] = e.target[valType];
      this.props.setGraph(tempGraph);
    }
    
    if(e.target.attributes.name.value == "requireItem") {
      this.onReqItem(e.target[valType]);
    }
    else if(e.target.attributes.name.value == "solveItem") {
      this.onSolveItem(e.target[valType]);
    }
  }
  
  setStart = () => {
    if(this.props.create.graph.endRoom != this.props.create.activeRoom) {
      let tempGraph = {...this.props.create.graph};
      tempGraph.startRoom = this.props.create.activeRoom;
      this.props.setGraph(tempGraph);
    }
  }
  
  setEnd = () => {
    if(this.props.create.graph.startRoom != this.props.create.activeRoom) {
      let tempGraph = {...this.props.create.graph};
      tempGraph.endRoom = this.props.create.activeRoom;
      this.props.setGraph(tempGraph);
    }
  }
  
  // coordinate combinations to use for checking if a square can be removed
  combinations = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
  ]
  
  // Returns true if the room with coordinates (x+i, y+j) will still
  // be an accessible room on the map if room (x, y) is removed
  // Returns false otherwise
  checkSquareStillValid = (x, y, i, j) => {
    
    let valid = false;
    
    // this loops over the squares adjacent to the one being checked
    // combinations of (a, b) => (-1, -1), (-1, 1), (1, -1), (1, 1)
    this.combinations.forEach(c => {
      // goes over all of the rooms to find a room with coordinates:
      //    "x" = (x + i) + c[0]
      //    "y" = (y + j) + c[1]
      Object.entries(this.props.create.graph.coordinates).forEach(adjacent => {
        // if an adjacent room is found, this square will still be accessible, so return true
        if(adjacent[1].x == x+i + c[0] && adjacent[1].y == y+j + c[1] &&
            !(x == x+i + c[0] && y == y+j + c[1])) {
          valid = true;
        }
      });
    });
    return valid;
  }
  
  // attempts to remove the active room from the map
  removeRoom = () => {
    
    let newGraph = {...this.props.create.graph};
    
    // the start room cannot be removed
    if(this.props.create.graph.startRoom == this.props.create.activeRoom) {
      alert("You cannot remove the start room");
      return;
    }
    // the end room cannot be removed
    if(this.props.create.graph.endRoom == this.props.create.activeRoom) {
      alert("You cannot remove the end room");
      return;
    }
    if(window.confirm("Are you sure you want to remove this room?")) {
      // check that the surrounding rooms are still accessible
      
      // gets the coordinates of the active room
      let coords = this.props.create.graph.coordinates[this.props.create.activeRoom];
      let valid = true;
      
      // checks the coordinates objects in the graph
      // when it finds a match for a room adjacent to the active room, it will
      // make sure that the room will still be accessible if the active room is
      // removed
      if(Object.keys(newGraph.coordinates).length > 2) {
        this.combinations.forEach(c => {
          Object.entries(this.props.create.graph.coordinates).forEach(r => {
            // console.log(`x=${coords.x+c[0]} y=${coords.y+c[1]} r.x=${r[1].x} r.y=${r[1].y}`);
            if(r[1].x == coords.x + c[0] && r[1].y == coords.y + c[1]) {
              if(!this.checkSquareStillValid(coords.x, coords.y, c[0], c[1])) {
                console.log("This won't be accessible: ", r[1].x, r[1].y);
                valid = false;
              }
            }
          })
        });
      }
      
      // if the room can be deleted
      if(valid) {
        let tempGraph = this.props.create.graph;
        delete tempGraph.graph[this.props.create.activeRoom];
        this.props.setGraph(tempGraph);
        let oldActive = this.props.create.activeRoom;
        // set the active room to another room in the map
        if(this.props.create.activeRoom != Object.keys(this.props.create.graph.graph)[0]) {
          this.props.setActiveRoom(Object.keys(this.props.create.graph.graph)[0]);
        }
        else {
          this.props.setActiveRoom(Object.keys(this.props.create.graph.graph)[1]);
        }
        // remove the room from the graph
        delete newGraph.graph[oldActive];
        delete newGraph.coordinates[oldActive];
        this.props.setGraph(newGraph);
        
      }
      // alert the user if the room cannot be deleted
      else {
        alert("Removing this square will make part of the map inaccessible");
      }
    }
  }
 
  getRoomOrDoor = () => {
    console.log("grod currentSelected", this.state.currentSelected);
    if(this.state.currentSelected == "Room") {
      console.log("grod g.g[ar]", this.props.create.graph.graph[this.props.create.activeRoom]);
      return this.props.create.graph.graph[this.props.create.activeRoom];
    }
    else {
      console.log("grod g.g[ar].dv[dir]", this.props.create.graph.graph[this.props.create.activeRoom].doorVals.find(y => y.dir == this.state.currentSelected));
      return this.props.create.graph.graph[this.props.create.activeRoom].doorVals.find(y => y.dir == this.state.currentSelected);
    }
  }
  
  getButtonStyle = (btn) => {
    return {
      backgroundColor: (this.state.currentSelected == btn ? "#8ffad1" : ""),
      borderColor: (this.state.currentSelected == btn ? "#6fdab1" : "")
    }
  }
 
  componentDidUpdate(prevProps) {
    console.log("prev props", prevProps);
    console.log("this.props", this.props);
    if(Object.keys(prevProps.create.graph.graph).length != Object.keys(this.props.create.graph.graph).length) {
      console.log("an update happened");
    }
  }
  
  render() {
    return(
      <div id="ew" className="canvas grid" style={this.props.create.activeRoom == undefined ? styles.styleHidden : this.props.style}>
        <h1>
          Room ID: <span style={{color: "#8ffad1"}}>{this.props.create.activeRoom}</span>
          <div style={{float: "right"}}>
            <input className="room-button" type="button" onClick={this.selectForEvent.bind(this)} id="room-btn" value="Room" style={this.getButtonStyle("Room")}/>
            <input className="direction-button" type="button" onClick={this.selectForEvent.bind(this)} id="n-btn" value="N" style={this.getButtonStyle("N")}/>
            <input className="direction-button" type="button" onClick={this.selectForEvent.bind(this)} id="s-btn" value="S" style={this.getButtonStyle("S")}/>
            <input className="direction-button" type="button" onClick={this.selectForEvent.bind(this)} id="w-btn" value="W" style={this.getButtonStyle("W")}/>
            <input className="direction-button" type="button" onClick={this.selectForEvent.bind(this)} id="e-btn" value="E" style={this.getButtonStyle("E")}/>
          </div>
        </h1>
        
        <h4>Choose event type:</h4>
        <select id="event-select" name="eventType" value={this.getRoomOrDoor().eventType} onChange={this.onChangeStateVal.bind(this)}>
          <option val="None">No Event</option>
          <option val="Question">Question</option>
        </select>
        
        <div style={{"float": "right"}}>
          <input className="remove-button" type="button" onClick={this.removeRoom} id="remove-btn" value="Remove"/>
        </div>
        
        <div style={{"float": "right"}}>
            <input className="se-button" type="button" onClick={this.setStart} id="start-btn" value="Start"  style={{backgroundColor: (this.props.create.graph.startRoom == this.props.create.activeRoom ? "#8ffad1" : ""), borderColor: (this.props.create.graph.startRoom == this.props.create.activeRoom ? "#6fdab1" : "")}}/>
            <input className="se-button" type="button" onClick={this.setEnd} id="end-btn" value="End"  style={{backgroundColor: (this.props.create.graph.endRoom == this.props.create.activeRoom ? "#8ffad1" : ""), borderColor: (this.props.create.graph.endRoom == this.props.create.activeRoom ? "#6fdab1" : "")}}/>
        </div>
        
        {/* This is rendered if the room has an event attached to it */}
        <div style={this.getRoomOrDoor().eventType !== "No Event" ? styles.styleVisible : styles.styleHidden}>
          
          <div>
            <h4>Event description:</h4>
            <input id="event-desc" type="text" placeholder="Question" name="eventDesc" value={this.getRoomOrDoor().eventDesc} onChange={this.onChangeStateVal.bind(this)}></input>
          </div>
          
          <h4>
            Require Item to Trigger Event: <input type="checkbox" id="req-item-choice" name="requireItem" value={this.getRoomOrDoor().requireItem}
              onChange={this.onChangeStateVal.bind(this)}></input>
          </h4>
          
          {/* This is rendered if the event requires an item to be triggered */}
          <div style={this.getRoomOrDoor.requireItem && this.getRoomOrDoor.eventType !== "No Event" ? styles.styleVisible : styles.styleHidden}>
            <h4>Item Name:</h4>
            <input id="req-item-name" type="text" placeholder="Name" name="requireItemName" value={this.getRoomOrDoor().requireItemName} onChange={this.onChangeStateVal.bind(this)}></input>
          </div>
          
          <h4>
            Item received upon solving: <input type="checkbox" id="solve-item-choice" name="solveItem" value={this.getRoomOrDoor().solveItem} onChange={this.onChangeStateVal.bind(this)}></input>
          </h4>
          
          {/* This is rendered if an item will be awarded when completing the event */}
          <div style={this.getRoomOrDoor.solveItem && this.getRoomOrDoor.eventType !== "No Event" ? styles.styleVisible : styles.styleHidden}>
            <h4>Item Name:</h4>
            <input id="solve-item-name" type="text" placeholder="Name" name="solveItemName" value={this.getRoomOrDoor().solveItemName} onChange={this.onChangeStateVal.bind(this)}></input>
            <h4>Item Description:</h4>
            <input id="solve-item-desc" type="text" placeholder="Description" name="solveItemDesc" value={this.getRoomOrDoor().solveItemDesc} onChange={this.onChangeStateVal.bind(this)}></input>
          </div>
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
