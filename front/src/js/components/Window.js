import React, { Component } from "react";
import "../../css/Window.scss";

// Component that render a simple popup window
class Window extends Component {
  render() {
    let headText = this.props.headText;
    // maybe have text and images and stuff?
    // maybe have a way to change which?
    return <div className="window"></div>;
  }
}

export default Window;
