import React, { Component } from "react";
import GridBase, { GridBaseState } from "../GridBase";

// The Grid component for playing a map
class PlayGrid extends GridBase {
  constructor(props) {
    super(props);
  }

  // Check if two rooms are adjacent
  isAdjacent(room1, room2) {
    let coord1 = this.props.graph.coordinates[room1];
    let coord2 = this.props.graph.coordinates[room2];
    return (
      (coord1.x === coord2.x && Math.abs(coord1.y - coord2.y) === 1) ||
      (coord1.y === coord2.y && Math.abs(coord1.x - coord2.x) === 1)
    );
  }

  // Event handler for when a user clicks on the grid
  handleClick(e) {

    // Don't do anything if not currently in the playing state
    if (!this.props.playing) return;

    // Get the room that the user clicked on 
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const room = this.getRoomFromCoordinates(x, y);

    // Set the current room to the room that was clicked on,
    // only if either already visited or adjacent to a room
    // that was already visited
    if (this.props.currentRoom === undefined) return;
    if (room !== null) {
      if (room !== this.props.currentRoom) {
        if (
          this.props.visitedRooms.indexOf(room) === -1 &&
          !this.isAdjacent(room, this.props.currentRoom)
        ) {
          return;
        }
        this.props.setCurrentRoom(room);
        if (this.props.visitedRooms.indexOf(room) === -1) {
          this.props.setVisited(room);
        }
      }
    }
  }

  // Used by render to draw each grid cell.
  // Determines whether to render. 
  // Only renders if already visited or adjacent to the current room
  drawCell(id, x, y, tile) {

    // Determine whether to render and how to render.
    // Adjacent non-visited rooms render but have a shadow
    let shouldRenderTile = false;
    let isMovement = false;
    if (this.props.visitedRooms.indexOf(id) !== -1) {
      shouldRenderTile = true;
    } else {
      if (this.props.currentRoom !== undefined) {
        if (this.isAdjacent(id, this.props.currentRoom)) {
          shouldRenderTile = true;
          isMovement = true;
        }
      }
    }

    // Get the coordinates of the room and draw the tile image there
    const { topLeftX, topLeftY } = this.topLeftFromBase(x, y);
    if (shouldRenderTile) {
      this.ctx.drawImage(
        tile,
        topLeftX,
        topLeftY,
        this.state.cellSize,
        this.state.cellSize
      );
    }

    // Draw the shadow over the adjacent non-visited rooms
    if (this.props.currentRoom !== undefined) {
      if (isMovement) {
        this.ctx.fillStyle = "rgba(0,0,0,0.3)";
        this.ctx.fillRect(
          topLeftX,
          topLeftY,
          this.state.cellSize,
          this.state.cellSize
        );
      }
    }

    // Render the person to indicate what the current room is
    if (id === this.props.currentRoom) {
      this.ctx.fillStyle = "#5081f2";
      const personWidth = 20;
      let topLeftXPerson = topLeftX + this.state.cellSize / 2 - personWidth / 2;
      let topLeftYPerson = topLeftY + this.state.cellSize / 2 - personWidth / 2;
      this.ctx.fillRect(
        topLeftXPerson,
        topLeftYPerson,
        personWidth,
        personWidth
      );
    }

    // Render the outline of the room
    if (shouldRenderTile) {
      this.ctx.strokeStyle = "#d9806c";
      this.ctx.beginPath();
      this.ctx.rect(
        topLeftX,
        topLeftY,
        this.state.cellSize,
        this.state.cellSize
      );
      this.ctx.stroke();
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
    });
  }

  // Detect when the props or state change and determine whether to render or not
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.graph === undefined && this.props.graph !== undefined) {
      this.renderGrid();
    }

    if (prevProps.currentRoom !== this.props.currentRoom) {
      this.renderGrid();
    }
  }
}

export default PlayGrid;
