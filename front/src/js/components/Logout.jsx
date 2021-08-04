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

class LogoutBind extends Component {
  state;
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };
  }
  componentDidMount() {
    if (!this.props.session.loggedin) return;
    fetch("/api/destroySession", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          this.setState({ redirect: true });
        }
      })
      .catch((error) => {
        console.error("Error: " + error);
      });
  }
  componentWillUnmount() {
    this.props.unload();
    this.props.logout();
  }
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
