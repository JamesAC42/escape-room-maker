import React, {Component} from 'react';
import PlayGrid from './PlayGrid';

import '../../../css/play/play.scss';
import play from '../../../images/play.png';
import pause from '../../../images/pause.png';
import restart from '../../../images/restart.png';

const totalTime = 6;

class PlayContainerState {
    constructor() {
        this.currentRoom = undefined;
        this.remainingTime = totalTime;
        this.playing = false;
        this.visitedRooms = [];
        this.currentEvent = undefined;
        this.showEventWindow = false;
        this.gameOver = false;
        this.gameWin = false;

        this.endRoom = undefined;
    }
}

class PlayContainer extends Component {
    constructor(props) {
        super(props);
        this.state = new PlayContainerState();
    }
    componentWillUnmount() {
        if(this.intervalId !== undefined) {
            clearInterval(this.intervalId);
        }
    }
    componentDidMount() {
        let endRoom = this.props.graph.endRoom;
        if(!endRoom) {
            endRoom = Object.keys(this.props.graph.graph)[-1];
        }
        this.setState({
            endRoom
        })
    }
    restart() {
        this.setState({
            playing:false,
            currentRoom:undefined,
            remainingTime:totalTime,
            visitedRooms:[],
            currentEvent:undefined,
            showEventWindow:false,
            gameOver:false,
            gameWin:false
        });
        if(this.intervalId !== undefined) {
            clearInterval(this.intervalId);
        }
    }
    play() {
        let room = this.state.currentRoom;
        let remainingTime = this.state.remainingTime;
        let visitedRooms = this.state.visitedRooms;
        if(room === undefined) {
            room = this.props.graph.startRoom;
            if(!room) {
                room = Object.keys(this.props.graph.graph)[0];
            }
            remainingTime = totalTime;
            visitedRooms.push(room);
        }
        this.setState({
            playing:true,
            currentRoom:room,
            remainingTime,
            visitedRooms,
            gameOver:false,
            gameWin:false
        });
        this.intervalId = setInterval(() => {
            let remainingTime = this.state.remainingTime - 1;
            if(remainingTime <= 0) {
                this.restart();
                this.setState({
                    gameOver:true
                });
                remainingTime = 0;
            }
            this.setState({remainingTime: remainingTime});
        },1000);
    }
    pause() {
        this.setState({playing:false});
        clearInterval(this.intervalId);
    }
    setCurrentRoom(room) {
        this.setState({currentRoom:room});
    }
    setVisited(room) {
        let visitedRooms = [...this.state.visitedRooms];
        if(visitedRooms.indexOf(room) === -1) {
            visitedRooms.push(room);
            this.setState({visitedRooms})
        }
    }
    setCurrentEvent(event) {
        this.setState({currentEvent:event});
    }
    render() {
        return(
            <div className="play-container card">
                <div className="play-info flex flex-row flex-center">
                    <div 
                        className="play-button flex center-child"
                        onClick={() => {
                            if(this.state.playing) {
                                this.pause();
                            } else {
                                this.play();
                            }
                        }}>
                        <img src={this.state.playing ? pause : play} alt="play control"/>
                    </div>
                    <div 
                        className="restart-button flex center-child"
                        onClick={() => this.restart()}>
                        <img src={restart} alt="Restart"/>
                    </div>
                    <div className="timer">
                        {this.state.remainingTime} seconds remaining
                    </div>
                </div>
                <PlayGrid 
                    graph={this.props.graph} 
                    className={"play-grid"}
                    currentRoom={this.state.currentRoom}
                    playing={this.state.playing}
                    visitedRooms={this.state.visitedRooms}
                    setVisited={(room) => this.setVisited(room)}
                    setCurrentRoom={(room) => this.setCurrentRoom(room)}/>
                {
                    this.state.currentRoom === undefined ? 
                    <div className="play-prompt">
                        Press the play button to start!
                    </div> : null
                }
                {
                    this.state.currentRoom !== undefined && !this.state.playing ?
                    <div className="pause-prompt flex center-child">
                        <img src={pause} alt="paused"/>
                    </div> : null
                }
                {
                    this.state.gameOver ?
                    <div className="game-over flex center-child">
                        <div className="game-over-message">
                            GAME OVER
                        </div>
                    </div> : null
                }
            </div>
        )
    }
}

export default PlayContainer;