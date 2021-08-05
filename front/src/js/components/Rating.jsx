import React, { Component } from "react";
import { BsStarFill, BsStar } from "react-icons/bs";

import "../../css/rating.scss";

// Component that render 5 stars, with the amount of stars
// filled in based on the rating
class Rating extends Component {


  // Event handler for when a star is clicked.
  // Used when writing a review to set the rating.
  onClick(e, i) {
    if(this.props.onChange !== undefined) {
      this.props.onChange(i);
    }
  }

  render() {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < this.props.stars) {
        stars.push(
          <BsStarFill 
            style={{ verticalAlign: "middle" }} 
            key={i} 
            onClick={(e) => this.onClick(e, i)}/>);
      } else {
        stars.push(
          <BsStar 
            style={{ verticalAlign: "middle" }} 
            key={i}
            onClick={(e) => this.onClick(e, i)}/>);
      }
    }
    return <div className="rating-container">{stars}</div>;
  }
}

export default Rating;
