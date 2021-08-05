import React, { Component } from "react";

import { connect } from "react-redux";
import Rating from "../Rating";
import "../../../css/review.scss";
import trash from "../../../images/trash.png";

const mapStateToProps = (state) => ({
  session: state.session,
  userinfo: state.userinfo,
});

// Component class that renders a map review.
// Also allows the creator of the review to delete it.
class ReviewBind extends Component {

  // Makes server call to delete the review from the database
  deleteReview() {
    if (!this.canDelete()) return;
    fetch("/api/removeReview/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: this.props.review.uid,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
            this.props.removeReview(this.props.review.uid);
        } else {
            console.log(data);
        }
      })
      .catch((error) => {
        console.error("Error: " + error);
      });
  }

  // Check if the current user can delete this review,
  // only if logged in and the author
  canDelete() {
    if (!this.props.session.loggedin) {
      return false;
    }
    return this.props.userinfo.username === this.props.review.author;
  }

  render() {
    return (
      <div className="mapinfo-review-item">
        <div className="mapinfo-review-title">{this.props.review.title}</div>
        <div className="mapinfo-review-author">{this.props.review.author}</div>
        <div className="mapinfo-review-date">
          {new Date(this.props.review.timestamp).toLocaleString()}
        </div>
        <div className="mapinfo-review-body">{this.props.review.body}</div>
        <div className="review-float flex flex-row">
          {this.canDelete() ? (
            <img 
                src={trash} 
                className="delete-review" 
                alt="Delete Rating" 
                onClick={() => this.deleteReview()}/>
          ) : null}
          <Rating stars={this.props.review.rating} />
        </div>
      </div>
    );
  }
}

const Review = connect(mapStateToProps)(ReviewBind);

export default Review;
