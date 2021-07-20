import React, { Component } from 'react';
import '../../../css/MapCard.scss';

class MapCardState {
  constructor() {
    console.log("MapCardState created");
  }
}

class MapCard extends Component {
  constructor(props){
    super(props);
    this.state = new MapCardState();
  }
  
  style_hidden = {
    "visibility": "hidden"
  }
  
  style_visible = {
    "visibility": "visible"
  }
  
  style_tag = {
      "margin-top": "10px",
      "margin-right": "10px",
      "background-color": "lightblue",
      "padding": "5px 15px",
      "border-radius": "20px"
  }
  
  render() {
    return(
      <div className="map-overview" style={this.props.style ? this.props.style : this.style_visible}>
        
        <img className="thumbnail" />
        
        <div className="mo-data">
            
            <div className="mo-info">
                <h3 className="mo-title">Title: {this.props.title}</h3>
                <h3 className="mo-rating">Rating: {this.props.rating}</h3>
            </div>
            
            <div className="mo-info">
                <h3 className="mo-desc">{this.props.desc}</h3>
            </div>
            
            <div className="mo-info">
                <h3 className="mo-creator">Created by: {this.props.creator}</h3>
                <h3 className="mo-total-rooms">Total rooms: {this.props.roomCount}</h3>
            </div>
            
            <div className="mo-info">
                <h3 className="mo-total-plays">Total plays: {this.props.totalPlays}</h3>
                <h3 className="mo-difficulty">Difficulty: {this.props.difficulty}</h3>
            </div>
            
            <div className="mo-tag-section">
                <div className="mo-tag-list">{this.props.tags.map(tag => <span style={this.style_tag}>{tag}</span>)}</div>
            </div>
        </div>
        
        
      </div>  
    );
  }
}

export default MapCard;
