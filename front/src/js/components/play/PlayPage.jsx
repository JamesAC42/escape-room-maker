import React, { Component } from "react";

import PlayContainer from "./PlayContainer";

// Stores the state for the page state
class PlayPageState {
  constructor() {
    this.map = undefined;
  }
}

// The page level component class for playing a given map
class PlayPage extends Component {
  constructor(props) {
    super(props);
    this.state = new PlayPageState();
  }

  // Get the map data from the server when the page loads
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
          this.setState({ map: data.map });
        } else {
          console.log(data);
        }
      })
      .catch((error) => {
        console.error("Error: " + error);
      });
  }
  // Render the PlayContainer with the map data
  render() {
    return (
      <div className="container">
        {this.state.map !== undefined ? (
          <PlayContainer 
            graph={this.state.map.graph}
            timeLimit={this.state.map.timeLimit}
            uid={this.state.map.uid} />
        ) : null}
      </div>
    );
  }
}

export default PlayPage;