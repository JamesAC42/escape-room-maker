import React, { Component } from 'react';
import '../../../css/EventWindow.scss';

import { connect } from 'react-redux';
import store from "../../store";

const mapStateToProps = (store) => ({
  create: store.create
})

class EventWindowState {
  constructor(pr, et, ir, q, is) {
    this.props = pr;
    this.event_type = et;
    this.item_req = ir;
    this.question = q;
    this.item_solve = is;
    this.roomVals = null;
  }
}

class EventWindowBind extends Component {
  constructor(props){
    super(props);
    this.state = new EventWindowState(props, "No Event", false, true, false);
    console.log("this tisdh thj st stoesrsjhrkjhe");
    console.log(store.getState());
  }
  
  eventChoose = (e) => {
    this.setState({
      event_type: e.target.value
    });
  }
  
  onReqItem = () => {
    this.setState({
      item_req: !this.state.item_req
    });
  }
  
  onReqQuestion = () => {
    this.setState({
      question: !this.state.question
    });
  }
  
  onSolveItem = () => {
    this.setState({
      item_solve: !this.state.item_solve
    });
  }
  
  style_hidden = {
    "visibility": "hidden"
  }
  
  style_visible = {
    "visibility": "visible"
  }
  
  mapGraph = () => {
    console.log("graph")
    console.log(this.props.create.graph === undefined ? "graph und" : Object.keys(this.props.create.graph.graph));
    if(this.props.create.graph && this.state.roomVals === null) {
      console.log("typeof", typeof this.props.create.graph.coordinates);
      this.state.roomVals = Object.keys(this.props.create.graph.coordinates).map(x => ({
        room: x,
        requireItem: false,
        requireItemName: "req item name" + x,
        requireQuestion: true,
        eventQuestion: "event question" + x,
        eventAnswer: "event answer" + x,
        solveItem: false,
        solveItemName: "solve item name" + x,
        solveItemDesc: "solve item desc" + x,
      }));
    }
    console.log("roomVals: ", this.state.roomVals);
  }
  
  setEWInputs = () => {
    if(this.state.roomVals !== null && this.props.create.activeRoom) {
      var currRoom = this.state.roomVals.find(x => x.room === this.props.create.activeRoom);
      document.getElementById("req-item-choice").checked = currRoom.requireItem;
      document.getElementById("req-item-name").value = currRoom.requireItemName;
      document.getElementById("question-choice").checked = currRoom.requireQuestion;
      document.getElementById("event-q").value = currRoom.eventQuestion;
      document.getElementById("event-a").value = currRoom.eventAnswer;
      document.getElementById("solve-item-choice").checked = currRoom.solveItem;
      document.getElementById("solve-item-name").value = currRoom.solveItemName;
      document.getElementById("solve-item-desc").value = currRoom.solveItemDesc;
      
      this.state.item_req = currRoom.requireItem;
      this.state.question = currRoom.requireQuestion;
      this.state.item_solve = currRoom.solveItem;
    }
  }
  
  onChangeRequireItem = () => {
    console.log("document.getElementById(\"req-item-choice\").value",document.getElementById("req-item-choice").checked);
    this.state.roomVals.find(x => x.room === this.props.create.activeRoom).requireItem = document.getElementById("req-item-choice").checked;
    this.onReqItem();
  }
  
  onChangeRequireItemName = () => {
    console.log("document.getElementById(\"req-item-name\").value",document.getElementById("req-item-name").value);
    this.state.roomVals.find(x => x.room === this.props.create.activeRoom).requireItemName = document.getElementById("req-item-name").value;
  }
  
  onChangeRequireQuestion = () => {
    console.log("document.getElementById(\"question-choice\").value",document.getElementById("question-choice").checked);
    this.state.roomVals.find(x => x.room === this.props.create.activeRoom).requireQuestion = document.getElementById("question-choice").checked;
    this.onReqQuestion();
  }
  
  onChangeEventQuestion = () => {
    console.log("document.getElementById(\"event-q\").value",document.getElementById("event-q").value);
    this.state.roomVals.find(x => x.room === this.props.create.activeRoom).eventQuestion = document.getElementById("event-q").value;
  }
  
  onChangeEventAnswer = () => {
    console.log("document.getElementById(\"event-a\").value",document.getElementById("event-a").value);
    this.state.roomVals.find(x => x.room === this.props.create.activeRoom).eventAnswer = document.getElementById("event-a").value;
  }
  
  onChangeSolveItem = () => {
    console.log("document.getElementById(\"solve-item-choice\").value",document.getElementById("solve-item-choice").checked);
    this.state.roomVals.find(x => x.room === this.props.create.activeRoom).solveItem = document.getElementById("solve-item-choice").checked;
    this.onSolveItem();
  }
  
  onChangeSolveItemName = () => {
    console.log("document.getElementById(\"solve-item-name\").value",document.getElementById("solve-item-name").value);
    this.state.roomVals.find(x => x.room === this.props.create.activeRoom).solveItemName = document.getElementById("solve-item-name").value;
  }
  
  onChangeSolveItemDesc = () => {
    console.log("document.getElementById(\"solve-item-desc\").value",document.getElementById("solve-item-desc").value);
    this.state.roomVals.find(x => x.room === this.props.create.activeRoom).solveItemDesc = document.getElementById("solve-item-desc").value;
  }
  
  render() {
    return(
      <div id="ew" style={this.props.create.activeRoom === undefined ? this.style_hidden : this.props.style}>
        <h1>Room: <span style={{color: "aliceblue"}}>{this.props.create.activeRoom}</span></h1>
        {this.mapGraph()}
        <h4>Choose event type:</h4>
        <select id="event-select" onChange={this.eventChoose}>
          <option val="None">No Event</option>
          <option val="Door">Door Event</option>
          <option val="Room">Room Event</option>
        </select>
        
        {/* This is rendered if the room has an event attached to it */}
        <div style={this.state.event_type !== "No Event" ? this.style_visible : this.style_hidden}>
          
          <h4>
            Require Item to Trigger Event: <input type="checkbox" id="req-item-choice" onChange={this.onChangeRequireItem}></input>
          </h4>
          
          {/* This is rendered if the event requires an item to be triggered */}
          <div style={this.state.item_req && this.state.event_type !== "No Event" ? this.style_visible : this.style_hidden}>
            <h4>Item Name:</h4>
            <input id="req-item-name" type="text" placeholder="Name" onChange={this.onChangeRequireItemName}></input>
          </div>
          
          <h4>
            Require Question: <input type="checkbox" id="question-choice" onChange={this.onChangeRequireQuestion}></input>
          </h4>
          
          {/* This is rendered if the event has a question attached to it */}
          <div style={this.state.question && this.state.event_type !== "No Event" ? this.style_visible : this.style_hidden}>
            <h4>Event question:</h4>
            <input id="event-q" type="text" placeholder="Question" onChange={this.onChangeEventQuestion}></input>
            <h4>Event answer:</h4>
            <input id="event-a" type="text" placeholder="Answer" onChange={this.onChangeEventAnswer}></input>
          </div>
          
          <h4>
            Item received upon solving: <input type="checkbox" id="solve-item-choice" onChange={this.onChangeSolveItem}></input>
          </h4>
          
          {/* This is rendered if an item will be awarded when completing the event */}
          <div style={this.state.item_solve && this.state.event_type !== "No Event" ? this.style_visible : this.style_hidden}>
            <h4>Item Name:</h4>
            <input id="solve-item-name" type="text" placeholder="Name" onChange={this.onChangeSolveItemName}></input>
            <h4>Item Description:</h4>
            <input id="solve-item-desc" type="text" placeholder="Description" onChange={this.onChangeSolveItemDesc}></input>
          </div>
        </div>
        
        {this.setEWInputs()}
        
      </div>  
    );
  }
}

const EventWindow = connect(
  mapStateToProps
)(EventWindowBind);

export default EventWindow;
