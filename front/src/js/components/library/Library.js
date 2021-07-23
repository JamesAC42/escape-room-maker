import React, { Component } from 'react';
import '../../../css/Library.scss';
import MapCard from './MapCard';
import libData from "../../mock-data/libData";
import tagData from "../../mock-data/tagData";

class LibraryState {
    constructor() {
        this.maps = [];
    }
}

class Library extends Component {
    constructor(props) {
        super(props);
        this.state = new LibraryState();
    }
    componentDidMount() {
        fetch('/api/getAllMaps', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'withCredentials':'true'
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                this.setState({
                    maps:data.maps
                })
            }
        })
        .catch(error => {
            console.error('Error: ' +  error);
        })
    }
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
                    <input type="text" placeholder="Search" className="searchbar"></input>
                    <h1 style={{"text-align": "center"}}>Popular Maps</h1>
                    {
                        this.state.maps.map(x => <MapCard title={x.title} desc={x.description} rating={5} roomCount={10} creator={x.creator} totalPlays={x.totalPlays} difficulty={"Medium"} tags={JSON.parse(x.tags)}/>)
                    }
                </div>
            </div>
        )
    }
}

export default Library;
