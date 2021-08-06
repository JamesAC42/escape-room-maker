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

// Stores the state for the Grid
class GridState extends GridBaseState {
  constructor() {
    super();
    this.activeAddButton = {
      room: null,
      direction: 0,
    };
  }
}

// The Grid component used on the creation page for editing
// rooms and event information
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

  // Event handler for when the user clicks the canvas
  handleClick(e) {
    // If there is an add room plus button
    if (this.state.activeAddButton.room !== null) {
      this.addNewRoom();
    } else {
      // Identify room clicked
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const room = this.getRoomFromCoordinates(x, y);
      if (room !== null) {
        if (room !== this.props.activeRoom) {
          // If room clicked exists set it to active room
          this.props.setActiveRoom(room);
        }
      }
    }
  }

  // Calaculate new cords moving one unit in the given direction.
  // 0 = North
  // 1 = East
  // 2 = South
  // 3 = West
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

  // Event handler for when the user's mouse enters the component
  // and moves around. Used for determining where to display action buttons
  handleHover(e) {
    const rect = e.target.getBoundingClientRect();
    const cX = e.clientX - rect.left;
    const cY = e.clientY - rect.top;

    // Get the id of the room that is being hovered over
    const room = this.getRoomFromCoordinates(cX, cY);
    if (room !== null) {
      // Get the coordinates of the room
      let { x, y } = this.props.graph.graph[room].coordinates;

      // Calculate which wall of the room the user's cursor is closest to.
      // Should only render the plus button if the cursor is at most 6 pixels away
      // from a wall.
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

  // If mouse leaves canvas remove add button
  handleMouseLeave(e) {
    this.setState({
      activeAddButton: {
        room: null,
        direction: 0,
      },
    });
  }

  // Used to calculate which wall is the closest to a given
  // set of coordinates and a relevant room
  minWallDir(cX, cY, topLeftX, topLeftY) {
    // Get the center coordinates of the room
    const xCenter = topLeftX + this.state.cellSize / 2;
    const yCenter = topLeftY + this.state.cellSize / 2;

    // Get the coordinates of the center point of each wall
    const topCenter = { 0: { x: xCenter, y: topLeftY } };
    const rightCenter = {
      1: { x: topLeftX + this.state.cellSize, y: yCenter },
    };
    const bottomCenter = {
      2: { x: xCenter, y: topLeftY + this.state.cellSize },
    };
    const leftCenter = { 3: { x: topLeftX, y: yCenter } };

    // Make a list of each wall's center points
    const points = [topCenter, rightCenter, bottomCenter, leftCenter];

    // Go through the list and determine which wall is closest to the given
    // coordinates
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

  // Adds a new room to the grid, called after a user clicks the plus
  // button on a room grid cell wall
  addNewRoom() {
    // Get the room that the user clicked on
    let room = this.state.activeAddButton.room;
    // Make a copy of the graph to mutate
    let graph = { ...this.props.graph };
    let coords = graph.graph[room].coordinates;

    // Get the coordinates of the room to be added
    let direction = this.state.activeAddButton.direction;
    let newCoords = this.moveCoords(coords.x, coords.y, direction);

    // Make sure new room fits into 11x11 grid and that the room doesn't
    // aleady exist
    if (
      newCoords.x < -5 ||
      newCoords.x > 5 ||
      newCoords.y < -5 ||
      newCoords.y > 5 ||
      this.coordsExist(newCoords)
    ) {
      return;
    }

    // Create new room
    const roomId = nanoid();
    const newRoom = new Room(roomId, newCoords);
    // Add room to graph
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

  // Used by the canvas render method to draw a grid cell
  drawCell(id, x, y, tile) {
    // Get the canvas coordinates of the cell to be rendered
    // and draw the tile image there
    const { topLeftX, topLeftY } = this.topLeftFromBase(x, y);
    this.ctx.drawImage(
      tile,
      topLeftX,
      topLeftY,
      this.state.cellSize,
      this.state.cellSize
    );

    // Fill in some highlighting on that room cell
    // if it is active, a start room, or an end room.
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

    // Draw a border around the room cell
    this.ctx.strokeStyle = "#d9806c";
    this.ctx.beginPath();
    this.ctx.rect(topLeftX, topLeftY, this.state.cellSize, this.state.cellSize);
    this.ctx.stroke();
  }

  // Render the small plus button that appears when a user
  // hovers over a room wall
  drawAddButton() {
    // If hovered room exists
    if (this.state.activeAddButton.room !== null) {
      // Set vals
      let room = this.state.activeAddButton.room;
      let coords = this.props.graph.graph[room].coordinates;
      let { topLeftX, topLeftY } = this.topLeftFromBase(coords.x, coords.y);
      let direction = this.state.activeAddButton.direction;

      const plusSize = 30;
      const plusSizeHalf = plusSize / 2;
      const cellSizeHalf = this.state.cellSize / 2;

      let x, y;
      // Compute drawing coords
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
      // Render image
      this.ctx.drawImage(this.plus, x, y, plusSize, plusSize);
    }
  }

  // Render the grid
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

  // Called when the props or state change, detect whether to
  // Re-render the graph
  componentDidUpdate(prevProps, prevState) {
    // When the graph is first generated
    if (prevProps.graph === undefined && this.props.graph !== undefined) {
      this.renderGrid();
    }

    // When the active room changes
    if (prevProps.activeRoom !== this.props.activeRoom) {
      this.renderGrid();
    }

    // When the room that the add button is being showed for changes
    if (
      prevState.activeAddButton.room !== this.state.activeAddButton.room ||
      prevState.activeAddButton.direction !==
        this.state.activeAddButton.direction
    ) {
      this.renderGrid();
    }

    if (prevProps.graph !== undefined && this.props.graph !== undefined) {
      // If the amount of rooms changes
      if (
        Object.keys(prevProps.graph).length !==
        Object.keys(this.props.graph).length
      ) {
        this.renderGrid();
      }

      // If the start or end room changes
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
