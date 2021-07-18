import React, { Component } from 'react';
import '../../../css/Library.scss';
import MapCard from './MapCard';
import libData from "../../mock-data/libData";
import tagData from "../../mock-data/tagData";

class Library extends Component {
    render() {
        return(
            <div className="library-container">
                <div className="tag-whole-area">
                    <h1 style={{"text-align": "center"}}>Tags</h1>
                    <div className="tag-section">
                        {
                            tagData.tags.map(x => <span className="tag-link">{x}</span>)
                        }
                    </div>
                </div>
                <div className="whole-map-section">
                    <input type="text" placeholder="Search"></input>
                    <h1 style={{"text-align": "center"}}>Popular Maps</h1>
                    {
                        libData.rooms.map(x => <MapCard title={x.title} desc={x.description} rating={x.rating} roomCount={x.roomCount} creator={x.creator} totalPlays={x.totalPlays} difficulty={x.difficulty} tags={x.tags}/>)
                    }
                </div>
            </div>
        )
    }
}

export default Library;
