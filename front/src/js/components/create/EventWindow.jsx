import React, { Component } from 'react';
import '../../../css/EventWindow.scss';
import '../../../css/grid.scss';

import { connect } from 'react-redux';
import store from "../../store";
import { createPageActions } from '../../actions/actions';
import { eventWindowActions } from '../../actions/eventWindowActions';

const styles  = {
  styleHidden: {
    "visibility": "hidden"
  },
  
  styleVisible: {
    "visibility": "visible"
  }
}

const mapStateToProps = (store) => ({
  create: store.create,
  eventWindow: store.eventWindow
})

const mapDispatchToProps = {
  setRoomVals: eventWindowActions.setRoomVals,
  setActiveRoom: createPageActions.setActiveRoom,
  setGraph: createPageActions.setGraph
}

class EventWindowState {
  constructor(pr, et, ir, d, is) {
    this.props = pr;
    this.event_type = et;
    this.item_req = ir;
    this.desc = d;
    this.item_solve = is;
    this.currentSelected = "Room";
  }
}

class EventWindowBind extends Component {
  constructor(props){
    super(props);
    this.state = new EventWindowState(props, "No Event", false, true, false);
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
    var tempGraph = this.props.create.graph;
    tempGraph.graph[this.props.create.activeRoom].eventType = e.target.value;
    this.setState({
      event_type: e.target.value
    });
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
    this.setState({
      item_req: checked
    });
  }
  
  // determines if an item will be given to the player upon finishing the event when playing the map
  onSolveItem = (checked) => {
    this.setState({
      item_solve: checked
    });
  }
  
  setInitRenderVals = () => {
    if(this.props.create.activeRoom) {
      if(this.state.currentSelected == "Room") {
        var currSelect = this.props.create.graph.graph[this.props.create.activeRoom];
      }
      else {
        var currSelect = this.props.create.graph.graph[this.props.create.activeRoom].doorVals.find(y => y.dir == this.state.currentSelected);
      }
      this.setState({
        event_type: currSelect.eventType,
        item_req: currSelect.requireItem,
        item_solve: currSelect.solveItem
      })
    }
  }
  
  onChangeStateVal = (e) => {
    
    console.log("cr graph.graph:", this.props.create.graph.graph);
    console.log("activeRoom:", this.props.create.activeRoom);
    var valType = e.target.type == "checkbox" ? "checked" : "value";
    if(this.state.currentSelected == "Room") {
      var tempGraph = this.props.create.graph;
      tempGraph.graph[this.props.create.activeRoom][e.target.attributes.name.value] = e.target[valType];
      this.props.setGraph(tempGraph);
    }
    else {
      var tempGraph = this.props.create.graph;
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
    let graph = {...this.props.create.graph};
    if(graph.endRoom != this.props.create.activeRoom) {
      graph.startRoom = this.props.create.activeRoom;
      this.props.setGraph(graph);
    }
  }
  
  setEnd = () => {
    let graph = {...this.props.create.graph};
    if(graph.startRoom != this.props.create.activeRoom) {
      graph.endRoom = this.props.create.activeRoom;
      this.props.setGraph(graph);
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
    
    var valid = false;
    
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
    
    var newGraph = {...this.props.create.graph};
    
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
      var coords = this.props.create.graph.coordinates[this.props.create.activeRoom];
      var valid = true;
      
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
        var tempGraph = this.props.create.graph;
        delete tempGraph.graph[this.props.create.activeRoom];
        this.props.setGraph(tempGraph);
        var oldActive = this.props.create.activeRoom;
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

  componentDidMount() {
    this.setInitRenderVals();
  }
  
  componentDidUpdate(prevProps, props) {
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
            <input className="direction-button" type="button" onClick={this.selectForEvent.bind(this)} id="room-btn" value="Room" style={{width: "6rem", backgroundColor: (this.state.currentSelected == "Room" ? "#8ffad1" : ""), borderColor: (this.state.currentSelected == "Room" ? "#6fdab1" : "")}}/>
            <input className="direction-button" type="button" onClick={this.selectForEvent.bind(this)} id="n-btn" value="N"  style={{backgroundColor: (this.state.currentSelected == "N" ? "#8ffad1" : ""), borderColor: (this.state.currentSelected == "N" ? "#6fdab1" : "")}}/>
            <input className="direction-button" type="button" onClick={this.selectForEvent.bind(this)} id="s-btn" value="S"  style={{backgroundColor: (this.state.currentSelected == "S" ? "#8ffad1" : ""), borderColor: (this.state.currentSelected == "S" ? "#6fdab1" : "")}}/>
            <input className="direction-button" type="button" onClick={this.selectForEvent.bind(this)} id="w-btn" value="W"  style={{backgroundColor: (this.state.currentSelected == "W" ? "#8ffad1" : ""), borderColor: (this.state.currentSelected == "W" ? "#6fdab1" : "")}}/>
            <input className="direction-button" type="button" onClick={this.selectForEvent.bind(this)} id="e-btn" value="E"  style={{backgroundColor: (this.state.currentSelected == "E" ? "#8ffad1" : ""), borderColor: (this.state.currentSelected == "E" ? "#6fdab1" : "")}}/>
          </div>
        </h1>
        
        <h4>Choose event type:</h4>
        <select id="event-select" name="eventType" onChange={this.onChangeStateVal.bind(this)}>
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
        <div style={this.state.event_type !== "No Event" ? styles.styleVisible : styles.styleHidden}>
          
          <div>
            <h4>Event description:</h4>
            <input id="event-desc" type="text" placeholder="Question" name="eventDesc" onChange={this.onChangeStateVal.bind(this)}></input>
          </div>
          
          <h4>
            Require Item to Trigger Event: <input type="checkbox" id="req-item-choice" name="requireItem"
              onChange={this.onChangeStateVal.bind(this)}></input>
          </h4>
          
          {/* This is rendered if the event requires an item to be triggered */}
          <div style={this.state.item_req && this.state.event_type !== "No Event" ? styles.styleVisible : styles.styleHidden}>
            <h4>Item Name:</h4>
            <input id="req-item-name" type="text" placeholder="Name" name="requireItemName" onChange={this.onChangeStateVal.bind(this)}></input>
          </div>
          
          <h4>
            Item received upon solving: <input type="checkbox" id="solve-item-choice" name="solveItem" onChange={this.onChangeStateVal.bind(this)}></input>
          </h4>
          
          {/* This is rendered if an item will be awarded when completing the event */}
          <div style={this.state.item_solve && this.state.event_type !== "No Event" ? styles.styleVisible : styles.styleHidden}>
            <h4>Item Name:</h4>
            <input id="solve-item-name" type="text" placeholder="Name" name="solveItemName" onChange={this.onChangeStateVal.bind(this)}></input>
            <h4>Item Description:</h4>
            <input id="solve-item-desc" type="text" placeholder="Description" name="solveItemDesc" onChange={this.onChangeStateVal.bind(this)}></input>
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
