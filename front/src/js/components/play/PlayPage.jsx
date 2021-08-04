import React, { Component } from "react";

import PlayContainer from "./PlayContainer";

// Stores the state for the page state
class PlayPageState {
  constructor() {
    this.map = undefined;
  }
}

class PlayPage extends Component {
  constructor(props) {
    super(props);
    this.state = new PlayPageState();
  }
  componentDidMount() {
    const id = this.props.match.params.id;
    if (id === undefined) return;
    fetch("/api/getMap?id=" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        withCredentials: "true",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.map);
          this.setState({ map: data.map });
        } else {
          console.log(data);
        }
      })
      .catch((error) => {
        console.error("Error: " + error);
      });
  }
  render() {
    return (
      <div className="container">
        {this.state.map !== undefined ? (
          <PlayContainer 
            graph={this.state.map.graph}
            uid={this.state.map.uid} />
        ) : null}
      </div>
    );
  }
}

export default PlayPage;