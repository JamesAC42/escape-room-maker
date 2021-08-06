import React, { Component } from "react";
import { connect } from "react-redux";

import { sessionActions, userinfoActions } from "../actions/actions";

const mapDispatchToProps = {
  login: sessionActions.login,
  logout: sessionActions.logout,
  setUsername: userinfoActions.setUsername,
  setUid: userinfoActions.setUid,
  setDisplayName: userinfoActions.setDisplayName,
  setEmail: userinfoActions.setEmail,
  setCreationDate: userinfoActions.setCreationDate,
  setDob: userinfoActions.setDob,
  setAdmin: userinfoActions.setAdmin,
  setVerified: userinfoActions.setVerified,
  setSettings: userinfoActions.setSettings,
  setRated: userinfoActions.setRated,
  setPlayed: userinfoActions.setPlayed,
  setFavorites: userinfoActions.setFavorites,
  setLoaded: userinfoActions.setLoaded,
};

// Component that is rendered automatically when the page
// first loads. Makes a request to the server to see if
// the client has an active session. If they do, then it
// logs them in and sets all of the user data
class SessionHandlerBind extends Component {
  componentDidMount() {
    // Makes the server request
    fetch("/api/getUserInfo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        withCredentials: "true",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // If no user session, log out
        if (data.loggedout) {
          this.props.logout();
        } else {
          // Otherwise, set all of the user data
          this.props.setEmail(data.email);
          this.props.setUsername(data.username);
          this.props.setUid(data.uid);
          this.props.setDisplayName(data.display_name);
          this.props.setCreationDate(new Date(data.creation_date));
          this.props.setDob(new Date(data.dob));
          this.props.setRated(data.rated);
          this.props.setPlayed(data.played);
          this.props.setFavorites(data.favorites);
          this.props.setAdmin(data.admin);
          this.props.setVerified(data.verified);
          this.props.setSettings(data.settings);
          this.props.setLoaded();
          this.props.login();
        }
      })
      .catch((error) => {
        console.error("Error: " + error);
      });
  }

  render() {
    return <div></div>;
  }
}

const SessionHandler = connect(null, mapDispatchToProps)(SessionHandlerBind);

export default SessionHandler;
