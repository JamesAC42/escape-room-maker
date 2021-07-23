import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { createPageActions } from "../../actions/actions";

const mapStateToProps = (state, props) => ({
  create: state.create
});

const mapDispatchToProps = {
  setActiveRoom: createPageActions.setActiveRoom,
  setMap: createPageActions.setMap,
  setGraph: createPageActions.setGraph
}

class PublishWindowState {
  constructor() {
    this.title = '';
    this.description = '';
    this.tags = '';
    this.redirect = '';
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
      [e.target.name]: e.target.value
    });
  }
  publish() {
    console.log(this.state);
    let tags = this.state.tags.split(',');
    fetch('/api/createMap/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title:this.state.title,
        description:this.state.description,
        tags,
        timeLimit: 600,
        graph: this.props.create.graph,
        explicit: false
      })
    })
    .then(response => response.json())
    .then(data => {
      if(data.success) {
        this.setState({redirect:data.id});
        this.props.setActiveRoom(undefined);
        this.props.setGraph(undefined);
        this.props.setMap(undefined);
      } else {
        console.log(data);
      }
    })
    .catch(error => {
        console.error('Error: ' +  error);
    })
  }
  render() {
    if(this.state.redirect !== '') {
      return <Redirect to={"/map/" + this.state.redirect}/> 
    }
    return (
      <div className="publish-window-outer">
        <div className="publish-window-inner">
          <div 
            className="publish-window-background"></div>
          <div className="publish-window-modal flex flex-col flex-center">
            <div className="window-header">
              Publish Map
            </div>
            <div className="input-item">
                <label htmlFor="title">
                    Title
                </label>
                <input 
                    type="text" 
                    name="title"
                    placeholder="Title"
                    value={this.state.title}
                    onChange={(e) => this.handleText(e)}
                    maxLength={200}/>
            </div>
            <div className="input-item">
                <label htmlFor="description">
                    Description
                </label>
                <input 
                    type="text" 
                    name="description"
                    value={this.state.description}
                    onChange={(e) => this.handleText(e)}
                    placeholder="Description"
                    maxLength={200}/>
            </div>
            <div className="input-item">
                <label htmlFor="tags">
                    Tags
                </label>
                <input 
                    type="text" 
                    name="tags"
                    value={this.state.tags}
                    onChange={(e) => this.handleText(e)}
                    placeholder="Tags"
                    maxLength={200}/>
            </div>
            <div 
              className="button publish-button"
              onClick={() => this.publish()}>
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
