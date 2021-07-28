import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";

import "../../../css/profile/profile.scss";
import userImg from '../../../images/user.png';

import MapItem from '../MapItem';

const mapStateToProps = (state, props) => ({
  session: state.session,
  userinfo: state.userinfo,
});

class ProfileState {
  constructor() {
    this.myMaps = [];
  }
}

class ProfileBind extends Component {
  constructor(props) {
    super(props);
    this.state = new ProfileState();
  }
  componentDidMount() {
    fetch('/api/getMyMaps', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
      if(data.success) {
        this.setState({myMaps: data.maps});
        console.log(data.maps);
      }
    })
    .catch(error => {
        console.error('Error: ' +  error);
    })
  }
  render() {
    if (!this.props.session.loggedin) {
      return <Redirect to="/login/profile" />;
    }
    if(!this.props.userinfo.loaded) return null;
    return (
      <div className="container">
        <div className="bumpered-container">
          <div className="profile-row">
            <div className="card profile-card user-header">
              <img className="profile-img" src={userImg} alt="profile"/>
            </div>
            <div className="card profile-card user-info">
              <div className="username">
                <span className="user-info-label">Username: </span>
                {this.props.userinfo.username}
              </div>
              <div className="email">
                <span className="user-info-label">Email: </span>
                {this.props.userinfo.email}
              </div>
              <div className="creation-date">
                <span className="user-info-label">User Since: </span>
                {this.props.userinfo.creationDate.toLocaleString()}
              </div>
              <div className="dob">
                <span className="user-info-label">Birthday: </span>
                {this.props.userinfo.dob.toLocaleString()}
              </div>
              <div className="verified">
                <span className="user-info-label">Verified: </span>
                {this.props.userinfo.verified ? "Yes" : "No"}
              </div>

              <div className="logout">
                <Link to="/logout">Log Out</Link>
              </div>
            </div>
          </div>
          <div className="spacer"></div>
          <div className="profile-header">
            <div className="card header-card">
              My Maps
            </div>
          </div>
          <div className="profile-row">
            <div className="map-list card">
              {
                this.state.myMaps.map((map) => 
                  <MapItem
                    id={map.uid}
                    title={map.title}
                    creator={this.props.userinfo.username}
                    createdOn={new Date(map.created_on)}
                    rating={5}
                    description={map.description}
                    timesCompleted={map.times_completed}
                    tags={JSON.parse(map.tags)}
                    ratings={JSON.parse(map.ratings)}/>
                )
              }
            </div>
          </div>
          <div className="spacer"></div>
        </div>
      </div>
    );
  }
}

const Profile = connect(mapStateToProps)(ProfileBind);

export default Profile;
