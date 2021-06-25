import React, { Component } from "react";

import "../../../css/create/grid.scss";
import mockGraph from "../../mock-data/roomGraph";

import tileImage from '../../../images/woodtile.png';

import { connect } from 'react-redux';
import { createPageActions } from '../../actions/actions';

const mapStateToProps = (store) => ({
  create: store.create
})

const mapDispatchToProps = {
  setActiveRoom: createPageActions.setActiveRoom,
  setGraph: createPageActions.setGraph
}

class GridState {
  cellSize;
  height;
  width;
  constructor() {
    this.cellSize = 50;
    this.height = this.cellSize * 11;
    this.width = this.cellSize * 11;
  }
}

class GridBind extends Component {
  canvas;
  ctx;
  state;
  tile;
  constructor(props) {
    super(props);
    this.state = new GridState();
    this.canvas = React.createRef();
    this.tile = new Image();
    this.tile.src = tileImage;
  }

  handleClick(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.getRoomFromCoordinates(x, y);
  }

  topLeftFromBase(x, y) {
    const centerX = this.state.width / 2;
    const centerY = this.state.height / 2;

    let gridX = centerX + x * this.state.cellSize;
    let gridY = centerY - y * this.state.cellSize;

    let topLeftX = gridX - this.state.cellSize / 2;
    let topLeftY = gridY - this.state.cellSize / 2;

    return { topLeftX, topLeftY };
  }

  getRoomFromCoordinates(targetX, targetY) {
    const graph = {...this.props.create.graph};
    let activeRoom = null;
    const rooms = Object.keys(graph.coordinates);
    for(let i = 0; i < rooms.length; i++) {
      const roomid = rooms[i];
      const { x, y } = graph.coordinates[roomid];
      const { topLeftX, topLeftY } = this.topLeftFromBase(x, y);
      const distX = targetX - topLeftX;
      const distY = targetY - topLeftY;
      if(distX > 0 && distY > 0) {
        if(
          distX <= this.state.cellSize &&
          distY <= this.state.cellSize) {
            activeRoom = roomid;
            break;
        }
      }
    }
    if(activeRoom !== null) {
      if(activeRoom !== this.props.create.activeRoom) {
        this.props.setActiveRoom(activeRoom);
      }
    }
  }

  drawCell(id, x, y, tile) {
    const { topLeftX, topLeftY } = this.topLeftFromBase(x, y);
    this.ctx.drawImage(tile, topLeftX, topLeftY, this.state.cellSize, this.state.cellSize);

    if(id === this.props.create.activeRoom) {
      this.ctx.fillStyle = "rgba(66, 194, 219, 0.5)";
      this.ctx.fillRect(topLeftX, topLeftY, this.state.cellSize, this.state.cellSize);
    }
    this.ctx.strokeStyle = "#d9806c";
    this.ctx.beginPath();
    this.ctx.rect(topLeftX, topLeftY, this.state.cellSize, this.state.cellSize);
    this.ctx.stroke();
  }

  drawGridCells() {
    this.ctx.lineWidth = 3;
    Object.keys(this.props.create.graph.coordinates).forEach((roomid) => {
      const { x, y } = this.props.create.graph.coordinates[roomid];
      this.drawCell(roomid, x, y, this.tile);
    })
  }

  renderGrid() {
    if(this.props.create.graph === undefined) return;
    requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.state.width, this.state.height);
      this.ctx.fillStyle = "#2a324d";
      this.ctx.fillRect(0, 0, this.state.width, this.state.height);
      this.drawGridCells();
    })
  }

  componentDidUpdate(prevProps) {

    if(prevProps.create.graph === undefined &&
      this.props.create.graph !== undefined) {
        this.renderGrid();
    }

    if(prevProps.create.activeRoom !== this.props.create.activeRoom) {
      this.renderGrid();
    }

  }

  componentDidMount() {
    this.ctx = this.canvas.current.getContext("2d");
    this.props.setGraph(mockGraph);
  }

  render() {
    return (
      <div> 
        activeRoom: {this.props.create.activeRoom}
        <canvas
          ref={this.canvas}
          height={this.state.height}
          width={this.state.width}
          onClick={(e) => this.handleClick(e)}
        ></canvas>
      </div>
    );
  }
}

const Grid = connect(
  mapStateToProps,
  mapDispatchToProps
)(GridBind);

export default Grid;
