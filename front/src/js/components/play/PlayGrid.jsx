import React, {Component} from 'react';
import GridBase, { GridBaseState } from '../GridBase';

class PlayGrid extends GridBase {

    constructor(props) {
        super(props);
    }

    isAdjacent(room1, room2) {
        let coord1 = this.props.graph.coordinates[room1];
        let coord2 = this.props.graph.coordinates[room2];
        return (
            (coord1.x === coord2.x && Math.abs(coord1.y - coord2.y) === 1) ||
            (coord1.y === coord2.y && Math.abs(coord1.x - coord2.x) === 1)
        );
    }

    handleClick(e) {
        if(!this.props.playing) return;
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const room = this.getRoomFromCoordinates(x, y);
        if(this.props.currentRoom === undefined) return;
        if(room !== null) {
            if(room !== this.props.currentRoom) {
                if(
                    this.props.visitedRooms.indexOf(room) === -1 && 
                    !this.isAdjacent(room, this.props.currentRoom)) {
                    return;
                }
                this.props.setCurrentRoom(room);
                if(this.props.visitedRooms.indexOf(room) === -1) {
                    this.props.setVisited(room);
                }
            }
        }
    }
    
    drawCell(id, x, y, tile) {

        let shouldRenderTile = false;
        let isMovement = false;
        if(this.props.visitedRooms.indexOf(id) !== -1) {
            shouldRenderTile = true;
        } else {
            if(this.props.currentRoom !== undefined) {
                if(this.isAdjacent(id, this.props.currentRoom)) {
                    shouldRenderTile = true;
                    isMovement = true;
                }
            }
        }

        const { topLeftX, topLeftY } = this.topLeftFromBase(x, y);
        if(shouldRenderTile) {
            this.ctx.drawImage(tile, topLeftX, topLeftY, this.state.cellSize, this.state.cellSize);
        }

        if(this.props.currentRoom !== undefined) {
            if(isMovement) {
                this.ctx.fillStyle = "rgba(0,0,0,0.3)";
                this.ctx.fillRect(topLeftX, topLeftY, this.state.cellSize, this.state.cellSize);
            }
        }

        if(id === this.props.currentRoom) {
            this.ctx.fillStyle = "#5081f2";
            const personWidth = 20;
            let topLeftXPerson = topLeftX + (this.state.cellSize / 2) - (personWidth / 2); 
            let topLeftYPerson = topLeftY + (this.state.cellSize / 2) - (personWidth / 2); 
            this.ctx.fillRect(topLeftXPerson, topLeftYPerson, personWidth, personWidth);
        }

        if(shouldRenderTile) {
            this.ctx.strokeStyle = "#d9806c";
            this.ctx.beginPath();
            this.ctx.rect(topLeftX, topLeftY, this.state.cellSize, this.state.cellSize);
            this.ctx.stroke();
        }
    }
    
    renderGrid() {
        if(this.props.graph === undefined) return;
        requestAnimationFrame(() => {
            this.ctx.clearRect(0, 0, this.state.width, this.state.height);
            this.ctx.fillStyle = "#2a324d";
            this.ctx.fillRect(0, 0, this.state.width, this.state.height);
            this.drawGridCells();
        })
    }

    componentDidUpdate(prevProps, prevState) {

        if(prevProps.graph === undefined &&
        this.props.graph !== undefined) {
            this.renderGrid();
        }

        if(prevProps.currentRoom !== this.props.currentRoom) {
            this.renderGrid();
        }
    }

}

export default PlayGrid;