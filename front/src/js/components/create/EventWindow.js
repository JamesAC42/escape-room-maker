import React, { Component } from 'react';
import '../../../css/EventWindow.scss';
import '../../../css/grid.scss';

import { connect } from 'react-redux';
import store from "../../store";
import { createPageActions } from '../../actions/actions';
import { eventWindowActions } from '../../actions/eventWindowActions';

const mapStateToProps = (store) => ({
  create: store.create,
  eventWindow: store.eventWindow
})

const mapDispatchToProps = {
  setRoomVals: eventWindowActions.setRoomVals
}

class EventWindowState {
  constructor(pr, et, ir, d, is) {
    this.props = pr;
    this.event_type = et;
    this.item_req = ir;
    this.desc = d;
    this.item_solve = is;
    this.roomVals = null;
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
  }
  
  eventChoose = (e) => {
    this.state.roomVals.find(x => x.room == this.props.create.activeRoom).eventType = e.target.value;
    this.setState({
      event_type: e.target.value
    });
  }
  
  selectForEvent = (e) => {
    console.log("\n\n\ncurrentSelected is about to be", e.target.value, "\n\n\n")
    this.setState({
      currentSelected: e.target.value
    });
  }
  
  onReqItem = (checked) => {
    this.setState({
      item_req: checked
    });
  }
  
  onSolveItem = (checked) => {
    this.setState({
      item_solve: checked
    });
  }
  
  style_hidden = {
    "visibility": "hidden"
  }
  
  style_visible = {
    "visibility": "visible"
  }
  
  mapGraph = () => {
    console.log("the props");
    console.log(this.props);
    
    
    console.log(this.props.create.graph == undefined ? "graph und" : "rooms: " + Object.keys(this.props.create.graph.graph));
    if(this.props.create.graph) {
      if(this.state.roomVals == null) {
        console.log("typeof", typeof this.props.create.graph.graph);
        this.state.roomVals = Object.keys(this.props.create.graph.graph).map(x => ({
          room: x,
          eventType: "No Event",
          requireItem: false,
          requireItemName: "req item name" + x,
          requireQuestion: true,
          eventDesc: "event desc" + x,
          solveItem: false,
          solveItemName: "solve item name" + x,
          solveItemDesc: "solve item desc" + x,
          doorVals: ["N", "S", "W", "E"].map(dir => ({
            dir: dir,
            room: x,
            eventType: "No Event",
            requireItem: false,
            requireItemName: dir + " - req item name" + x,
            requireQuestion: true,
            eventDesc: dir + " - event desc" + x,
            solveItem: false,
            solveItemName: dir + " - solve item name" + x,
            solveItemDesc: dir + " - solve item desc" + x,
          }))
        }));
      }
      else {
        if(this.state.roomVals.length != Object.keys(this.props.create.graph.graph).length){
          Object.keys(this.props.create.graph.graph).forEach(x => {
            if(!this.state.roomVals.find(r => r.room == x)) {
              this.state.roomVals.push({
                room: x,
                eventType: "No Event",
                requireItem: false,
                requireItemName: "req item name - " + x,
                requireQuestion: true,
                eventDesc: "event desc - " + x,
                solveItem: false,
                solveItemName: "solve item name - " + x,
                solveItemDesc: "solve item desc - " + x,
                doorVals: ["N", "S", "W", "E"].map(dir => ({
                  dir: dir,
                  room: x,
                  eventType: "No Event",
                  requireItem: false,
                  requireItemName: dir + " - req item name - " + x,
                  requireQuestion: true,
                  eventDesc: dir + " - event desc - " + x,
                  solveItem: false,
                  solveItemName: dir + " - solve item name - " + x,
                  solveItemDesc: dir + " - solve item desc - " + x,
                }))
              });
            }
          });
        }
      }
    }
    console.log("roomVals: ", this.state.roomVals);
  }
  
  setInitRenderVals = () => {
    if(this.state.roomVals !== null && this.props.create.activeRoom) {
      if(this.state.currentSelected == "Room") {
        var currSelect = this.state.roomVals.find(x => x.room == this.props.create.activeRoom);
      }
      else {
        var currSelect = this.state.roomVals.find(x => x.room == this.props.create.activeRoom).doorVals.find(y => y.dir == this.state.currentSelected);
      }
      this.state.event_type = currSelect.eventType;
      this.state.item_req = currSelect.requireItem;
      this.state.item_solve = currSelect.solveItem;
    }
  }
  
  setEWInputs = () => {
    if(this.state.roomVals !== null && this.props.create.activeRoom) {
      if(this.state.currentSelected == "Room") {
        var currSelect = this.state.roomVals.find(x => x.room == this.props.create.activeRoom);
      }
      else {
        var currSelect = this.state.roomVals.find(x => x.room == this.props.create.activeRoom).doorVals.find(y => y.dir == this.state.currentSelected);
      }
      document.getElementById("event-select").value = currSelect.eventType;
      document.getElementById("req-item-choice").checked = currSelect.requireItem;
      document.getElementById("req-item-name").value = currSelect.requireItemName;
      document.getElementById("event-desc").value = currSelect.eventDesc;
      document.getElementById("solve-item-choice").checked = currSelect.solveItem;
      document.getElementById("solve-item-name").value = currSelect.solveItemName;
      document.getElementById("solve-item-desc").value = currSelect.solveItemDesc;
    }
  }
  
  onChangeStateVal = (e) => {
    var valType = e.target.type == "checkbox" ? "checked" : "value";
    if(this.state.currentSelected == "Room") {
      this.state.roomVals.find(x => x.room == this.props.create.activeRoom)[e.target.attributes.name.value] = e.target[valType];
    }
    else {
      this.state.roomVals.find(x => x.room == this.props.create.activeRoom)
                .doorVals.find(y => y.dir == this.state.currentSelected)[e.target.attributes.name.value] = e.target[valType];
    }
    this.props.setRoomVals(this.state.roomVals);
    if(e.target.attributes.name.value == "requireItem") {
      this.onReqItem(e.target[valType]);
    }
    else if(e.target.attributes.name.value == "solveItem") {
      this.onSolveItem(e.target[valType]);
    }
  }
  
  render() {
    return(
      <div id="ew" className="canvas grid" style={this.props.create.activeRoom == undefined ? this.style_hidden : this.props.style}>
        {this.mapGraph()}
        {this.setInitRenderVals()}
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
        
        {/* This is rendered if the room has an event attached to it */}
        <div style={this.state.event_type !== "No Event" ? this.style_visible : this.style_hidden}>
          
          <div>
            <h4>Event description:</h4>
            <input id="event-desc" type="text" placeholder="Question" name="eventDesc" onChange={this.onChangeStateVal.bind(this)}></input>
          </div>
          
          <h4>
            Require Item to Trigger Event: <input type="checkbox" id="req-item-choice" name="requireItem"
              onChange={this.onChangeStateVal.bind(this)}></input>
          </h4>
          
          {/* This is rendered if the event requires an item to be triggered */}
          <div style={this.state.item_req && this.state.event_type !== "No Event" ? this.style_visible : this.style_hidden}>
            <h4>Item Name:</h4>
            <input id="req-item-name" type="text" placeholder="Name" name="requireItemName" onChange={this.onChangeStateVal.bind(this)}></input>
          </div>
          
          <h4>
            Item received upon solving: <input type="checkbox" id="solve-item-choice" name="solveItem" onChange={this.onChangeStateVal.bind(this)}></input>
          </h4>
          
          {/* This is rendered if an item will be awarded when completing the event */}
          <div style={this.state.item_solve && this.state.event_type !== "No Event" ? this.style_visible : this.style_hidden}>
            <h4>Item Name:</h4>
            <input id="solve-item-name" type="text" placeholder="Name" name="solveItemName" onChange={this.onChangeStateVal.bind(this)}></input>
            <h4>Item Description:</h4>
            <input id="solve-item-desc" type="text" placeholder="Description" name="solveItemDesc" onChange={this.onChangeStateVal.bind(this)}></input>
          </div>
        </div>
        
        {this.setEWInputs()}
        
      </div>  
    );
  }
}

const EventWindow = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventWindowBind);

export default EventWindow;
