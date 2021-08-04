import React, { Component } from "react";

import "../../../css/grid.scss";
import tileImage from "../../../images/woodtile.png";
import plusImage from "../../../images/plus.png";
import { nanoid } from "nanoid";

import { connect } from "react-redux";
import { createPageActions } from "../../actions/actions";
import { Map, Graph, Room, Coordinates } from "./MapClasses";

import GridBase, { GridBaseState } from "../GridBase";

const mapDispatchToProps = {
  setActiveRoom: createPageActions.setActiveRoom,
  setGraph: createPageActions.setGraph,
};

class GridState extends GridBaseState {
  constructor() {
    super();
    this.activeAddButton = {
      room: null,
      direction: 0,
    };
  }
}

class GridBind extends GridBase {
  constructor(props) {
    super(props);
    this.state = new GridState();
    this.canvas = React.createRef();
    this.tile = new Image();
    this.tile.src = tileImage;
    this.plus = new Image();
    this.plus.src = plusImage;
  }

  handleClick(e) {
    if (this.state.activeAddButton.room !== null) {
      this.addNewRoom();
    } else {
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const room = this.getRoomFromCoordinates(x, y);
      if (room !== null) {
        if (room !== this.props.activeRoom) {
          this.props.setActiveRoom(room);
        }
      }
    }
  }

  moveCoords(x, y, direction) {
    if (direction === 0) {
      return { x, y: y + 1 };
    } else if (direction === 1) {
      return { x: x + 1, y };
    } else if (direction === 2) {
      return { x, y: y - 1 };
    } else if (direction === 3) {
      return { x: x - 1, y };
    }
  }

  handleHover(e) {
    const rect = e.target.getBoundingClientRect();
    const cX = e.clientX - rect.left;
    const cY = e.clientY - rect.top;
    const room = this.getRoomFromCoordinates(cX, cY);
    if (room !== null) {
      let { x, y } = this.props.graph.graph[room].coordinates;
      const { topLeftX, topLeftY } = this.topLeftFromBase(x, y);
      const minDir = this.minWallDir(cX, cY, topLeftX, topLeftY);
      let closestRoom = minDir === null ? null : room;
      let shouldRender = true;
      if (minDir !== null) {
        let destCoords = this.moveCoords(x, y, minDir);
        shouldRender =
          !this.coordsExist(destCoords) &&
          destCoords.x < 6 &&
          destCoords.x > -6 &&
          destCoords.y > -6 &&
          destCoords.y < 6;
      }
      if (shouldRender) {
        this.setState({
          activeAddButton: {
            room: closestRoom,
            direction: minDir,
          },
        });
      }
    }
  }

  handleMouseLeave(e) {
    this.setState({
      activeAddButton: {
        room: null,
        direction: 0,
      },
    });
  }

  minWallDir(cX, cY, topLeftX, topLeftY) {
    const xCenter = topLeftX + this.state.cellSize / 2;
    const yCenter = topLeftY + this.state.cellSize / 2;

    const topCenter = { 0: { x: xCenter, y: topLeftY } };
    const rightCenter = {
      1: { x: topLeftX + this.state.cellSize, y: yCenter },
    };
    const bottomCenter = {
      2: { x: xCenter, y: topLeftY + this.state.cellSize },
    };
    const leftCenter = { 3: { x: topLeftX, y: yCenter } };

    const points = [topCenter, rightCenter, bottomCenter, leftCenter];
    let minDist = Infinity;
    let minDir = null;

    points.forEach((dir, index) => {
      let { x, y } = dir[index];
      let dist = Math.sqrt(Math.pow(x - cX, 2) + Math.pow(y - cY, 2));
      if (dist < minDist && dist < this.state.cellSize / 3) {
        minDist = dist;
        minDir = index;
      }
    });
    return minDir;
  }

  addNewRoom() {
    let room = this.state.activeAddButton.room;
    let graph = { ...this.props.graph };
    let coords = graph.graph[room].coordinates;

    let direction = this.state.activeAddButton.direction;
    let newCoords = this.moveCoords(coords.x, coords.y, direction);

    if (
      newCoords.x < -5 ||
      newCoords.x > 5 ||
      newCoords.y < -5 ||
      newCoords.y > 5 ||
      this.coordsExist(newCoords)
    ) {
      return;
    }

    const roomId = nanoid();
    const newRoom = new Room(roomId, newCoords);

    graph.graph[roomId] = newRoom;
    graph.coordinates[roomId] = newCoords;
    this.props.setGraph(graph);
    this.setState(
      {
        activeAddButton: {
          room: null,
          direction: 0,
        },
      },
      () => {
        this.renderGrid();
      }
    );
  }

  drawCell(id, x, y, tile) {
    const { topLeftX, topLeftY } = this.topLeftFromBase(x, y);
    this.ctx.drawImage(
      tile,
      topLeftX,
      topLeftY,
      this.state.cellSize,
      this.state.cellSize
    );

    if (
      id === this.props.activeRoom ||
      id === this.props.graph.startRoom ||
      id === this.props.graph.endRoom
    ) {
      if (id === this.props.activeRoom) {
        this.ctx.fillStyle = "rgba(66, 194, 219, 0.5)";
      }
      if (id === this.props.graph.startRoom) {
        this.ctx.fillStyle = "rgba(133, 255, 149, 0.5)";
      } else if (id === this.props.graph.endRoom) {
        this.ctx.fillStyle = "rgba(255, 127, 120, 0.5)";
      }
      this.ctx.fillRect(
        topLeftX,
        topLeftY,
        this.state.cellSize,
        this.state.cellSize
      );
    }
    this.ctx.strokeStyle = "#d9806c";
    this.ctx.beginPath();
    this.ctx.rect(topLeftX, topLeftY, this.state.cellSize, this.state.cellSize);
    this.ctx.stroke();
  }

  drawAddButton() {
    if (this.state.activeAddButton.room !== null) {
      let room = this.state.activeAddButton.room;
      let coords = this.props.graph.graph[room].coordinates;
      let { topLeftX, topLeftY } = this.topLeftFromBase(coords.x, coords.y);
      let direction = this.state.activeAddButton.direction;

      const plusSize = 30;
      const plusSizeHalf = plusSize / 2;
      const cellSizeHalf = this.state.cellSize / 2;

      let x, y;
      if (direction === 0) {
        x = topLeftX + cellSizeHalf;
        y = topLeftY;
      } else if (direction === 1) {
        x = topLeftX + this.state.cellSize;
        y = topLeftY + cellSizeHalf;
      } else if (direction === 2) {
        x = topLeftX + cellSizeHalf;
        y = topLeftY + this.state.cellSize;
      } else if (direction === 3) {
        x = topLeftX;
        y = topLeftY + cellSizeHalf;
      }
      x -= plusSizeHalf;
      y -= plusSizeHalf;
      this.ctx.drawImage(this.plus, x, y, plusSize, plusSize);
    }
  }

  renderGrid() {
    if (this.props.graph === undefined) return;
    requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.state.width, this.state.height);
      this.ctx.fillStyle = "#2a324d";
      this.ctx.fillRect(0, 0, this.state.width, this.state.height);
      this.drawGridCells();
      this.drawAddButton();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.graph === undefined && this.props.graph !== undefined) {
      this.renderGrid();
    }

    if (prevProps.activeRoom !== this.props.activeRoom) {
      this.renderGrid();
    }

    if (
      prevState.activeAddButton.room !== this.state.activeAddButton.room ||
      prevState.activeAddButton.direction !==
        this.state.activeAddButton.direction
    ) {
      this.renderGrid();
    }
    if (prevProps.graph !== undefined && this.props.graph !== undefined) {
      if (
        Object.keys(prevProps.graph).length !==
        Object.keys(this.props.graph).length
      ) {
        this.renderGrid();
      }
      if (
        prevProps.graph.startRoom !== this.props.graph.startRoom ||
        prevProps.graph.endRoom !== this.props.graph.endRoom
      ) {
        this.renderGrid();
      }
    }
  }
}

const Grid = connect(null, mapDispatchToProps)(GridBind);

export default Grid;
