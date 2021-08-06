import React, { Component } from "react";
import "../../css/grid.scss";
import tileImage from "../../images/woodtile.png";

// The state of the grid
export class GridBaseState {
  cellSize;
  height;
  width;
  constructor() {
    this.cellSize = 60;
    this.height = this.cellSize * 12;
    this.width = this.cellSize * 12;
  }
}

// The parent grid class that the other grids inherit from
class GridBase extends Component {
  constructor(props) {
    super(props);
    this.state = new GridBaseState();
    this.canvas = React.createRef();
    this.tile = new Image();
    this.tile.src = tileImage;
  }

  // Abstract event handler functions that the children of this component
  // will implement

  handleHover(e) {
    return;
  }

  handleMouseLeave(e) {
    return;
  }

  handleClick(e) {
    return;
  }

  // Basic method to render a cell of the grid
  drawCell(id, x, y, tile) {
    // Get the coordinates of the grid and render the tile there
    const { topLeftX, topLeftY } = this.topLeftFromBase(x, y);
    this.ctx.drawImage(
      tile,
      topLeftX,
      topLeftY,
      this.state.cellSize,
      this.state.cellSize
    );

    // Render the outline of the grid cell
    this.ctx.strokeStyle = "#d9806c";
    this.ctx.beginPath();
    this.ctx.rect(topLeftX, topLeftY, this.state.cellSize, this.state.cellSize);
    this.ctx.stroke();
  }

  // Check if coordinates exist at a given point
  coordsExist(destCoords) {
    let exists = false;
    Object.keys(this.props.graph.coordinates).forEach((c) => {
      let iCoords = this.props.graph.coordinates[c];
      if (destCoords.x === iCoords.x && destCoords.y === iCoords.y) {
        exists = true;
      }
    });
    return exists;
  }

  // Get the ID of the room at a set of given coordinates
  getRoomFromCoordinates(targetX, targetY) {
    const graph = { ...this.props.graph };
    let activeRoom = null;
    const rooms = Object.keys(graph.coordinates);
    for (let i = 0; i < rooms.length; i++) {
      const roomid = rooms[i];
      const { x, y } = graph.coordinates[roomid];
      const { topLeftX, topLeftY } = this.topLeftFromBase(x, y);
      const distX = targetX - topLeftX;
      const distY = targetY - topLeftY;
      if (distX > 0 && distY > 0) {
        if (distX <= this.state.cellSize && distY <= this.state.cellSize) {
          activeRoom = roomid;
          break;
        }
      }
    }
    return activeRoom;
  }

  // Get the raster canvas coordinates from the grid coordinates
  topLeftFromBase(x, y) {
    const centerX = this.state.width / 2;
    const centerY = this.state.height / 2;

    let gridX = centerX + x * this.state.cellSize;
    let gridY = centerY - y * this.state.cellSize;

    let topLeftX = gridX - this.state.cellSize / 2;
    let topLeftY = gridY - this.state.cellSize / 2;

    return { topLeftX, topLeftY };
  }

  // Render all the cells in the grid
  drawGridCells() {
    this.ctx.lineWidth = 3;
    Object.keys(this.props.graph.coordinates).forEach((roomid) => {
      const { x, y } = this.props.graph.coordinates[roomid];
      this.drawCell(roomid, x, y, this.tile);
    });
  }

  // Render the grid
  renderGrid() {
    if (this.props.graph === undefined) return;
    requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.state.width, this.state.height);
      this.ctx.fillStyle = "#2a324d";
      this.ctx.fillRect(0, 0, this.state.width, this.state.height);
      this.drawGridCells();
    });
  }

  // Detect when the props change and when to rerender
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.graph === undefined && this.props.graph !== undefined) {
      this.renderGrid();
    }

    if (prevProps.activeRoom !== this.props.activeRoom) {
      this.renderGrid();
    }
  }

  // Initialize the grid context when the component mounts
  componentDidMount() {
    this.ctx = this.canvas.current.getContext("2d");
    this.renderGrid();
  }

  // Render the canvas
  render() {
    return (
      <div>
        <canvas
          className={"grid " + this.props.className}
          ref={this.canvas}
          height={this.state.height}
          width={this.state.width}
          onClick={(e) => this.handleClick(e)}
          onMouseMove={(e) => this.handleHover(e)}
          onMouseLeave={(e) => this.handleMouseLeave(e)}
        ></canvas>
      </div>
    );
  }
}

export default GridBase;
