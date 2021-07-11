import React, { Component} from 'react';
import { Redirect } from 'react-router';

import '../../../css/mapinfo/mapinfo.scss';

class MapInfoState {
    constructor() {
        this.map = {};
    }
}

class MapInfo extends Component {
    state;
    constructor(props) {
        super(props);
        this.state = new MapInfoState();
    }
    componentDidMount() {
        const id = this.props.match.params.id;
        if(id === undefined) return;
        fetch('/api/getMap?id=' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'withCredentials':'true'
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                this.setState({map:data.map});
            } else {
                console.log(data);
            }
        })
        .catch(error => {
            console.error('Error: ' +  error);
        })
    }
    render() {
        if(this.props.match.params.id === undefined) {
            return <Redirect to="/"/>
        }
        if(this.state.map.uid === undefined) return null;
        let map = {...this.state.map};
        return(
            <div className="container mapinfo-container">
                <div>uid: {map.uid}</div>
                <div>creator: {map.creator}</div>
                <div>createdOn: {map.createdOn}</div>
                <div>lastModified: {map.lastModified}</div>
                <div>ratings: {JSON.stringify(map.ratings)}</div>
                <div>timeLimit: {map.timeLimit}</div>
                <div>tags: {JSON.stringify(map.tags)}</div>
                <div>description: {map.description}</div>
                <div>title: {map.title}</div>
                <div>explicit: {JSON.stringify(map.explicit)}</div>
                <div>timesCompleted: {map.timesCompleted}</div>
                <div>graph:</div>
                <pre>
                    {
                        JSON.stringify(map.graph, null, '    ')
                    }
                </pre>
            </div>
        )
    }
}

export default MapInfo;