import React, { Component } from "react";

// Component that renders a text box that can resize itself based on the input length
class ResizableTextBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      rows: 3,
      minRows: 3,
      maxRows: 5,
    };
  }

  handleChange = (event) => {
    const textareaLineHeight = 24; //Make slightly larger than the font size
    const { minRows, maxRows } = this.state;

    const previousRows = event.target.rows;
    event.target.rows = minRows; // reset number of rows in textarea

    const currentRows = Math.floor(
      event.target.scrollHeight / textareaLineHeight
    );

    if (currentRows == previousRows) {
      event.target.rows = currentRows;
    }

    if (currentRows >= maxRows) {
      event.target.rows = maxRows;
      event.target.scrollTop = event.target.scrollHeight;
    }

    this.setState({
      value: event.target.value,
      rows: currentRows < maxRows ? currentRows : maxRows,
    });
  };

  render() {
    return (
      <textarea
        value={this.state.value}
        rows={this.state.rows}
        placeholder={""}
        className={"textarea"}
        onChange={this.handleChange}
      />
    );
  }
}
export default ResizableTextBox;
