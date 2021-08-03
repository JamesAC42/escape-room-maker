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

class PublishWindowState {
  constructor() {
    this.title = "";
    this.description = "";
    this.tags = [];
    this.redirect = "";
  }
}

class PublishWindowBind extends Component {
  state;
  constructor(props) {
    super(props);
    this.state = new PublishWindowState();
  }
  handleText(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  toggleTag(tag) {
    let activeTags = [...this.state.tags];
    if (activeTags.indexOf(tag) === -1) {
      activeTags.push(tag);
    } else {
      activeTags.splice(activeTags.indexOf(tag), 1);
    }
    this.setState({ tags: activeTags });
  }
  tagClass(tag) {
    let className = "tag";
    if (this.state.tags.indexOf(tag) !== -1) {
      className += " tag-active";
    }
    return className;
  }
  publish() {
    if (this.state.title === "") return;
    if (this.state.description === "") return;
    console.log("the graph is:");
    console.log(this.props.create.graph);
    console.log(JSON.stringify(this.props.create.graph));
    fetch("/api/createMap/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: this.state.title,
        description: this.state.description,
        tags: this.state.tags,
        timeLimit: 600,
        graph: this.props.create.graph,
        explicit: false,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
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
  render() {
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
