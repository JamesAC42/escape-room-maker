import React, { Component } from 'react';
import '../../../css/Library.scss';
import MapOverview from './MapOverview';
import libData from "../../mock-data/libData";

class Library extends Component {
    render() {
        return(
            <div className="library-container">
                <h1 style={{"text-align": "center"}}>Popular Maps</h1>
                {
                    libData.rooms.map(x => <MapOverview title={x.title} desc={x.description} rating={x.rating} roomCount={x.roomCount} creator={x.creator} totalPlays={x.totalPlays} difficulty={x.difficulty} tags={x.tags}/>)
                }
                
            </div>
        )
    }
}

export default Library;
