import React, { Component } from "react";
import Grid from "./Grid";
import EventWindow from "./EventWindow";

class Create extends Component {

  render() {
    return (
      <div className="container">
        <Grid />
        <div style={{position: "absolute", left: "40%", width: "55%"}}>
          <EventWindow />
        </div>
      </div>
    );
  }
}

export default Create;
