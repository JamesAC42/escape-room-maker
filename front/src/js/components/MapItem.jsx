import React, { Component } from "react";
import { Link } from "react-router-dom";

import "../../css/mapitem.scss";
import Rating from "./Rating";

// Component to render a MapItem as shown in the list view on the
// profile and library pages
class MapItem extends Component {
  // Returns an "s" if the quantity is not 1
  plural(text, amt) {
    return `${text}${amt === 1 ? "" : "s"}`;
  }

  // Render all of the given map information passed in through the props
  render() {
    return (
      <div className="map-item">
        <div className="map-meta">
          <div className="map-title">
            <Link to={"/map/" + this.props.id}>{this.props.title}</Link>
          </div>
          {this.props.creator !== "" ? (
            <div className="map-author">Creator: {this.props.creator}</div>
          ) : null}
          <div className="map-creation-date">
            Created on: {this.props.createdOn.toLocaleString()}
          </div>
        </div>
        <div className="map-description">{this.props.description}</div>
        <div className="map-tags">
          {this.props.tags.map((tag) => (
            <div className="tag" key={tag}>
              {tag}
            </div>
          ))}
        </div>
        <div className="map-stats">
          <div className="map-ratings-amt">
            {this.props.reviews}{" "}
            {this.plural("Review", parseInt(this.props.reviews))}
          </div>
        </div>
      </div>
    );
  }
}

export default MapItem;
