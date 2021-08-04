import React, { Component } from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";

import { sessionActions, userinfoActions } from "../actions/actions";

const mapStateToProps = (state, props) => ({
  session: state.session,
});

const mapDispatchToProps = {
  logout: sessionActions.logout,
  unload: userinfoActions.unload,
};

// Page component class that logs the user out when loaded
// if the user was currently logged in
class LogoutBind extends Component {
  state;
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };
  }
  // Make the API request to the server to destroy the
  // user's session and log them out
  componentDidMount() {
    if (!this.props.session.loggedin) return;
    fetch("/api/destroySession", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        // Redirect to the home page after logging out
        if (data.success) {
          this.setState({ redirect: true });
        }
      })
      .catch((error) => {
        console.error("Error: " + error);
      });
  }
  // Reset all of the user information and log out
  componentWillUnmount() {
    this.props.unload();
    this.props.logout();
  }

  // Render the component to redirect if necessary
  render() {
    if (this.state.redirect || !this.props.session.loggedin) {
      return <Redirect to="/" />;
    } else {
      return null;
    }
  }
}

const Logout = connect(mapStateToProps, mapDispatchToProps)(LogoutBind);

export default Logout;
