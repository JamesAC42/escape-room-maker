import React, { Component } from "react";
import { Link } from "react-router-dom";

import "../../css/mapitem.scss";
import Rating from './Rating';

class MapItem extends Component {
  plural(text, amt) {
    return `${text}${amt === 1 ? "" : "s"}`;
  }
  render() {
    return (
      <div className="map-item">
        <div className="map-meta">
          <div className="map-title">
              <Link to={"/map/" + this.props.id}>{this.props.title}</Link>
          </div>
          {
            this.props.creator !== "" ?
            <div className="map-author">Creator: {this.props.creator}</div> : null
          }
          <div className="map-creation-date">Created on: {this.props.createdOn.toLocaleString()}</div>
          <Rating stars={this.props.rating} />
        </div>
        <div className="map-description">
          {this.props.description}
        </div>
        <div className="map-tags">
          {this.props.tags.map(tag => <div className="tag" key={tag}>{tag}</div>)}
        </div>
        <div className="map-stats">
          <div className="map-played">Played {this.props.timesCompleted} {this.plural("time", this.props.timeCompleted)}</div>
          <div className="map-ratings-amt">{this.props.ratings.length} {this.plural("Rating", this.props.ratings.length)}</div>
        </div>
      </div>
    );
  }
}

export default MapItem;
