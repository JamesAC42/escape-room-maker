import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { createPageActions } from "../../actions/actions";

const mapStateToProps = (state, props) => ({
  create: state.create,
});

const mapDispatchToProps = {
  setActiveRoom: createPageActions.setActiveRoom,
  setMap: createPageActions.setMap,
  setGraph: createPageActions.setGraph,
};

// Titles for all tag buttons
const _tags = [
  "Fun",
  "Not Fun",
  "Fast",
  "Slow",
  "Medieval",
  "Mansion",
  "Deep Narrative",
  "Dungeon",
  "Horror",
  "Comedy",
  "Adventure",
  "Action",
  "Mystery",
];

// Stores the state and input values for the Publish Window
class PublishWindowState {
  constructor() {
    this.title = "";
    this.description = "";
    this.timeLimit = 0;
    this.tags = [];
    this.redirect = "";
    this.error = "";
  }
}


// The PublishWindow component class used for publishing a map,
// allows user to give more information to a map including 
// a title, description, and tags
class PublishWindowBind extends Component {
  state;
  constructor(props) {
    super(props);
    this.state = new PublishWindowState();
  }

  // Event handler for when a user changes some text input fields
  handleText(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  // Event handler for setting the active tags when a user clicks one
  toggleTag(tag) {
    let activeTags = [...this.state.tags];
    if (activeTags.indexOf(tag) === -1) {
      activeTags.push(tag);
    } else {
      activeTags.splice(activeTags.indexOf(tag), 1);
    }
    this.setState({ tags: activeTags });
  }

  // Returns the css class for a tag based on whether it is active or not
  tagClass(tag) {
    let className = "tag";
    if (this.state.tags.indexOf(tag) !== -1) {
      className += " tag-active";
    }
    return className;
  }

  // Method to send the map data to the server to publish the new map
  publish() {

    // Validate that a title and description have been given
    if (this.state.title === "" || this.state.description === "") {
      this.setState({ error: "Invalid input: Need title and description" });
      return;
    }
    // Make the API request
    fetch("/api/createMap/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: this.state.title,
        description: this.state.description,
        tags: this.state.tags,
        timeLimit: parseInt(this.state.timeLimit) * 60,
        graph: this.props.create.graph,
        explicit: false,
      }),
    })
      .then((response) => response.json())
      .then((data) => {

        // If successful, reset the data and redirect to the
        // map info page of the new map
        if (data.success) {
          this.setState({ redirect: data.id });
          this.props.setActiveRoom(undefined);
          this.props.setGraph(undefined);
          this.props.setMap(undefined);
        } else {
          console.log(data);
        }
      })
      .catch((error) => {
        console.error("Error: " + error);
      });
  }

  handleTimeLimit(e) {
    this.setState({timeLimit:e.target.value});
  }

  render() {

    // If we need to redirect after publishing, then do so here
    if (this.state.redirect !== "") {
      return <Redirect to={"/map/" + this.state.redirect} />;
    }
    return (
      <div className="publish-window-outer">
        <div className="publish-window-inner">
          <div className="publish-window-background"></div>
          <div className="publish-window-modal flex flex-col flex-center">
            <div className="window-header">Publish Map</div>
            <div className="input-item">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={this.state.title}
                onChange={(e) => this.handleText(e)}
                maxLength={200}
              />
            </div>
            <div className="input-item">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                name="description"
                value={this.state.description}
                onChange={(e) => this.handleText(e)}
                placeholder="Description"
                maxLength={200}
              />
            </div>
            <div className="input-item">
              <label htmlFor="description">Time Limit</label>
              <select name="timelimit" onChange={(e) => this.handleTimeLimit(e)}>
                <option value="0">None</option>
                <option value="1">1 Minute</option>
                <option value="5">5 Minutes</option>
                <option value="10">10 Minutes</option>
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">1 Hour</option>
                <option value="90">1.5 Hours</option>
                <option value="120">2 Hours</option>
              </select>
            </div>
            <div className="input-item">
              <label className="tag-label" htmlFor="tags">
                Tags
              </label>
              <div className="tags-container flex flex-row">
                {_tags.map((tag) => (
                  <div
                    className={this.tagClass(tag)}
                    onClick={() => this.toggleTag(tag)}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
            <div
              className="button publish-button"
              onClick={() => this.publish()}
            >
              PUBLISH
            </div>
            <div className="publish-error">{this.state.error}</div>
          </div>
        </div>
      </div>
    );
  }
}

const PublishWindow = connect(
  mapStateToProps,
  mapDispatchToProps
)(PublishWindowBind);

export default PublishWindow;
