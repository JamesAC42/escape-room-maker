import React, { Component } from "react";
import { matchPath, Redirect } from "react-router";
import { Link } from "react-router-dom";
import Rating from "../Rating";

import bookmarkOutline from "../../../images/bookmark-outline.png";
import bookmarkFilled from "../../../images/bookmark-filled.png";

import { connect } from "react-redux";
import { userinfoActions } from "../../actions/actions";

import "../../../css/mapinfo/mapinfo.scss";

import GridBase from "../GridBase";

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
    fetch("/api/getMap?id=" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        withCredentials: "true",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Set the data after receiving it
          this.setState({ map: data.map });
        } else {
          console.log(data);
        }
      })
      .catch((error) => {
        console.error("Error: " + error);
      });
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
            console.log(data.map);
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
        <div className="bumpered-container mapinfo-container card">
          <div className="mapinfo-row">
            <div className="mapinfo-col mapinfo-meta">
              <div className="meta-row">
                <div className="mapinfo-title title">
                  {map.title} by {map.creator}
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
                  {map.timeLimit} seconds
                </div>
              </div>
              <div className="meta-row">
                <div className="description">{map.description}</div>
              </div>
              <div className="meta-row tags">
                {map.tags.map((tag) => (
                  <div className="tag">{tag}</div>
                ))}
              </div>
            </div>
            <div className="mapinfo-col mapinfo-data">
              <div className="rating-outer flex center-child">
                <Rating stars={4} />
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
              {map.ratings.length} ratings
            </div>
            <div className="mapinfo-review-item">
              <div className="mapinfo-review-title">Review title</div>
              <div className="mapinfo-review-author">By John Smith</div>
              <div className="mapinfo-review-body">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque
                numquam illum voluptatum laudantium iure fugiat? Ipsam
                consequuntur quisquam obcaecati, expedita sit numquam ipsum
                delectus, laborum ea ut explicabo nostrum laudantium? Hic,
                dolores quod quisquam quaerat ex possimus alias perferendis
                quidem praesentium ipsa, assumenda aut, consequatur ullam nemo
                eveniet officiis explicabo.
              </div>
              <Rating stars={Math.floor(Math.random() * 6)} />
            </div>
            <div className="mapinfo-review-item">
              <div className="mapinfo-review-title">Review title</div>
              <div className="mapinfo-review-author">By John Smith</div>
              <div className="mapinfo-review-body">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque
                numquam illum voluptatum laudantium iure fugiat? Ipsam
                consequuntur quisquam obcaecati, expedita sit numquam ipsum
                delectus, laborum ea ut explicabo nostrum laudantium? Hic,
                dolores quod quisquam quaerat ex possimus alias perferendis
                quidem praesentium ipsa, assumenda aut, consequatur ullam nemo
                eveniet officiis explicabo.
              </div>
              <Rating stars={Math.floor(Math.random() * 6)} />
            </div>
            <div className="mapinfo-review-item">
              <div className="mapinfo-review-title">Review title</div>
              <div className="mapinfo-review-author">By John Smith</div>
              <div className="mapinfo-review-body">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque
                numquam illum voluptatum laudantium iure fugiat? Ipsam
                consequuntur quisquam obcaecati, expedita sit numquam ipsum
                delectus, laborum ea ut explicabo nostrum laudantium? Hic,
                dolores quod quisquam quaerat ex possimus alias perferendis
                quidem praesentium ipsa, assumenda aut, consequatur ullam nemo
                eveniet officiis explicabo.
              </div>
              <Rating stars={Math.floor(Math.random() * 6)} />
            </div>
            <div className="mapinfo-review-item">
              <div className="mapinfo-review-title">Review title</div>
              <div className="mapinfo-review-author">By John Smith</div>
              <div className="mapinfo-review-body">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque
                numquam illum voluptatum laudantium iure fugiat? Ipsam
                consequuntur quisquam obcaecati, expedita sit numquam ipsum
                delectus, laborum ea ut explicabo nostrum laudantium? Hic,
                dolores quod quisquam quaerat ex possimus alias perferendis
                quidem praesentium ipsa, assumenda aut, consequatur ullam nemo
                eveniet officiis explicabo.
              </div>
              <Rating stars={Math.floor(Math.random() * 6)} />
            </div>
            <div className="mapinfo-review-item">
              <div className="mapinfo-review-title">Review title</div>
              <div className="mapinfo-review-author">By John Smith</div>
              <div className="mapinfo-review-body">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque
                numquam illum voluptatum laudantium iure fugiat? Ipsam
                consequuntur quisquam obcaecati, expedita sit numquam ipsum
                delectus, laborum ea ut explicabo nostrum laudantium? Hic,
                dolores quod quisquam quaerat ex possimus alias perferendis
                quidem praesentium ipsa, assumenda aut, consequatur ullam nemo
                eveniet officiis explicabo.
              </div>
              <Rating stars={Math.floor(Math.random() * 6)} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const MapInfo = connect(mapStateToProps, mapDispatchToProps)(MapInfoBind);

export default MapInfo;
