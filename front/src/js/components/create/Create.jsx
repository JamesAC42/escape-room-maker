import React, { Component } from "react";
import { connect } from "react-redux";
import Grid from "./Grid";
import EventWindow from "./EventWindow";
import { Redirect } from "react-router";
import { nanoid } from 'nanoid';

import '../../../css/create/create.scss';

import PublishWindow from './PublishWindow';

import { 
  Map,
  Graph,
  Room,
  Coordinates
} from './MapClasses';

import {createPageActions} from '../../actions/actions';

const mapStateToProps = (state, props) => ({
  session: state.session,
  create: state.create
});

const mapDispatchToProps = {
  setMap: createPageActions.setMap,
  setGraph: createPageActions.setGraph
}

class CreateState {
  publishWindowVisible;
  constructor() {
    this.publishWindowVisible = false;
  }
}

class CreateBind extends Component {

  state;
  constructor(props) {
    super(props);
    this.state = new CreateState();
  }

  initializeGraph() {
    const g = new Graph();
    const roomId = nanoid();
    const roomCoords = new Coordinates(0, 0);
    const newRoom = new Room(roomId, roomCoords);
    g.graph[roomId] = newRoom;
    g.coordinates[roomId] = roomCoords;
    this.props.setGraph(g);
  }

  componentDidMount() {
    if(this.props.create.map === undefined) {
      this.props.setMap(new Map());
    }
    if(this.props.create.graph === undefined) {
      this.initializeGraph();
    }
  }

  togglePublishWindow() {
    this.setState({
      publishWindowVisible: !this.state.publishWindowVisible
    })
  }

  render() {
    if (!this.props.session.loggedin) {
      return <Redirect to="/login/create" />;
    }
    let gridClass = "create-grid";
    if(this.state.publishWindowVisible)
      gridClass += " canvas-hide";
    return (
      <div className="container create-container">
        <Grid 
          className={gridClass}
          activeRoom={this.props.create.activeRoom}
          graph={this.props.create.graph}/>
        <div style={{position: "absolute", left: "67%", width: "30%"}}>
        </div>
        {
          this.state.publishWindowVisible ?
          <PublishWindow 
            close={() => this.togglePublishWindow()}/>
            : null
        }
        <div 
          className="toggle-publish button"
          onClick={() => this.togglePublishWindow()}>
          { 
            this.state.publishWindowVisible ?
            "Back to Edit" : "Publish"
          }
        </div>
      </div>
    );
  }
}

const Create = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateBind);

export default Create;
