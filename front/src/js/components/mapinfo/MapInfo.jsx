import React, { Component} from 'react';
import { matchPath, Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Rating from '../Rating';

import bookmarkOutline from '../../../images/bookmark-outline.png';
import bookmarkFilled from '../../../images/bookmark-filled.png';

import { connect } from 'react-redux';
import {
    userinfoActions
} from '../../actions/actions';

import '../../../css/mapinfo/mapinfo.scss';

import GridBase from '../GridBase';

const mapStateToProps = (state, props) => ({
  session: state.session,
  userinfo: state.userinfo,
});

const mapDispatchToProps = {
    setFavorites: userinfoActions.setFavorites,
}

class MapInfoState {
    constructor() {
        this.map = {};
    }
}

class MapInfoBind extends Component {
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
    isFavorite() {
        let favorites = [];
        let currentMap = this.props.match.params.id;
        this.props.userinfo.favorites.forEach((map) => {
            favorites.push(map.uid);
        });
        return favorites.indexOf(currentMap);
    }
    toggleFavorite() {
        let index = this.isFavorite();
        let url;
        if(index === -1) {
            url = "/api/addFavorite/";
        } else {
            url = "/api/removeFavorite";
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mapid: this.props.match.params.id
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                let favorites = [...this.props.userinfo.favorites];
                if(index === -1) {
                    favorites.push(data.map);
                } else {
                    favorites.splice(index, 1);
                }
                this.props.setFavorites(favorites);
            } else {
                console.log(data);
            }
        })
        .catch(error => {
            console.error('Error: ' +  error);
        })
    }
    renderBookmarkIcon() {
        if(this.props.session.loggedin) {
            return (
                <div 
                    className="favorite-button flex center-child"
                    onClick={() => this.toggleFavorite()}>
                {
                    this.isFavorite() === -1 ?
                    <img src={bookmarkOutline} alt="bookmark"/>
                    :
                    <img src={bookmarkFilled} alt="bookmark"/>
                }
                </div>
            )
        } else {
            return null;
        }
    }
    render() {
        if(this.props.match.params.id === undefined) {
            return <Redirect to="/"/>
        }
        if(this.state.map.uid === undefined) return null;
        let map = {...this.state.map};
        return(
            <div className="container mapinfo-container">
                <div className="bumpered-container mapinfo-container card">
                    <div className="mapinfo-row">
                        <div className="mapinfo-col mapinfo-meta">
                            <div className="meta-row">
                                <div className="mapinfo-title title">
                                    {map.title} by John Smith
                                </div>
                                {this.renderBookmarkIcon()}
                            </div>
                            <div className="meta-row">
                                <div className="creation-date">
                                    <span className="meta-info-label">Created: </span> {new Date(map.createdOn).toLocaleDateString()}
                                </div>
                                <div className="modified-date">
                                    <span className="meta-info-label">Modified: </span> {new Date(map.lastModified).toLocaleDateString()}
                                </div>
                                <div className="times-completed">
                                    <span className="meta-info-label">Completed: </span> {map.timesCompleted} times.
                                </div>
                                <div className="explicit">
                                    <span className="meta-info-label">Explicit: </span> {map.explicit ? "Yes":"No"}
                                </div>
                                <div className="time-limit">
                                    <span className="meta-info-label">Time Limit: </span>{map.timeLimit} seconds
                                </div>
                            </div>
                            <div className="meta-row">
                                <div className="description">
                                    {map.description}
                                </div>
                            </div>
                            <div className="meta-row tags">
                                {
                                    map.tags.map(tag => 
                                        <div className="tag">{tag}</div>
                                    )
                                }
                            </div>
                        </div>
                        <div className="mapinfo-col mapinfo-data">
                            <div className="rating-outer flex center-child">
                                <Rating stars={4} />
                            </div>
                            <Link to={"/play/" + this.state.map.uid}>
                                <div className="play-button">
                                    Play
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="mapinfo-row">
                        <GridBase 
                            graph={map.graph} 
                            className={"mapinfo-grid"}/>
                    </div>
                    <div className="mapinfo-reviews">
                        <div className="mapinfo-reviews-header">
                            {map.ratings.length} ratings
                        </div>
                        <div className="mapinfo-review-item">
                            <div className="mapinfo-review-title">Review title</div>
                            <div className="mapinfo-review-author">By John Smith</div>
                            <div className="mapinfo-review-body">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque numquam illum voluptatum laudantium iure fugiat? Ipsam consequuntur quisquam obcaecati, expedita sit numquam ipsum delectus, laborum ea ut explicabo nostrum laudantium? Hic, dolores quod quisquam quaerat ex possimus alias perferendis quidem praesentium ipsa, assumenda aut, consequatur ullam nemo eveniet officiis explicabo.</div>
                            <Rating stars={Math.floor(Math.random() * 6)} />
                        </div>
                        <div className="mapinfo-review-item">
                            <div className="mapinfo-review-title">Review title</div>
                            <div className="mapinfo-review-author">By John Smith</div>
                            <div className="mapinfo-review-body">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque numquam illum voluptatum laudantium iure fugiat? Ipsam consequuntur quisquam obcaecati, expedita sit numquam ipsum delectus, laborum ea ut explicabo nostrum laudantium? Hic, dolores quod quisquam quaerat ex possimus alias perferendis quidem praesentium ipsa, assumenda aut, consequatur ullam nemo eveniet officiis explicabo.</div>
                            <Rating stars={Math.floor(Math.random() * 6)} />
                        </div>
                        <div className="mapinfo-review-item">
                            <div className="mapinfo-review-title">Review title</div>
                            <div className="mapinfo-review-author">By John Smith</div>
                            <div className="mapinfo-review-body">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque numquam illum voluptatum laudantium iure fugiat? Ipsam consequuntur quisquam obcaecati, expedita sit numquam ipsum delectus, laborum ea ut explicabo nostrum laudantium? Hic, dolores quod quisquam quaerat ex possimus alias perferendis quidem praesentium ipsa, assumenda aut, consequatur ullam nemo eveniet officiis explicabo.</div>
                            <Rating stars={Math.floor(Math.random() * 6)} />
                        </div>
                        <div className="mapinfo-review-item">
                            <div className="mapinfo-review-title">Review title</div>
                            <div className="mapinfo-review-author">By John Smith</div>
                            <div className="mapinfo-review-body">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque numquam illum voluptatum laudantium iure fugiat? Ipsam consequuntur quisquam obcaecati, expedita sit numquam ipsum delectus, laborum ea ut explicabo nostrum laudantium? Hic, dolores quod quisquam quaerat ex possimus alias perferendis quidem praesentium ipsa, assumenda aut, consequatur ullam nemo eveniet officiis explicabo.</div>
                            <Rating stars={Math.floor(Math.random() * 6)} />
                        </div>
                        <div className="mapinfo-review-item">
                            <div className="mapinfo-review-title">Review title</div>
                            <div className="mapinfo-review-author">By John Smith</div>
                            <div className="mapinfo-review-body">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque numquam illum voluptatum laudantium iure fugiat? Ipsam consequuntur quisquam obcaecati, expedita sit numquam ipsum delectus, laborum ea ut explicabo nostrum laudantium? Hic, dolores quod quisquam quaerat ex possimus alias perferendis quidem praesentium ipsa, assumenda aut, consequatur ullam nemo eveniet officiis explicabo.</div>
                            <Rating stars={Math.floor(Math.random() * 6)} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const MapInfo = connect(
    mapStateToProps,
    mapDispatchToProps
)(MapInfoBind);

export default MapInfo;