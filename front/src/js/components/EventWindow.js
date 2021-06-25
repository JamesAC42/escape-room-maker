import React, { Component } from 'react';
import '../../css/EventWindow.scss';

class EventWindowState {
  constructor(pr, et, ir, q, is) {
    this.props = pr;
    this.event_type = et;
    this.item_req = ir;
    this.question = q;
    this.item_solve = is;
  }
}

class EventWindow extends Component {
  constructor(props){
    super(props);
    this.state = new EventWindowState(props, "No Event", false, true, false);
  }
  
  eventChoose = (e) => {
    this.setState({
      event_type: e.target.value
    });
  }
  
  onItemReq = () => {
    this.setState({
      item_req: !this.state.item_req
    });
  }
  
  onQuestion = () => {
    this.setState({
      question: !this.state.question
    });
  }
  
  onItemSolve = () => {
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
  
  render() {
    return(
      <div id="ew" style={this.props.style}>
        <h1>Room: {this.props.room}</h1>
        
        <h4>Choose event type:</h4>
        <select id="event-select" onChange={this.eventChoose}>
          <option val="None">No Event</option>
          <option val="Door">Door Event</option>
          <option val="Room">Room Event</option>
        </select>
        
        {/* This is rendered if the room has an event attached to it */}
        <div style={this.state.event_type != "No Event" ? this.style_visible : this.style_hidden}>
          
          <h4>
            Require Item to Trigger Event: <input type="checkbox" id="question-choice" onChange={this.onItemReq}></input>
          </h4>
          
          {/* This is rendered if the event requires an item to be triggered */}
          <div style={this.state.item_req && this.state.event_type != "No Event" ? this.style_visible : this.style_hidden}>
            <h4>Item Name:</h4>
            <input id="event-q" type="text" placeholder="Name"></input>
          </div>
          
          <h4>
            Require Question: <input type="checkbox" id="question-choice" defaultChecked onChange={this.onQuestion}></input>
          </h4>
          
          {/* This is rendered if the event has a question attached to it */}
          <div style={this.state.question && this.state.event_type != "No Event" ? this.style_visible : this.style_hidden}>
            <h4>Event question:</h4>
            <input id="event-q" type="text" placeholder="Question"></input>
            <h4>Event answer:</h4>
            <input id="event-a" type="text" placeholder="Answer"></input>
          </div>
          
          <h4>
            Item received upon solving: <input type="checkbox" id="item-choice" onChange={this.onItemSolve}></input>
          </h4>
          
          {/* This is rendered if an item will be awarded when completing the event */}
          <div style={this.state.item_solve && this.state.event_type != "No Event" ? this.style_visible : this.style_hidden}>
            <h4>Item Name:</h4>
            <input id="item-name" type="text" placeholder="Name"></input>
            <h4>Item Description:</h4>
            <input id="item-desc" type="text" placeholder="Description"></input>
          </div>
        </div>
        
      </div>  
    );
  }
}

export default EventWindow;
