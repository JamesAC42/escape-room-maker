import React, { Component } from "react";
import { matchPath, Redirect } from "react-router";
import { Link } from "react-router-dom";
import Rating from "../Rating";

import bookmarkOutline from "../../../images/bookmark-outline.png";
import bookmarkFilled from "../../../images/bookmark-filled.png";

import { connect, ReactReduxContext } from "react-redux";
import { userinfoActions } from "../../actions/actions";

import { getData } from "../getData";

import "../../../css/mapinfo/mapinfo.scss";

import GridBase from "../GridBase";
import Review from "./Review";

const mapStateToProps = (state, props) => ({
  session: state.session,
  userinfo: state.userinfo,
});

const mapDispatchToProps = {
  setFavorites: userinfoActions.setFavorites,
};

// Stores the state information for the map to be displayed
class MapInfoState {
  constructor() {
    this.map = {};
    this.averageRating = 1;
    this.reviews = [];
    this.showReviewForm = false;
    this.reviewForm = {
      title: "",
      body: "",
      rating: 3,
    };
    this.reviewFormError = "";
  }
}

// The MapInfo component class shows all information about a
// given map
class MapInfoBind extends Component {
  state;
  constructor(props) {
    super(props);
    this.state = new MapInfoState();
  }
  // After the component mounts, make a request to the API to
  // get the map's data
  componentDidMount() {
    // Get the map ID from the URL parameters
    const id = this.props.match.params.id;
    if (id === undefined) return;
    getData("/api/getMap?id=" + id).then((data) => {
      if (data.success) {
        // Set the data after receiving it
        this.setState({ map: data.map });
      } else {
        console.log(data);
      }
    });
    getData("/api/getMapReviews?id=" + id).then((data) => {
      if (data.success) {
        // Set the data after receiving it
        this.setState({
          reviews: data.reviews,
        });
        this.calculateAverageRating(data.reviews);
      } else {
        console.log(data);
      }
    });
  }

  // Calculates the average rating based on the reviews
  calculateAverageRating(reviews) {
    let total = 0;
    reviews.forEach((review) => {
      total += review.rating;
    });
    this.setState({ averageRating: Math.round(total / reviews.length) });
  }

  // Determines whether the current map is bookmarked by the user
  isFavorite() {
    let favorites = [];
    let currentMap = this.props.match.params.id;
    this.props.userinfo.favorites.forEach((map) => {
      favorites.push(map.uid);
    });
    return favorites.indexOf(currentMap);
  }

  // Toggles whether the current map is bookmarked
  toggleFavorite() {
    // Determine whether to remove or add it as a favorite
    let index = this.isFavorite();
    let url;
    if (index === -1) {
      url = "/api/addFavorite/";
    } else {
      url = "/api/removeFavorite";
    }

    // Make the API request to update the user information
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mapid: this.props.match.params.id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // If successful, update the information client-side
        // to be in sync with the server
        if (data.success) {
          let favorites = [...this.props.userinfo.favorites];
          if (index === -1) {
            favorites.push(data.map);
          } else {
            favorites.splice(index, 1);
          }
          this.props.setFavorites(favorites);
        } else {
          console.log(data);
        }
      })
      .catch((error) => {
        console.error("Error: " + error);
      });
  }

  // Renders the bookmark icon as filled or not
  // depending on whether the map is a bookmark
  renderBookmarkIcon() {
    if (this.props.session.loggedin) {
      return (
        <div
          className="favorite-button flex center-child"
          onClick={() => this.toggleFavorite()}
        >
          {this.isFavorite() === -1 ? (
            <img src={bookmarkOutline} alt="bookmark" />
          ) : (
            <img src={bookmarkFilled} alt="bookmark" />
          )}
        </div>
      );
    } else {
      return null;
    }
  }

  // Toggles whether the review form is visible
  toggleReviewForm() {
    this.setState({
      showReviewForm: !this.state.showReviewForm,
    });
  }

  // Event handler for setting the user input in the
  // review form
  handleFormInput(e) {
    this.setState({
      ...this.state,
      reviewForm: {
        ...this.state.reviewForm,
        [e.target.name]: e.target.value,
      },
    });
  }

  // Event handler for changing the rating when making
  // a review
  handleStarChange(i) {
    this.setState({
      ...this.state,
      reviewForm: {
        ...this.state.reviewForm,
        rating: i + 1,
      },
    });
  }

  // Gather the form data and send it to the server to add a
  // review to the current map
  submitReview() {
    if (!this.props.session.loggedin) {
      return;
    }
    if (
      this.state.reviewForm.title === "" ||
      this.state.reviewForm.body === ""
    ) {
      this.setState({ reviewFormError: "Invalid input." });
      return;
    }

    const reviewData = {
      ...this.state.reviewForm,
      mapId: this.props.match.params.id,
    };
    fetch("/api/addReview/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Construct the review and add it to the
          // local list of reviews to be in sync
          let review = {
            author: this.props.userinfo.username,
            body: this.state.reviewForm.body,
            rating: this.state.reviewForm.rating,
            title: this.state.reviewForm.title,
            uid: data.id,
            timestamp: data.timestamp,
          };
          let reviews = [...this.state.reviews];
          reviews.push(review);

          // Reset the form values
          this.setState({
            showReviewForm: false,
            reviewForm: {
              title: "",
              body: "",
              rating: 1,
            },
            reviewFormError: "",
            reviews,
          });
          this.calculateAverageRating(reviews);
        } else {
          console.log(data);
        }
      })
      .catch((error) => {
        console.error("Error: " + error);
      });
  }

  // Remove a review from the list of reviews
  removeReview(uid) {
    let reviews = [...this.state.reviews];
    reviews = reviews.filter((review) => {
      return review.uid !== uid;
    });
    this.setState({ reviews });
    this.calculateAverageRating(reviews);
  }

  // Render the component
  render() {
    // If the map id wasn't provided, redirect to the home page
    if (this.props.match.params.id === undefined) {
      return <Redirect to="/" />;
    }

    // Don't render until the map is loaded
    if (this.state.map.uid === undefined) return null;
    let map = { ...this.state.map };
    return (
      <div className="container mapinfo-container">
        <div className="bumpered-container card">
          <div className="mapinfo-row">
            <div className="mapinfo-col mapinfo-meta">
              <div className="meta-row">
                <div className="mapinfo-title title">
                  {map.title} by{" "}
                  <span className="mapinfo-creator">{map.creator}</span>
                </div>
                {this.renderBookmarkIcon()}
              </div>
              <div className="meta-row">
                <div className="creation-date">
                  <span className="meta-info-label">Created: </span>{" "}
                  {new Date(map.createdOn).toLocaleDateString()}
                </div>
                <div className="modified-date">
                  <span className="meta-info-label">Modified: </span>{" "}
                  {new Date(map.lastModified).toLocaleDateString()}
                </div>
                <div className="times-completed">
                  <span className="meta-info-label">Completed: </span>{" "}
                  {map.timesCompleted} times.
                </div>
                <div className="explicit">
                  <span className="meta-info-label">Explicit: </span>{" "}
                  {map.explicit ? "Yes" : "No"}
                </div>
                <div className="time-limit">
                  <span className="meta-info-label">Time Limit: </span>
                  {map.timeLimit === 0 ? "None" : `${map.timeLimit} seconds`}
                </div>
              </div>
              <div className="meta-row">
                <div className="description">{map.description}</div>
              </div>
              <div className="meta-row tags">
                {map.tags.map((tag) => (
                  <div key={tag} className="tag">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
            <div className="mapinfo-col mapinfo-data">
              <div className="rating-outer flex center-child">
                <Rating stars={this.state.averageRating} />
              </div>
              <Link to={"/play/" + this.state.map.uid}>
                <div className="play-button">Play</div>
              </Link>
            </div>
          </div>
          <div className="mapinfo-row">
            <GridBase graph={map.graph} className={"mapinfo-grid"} />
          </div>
          <div className="mapinfo-reviews">
            <div className="mapinfo-reviews-header">
              {this.state.reviews.length} review
              {this.state.reviews.length === 1 ? "" : "s"}
              {this.props.session.loggedin ? (
                <div
                  className="mapinfo-toggle-review-form"
                  onClick={() => this.toggleReviewForm()}
                >
                  Write a Review
                </div>
              ) : null}
            </div>

            {this.state.showReviewForm && this.props.session.loggedin ? (
              <div className="mapinfo-form-outer flex flex-row">
                <div className="input-outer flex flex-col">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    onChange={(e) => this.handleFormInput(e)}
                    value={this.state.reviewForm.title}
                  />
                  <textarea
                    name="body"
                    id="reviewtext"
                    cols="30"
                    rows="5"
                    placeholder="Review..."
                    onChange={(e) => this.handleFormInput(e)}
                    value={this.state.reviewForm.body}
                  ></textarea>
                </div>
                <div className="submit-outer flex flex-col">
                  <div className="stars-setting">
                    <Rating
                      stars={this.state.reviewForm.rating}
                      onChange={(i) => this.handleStarChange(i)}
                    />
                  </div>
                  <div className="submit-button-outer">
                    <div
                      className="submit-button"
                      onClick={() => this.submitReview()}
                    >
                      Submit
                    </div>
                  </div>
                  <div className="form-error">{this.state.reviewFormError}</div>
                </div>
              </div>
            ) : null}
            {this.state.reviews.length === 0 ? (
              <div className="no-reviews flex center-child">
                This map has no reviews
              </div>
            ) : null}
            {this.state.reviews.map((review) => (
              <Review
                key={review.uid}
                review={review}
                removeReview={(review) => this.removeReview(review)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const MapInfo = connect(mapStateToProps, mapDispatchToProps)(MapInfoBind);

export default MapInfo;
