import React, { Component } from "react";
import maze from "../../../images/maze.png";
import "../../../css/login.scss";
import { Redirect } from "react-router";
import { connect } from "react-redux";

import DatePicker from "react-date-picker";
import { LoginState } from "./LoginState";

import validateEmail from "../../validateEmail";

import { sessionActions, userinfoActions } from "../../actions/actions";

const mapStateToProps = (state, props) => ({
  session: state.session,
  userinfo: state.userinfo,
});

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

// Login component class for displaying the login page
class LoginBind extends Component {
  state;
  constructor(props) {
    super(props);
    this.state = new LoginState();
  }

  // Toggles whether the Login or Registration form is being displayed
  toggleMode() {
    this.setState({
      mode: this.state.mode ? 0 : 1,
      error: "",
    });
  }

  // Event handler for setting the login input values
  updateLoginValues(e) {
    this.setState({
      ...this.state,
      login: {
        ...this.state.login,
        [e.target.name]: e.target.value,
      },
    });
  }

  // Event handler for setting the register input values
  updateRegisterValues(e) {
    this.setState({
      ...this.state,
      register: {
        ...this.state.register,
        [e.target.name]: e.target.value,
      },
    });
  }

  // Storing all of the user data received from the server
  // into the redux store via reducer
  setData(data) {
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

  // Determines whether to call login or register when the submit button is clicked
  submit() {
    if (this.state.mode) {
      this.login();
    } else {
      this.register();
    }
  }

  // Validates the user input and makes a request to the server to login
  login() {
    // Ensure non-empty input
    if (this.state.login.email === "" || this.state.login.password === "") {
      this.setState({
        error: "Invalid input.",
      });
      return;
    }

    // Send login request to server
    fetch("/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...this.state.login,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // If the request went through successfully,
        // set the data and login.
        // Otherwise, display the error message
        if (data.success) {
          this.setData(data);
          this.setState({
            error: "",
          });
        } else {
          this.setState({
            ...this.state,
            error: data.error,
          });
        }
      })
      .catch((error) => {
        console.error("Error: " + error);
      });
  }

  // Validate the user input and contact the server to register
  register() {
    // ensure non-empty input
    if (
      this.state.register.email === "" ||
      this.state.register.username === "" ||
      this.state.register.password === "" ||
      this.state.register.passwordConfirm === "" ||
      this.state.register.dob === null
    ) {
      this.setState({
        error: "Invalid input.",
      });
      return;
    }
    // Verify proper email format
    if (!validateEmail(this.state.register.email)) {
      this.setState({
        error: "Invalid email address.",
      });
      return;
    }
    // Verify passwords match
    if (this.state.register.password !== this.state.register.passwordConfirm) {
      this.setState({
        error: "Passwords do not match.",
      });
      return;
    }
    // Send register request to server
    fetch("/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...this.state.register,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // If the request went through successfully,
        // set the data and login.
        // Otherwise, display the error message
        if (data.success) {
          this.setData(data);
          this.setState({
            error: "",
          });
        } else {
          this.setState({
            ...this.state,
            error: data.error,
          });
        }
      })
      .catch((error) => {
        console.error("Error: " + error);
      });
  }

  // Render the component on the page
  render() {
    // Redirect to the proper page if the user is alread logged in
    if (this.props.session.loggedin) {
      let params = this.props.match.params.from;
      if (params !== undefined) {
        let r = "/" + params;
        return <Redirect to={r} />;
      } else {
        return <Redirect to="/profile" />;
      }
    }
    return (
      <div className="login-outer">
        <div className="maze-image center-child">
          <img src={maze} alt="maze" />
        </div>
        <div className="form-input-outer center-child">
          <div className="form-input-inner flex-col">
            <div className="toggle-mode" onClick={() => this.toggleMode()}>
              {this.state.mode ? "Register" : "Login"}
            </div>
            <div className="login-header">
              {this.state.mode ? "Login" : "Register"}
            </div>
            {this.state.mode ? (
              <form>
                <div className="input-item">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    maxLength={200}
                    value={this.state.login.email}
                    onChange={(e) => this.updateLoginValues(e)}
                  />
                </div>
                <div className="input-item">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    maxLength={200}
                    value={this.state.login.password}
                    onChange={(e) => this.updateLoginValues(e)}
                  />
                </div>
              </form>
            ) : (
              <form>
                <div className="input-item">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    maxLength={200}
                    value={this.state.register.email}
                    onChange={(e) => this.updateRegisterValues(e)}
                  />
                </div>
                <div className="input-item">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    maxLength={200}
                    value={this.state.register.username}
                    onChange={(e) => this.updateRegisterValues(e)}
                  />
                </div>
                <div className="input-item">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    maxLength={200}
                    value={this.state.register.password}
                    onChange={(e) => this.updateRegisterValues(e)}
                  />
                </div>
                <div className="input-item">
                  <label htmlFor="passwordConfirm">Confirm Password</label>
                  <input
                    type="password"
                    name="passwordConfirm"
                    placeholder="Confirm Password"
                    maxLength={200}
                    value={this.state.register.passwordConfirm}
                    onChange={(e) => this.updateRegisterValues(e)}
                  />
                </div>
                <div className="input-item">
                  <label htmlFor="dob">Birthday</label>
                  <DatePicker
                    maxDate={new Date()}
                    onChange={(value) => {
                      this.updateRegisterValues({
                        target: {
                          name: "dob",
                          value,
                        },
                      });
                    }}
                    value={this.state.register.dob}
                  />
                </div>
              </form>
            )}
            {this.state.error !== "" ? (
              <div className="form-error">{this.state.error}</div>
            ) : null}
            <div className="submit-login">
              <div className="submit-button" onClick={() => this.submit()}>
                {this.state.mode ? "Login" : "Register"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const Login = connect(mapStateToProps, mapDispatchToProps)(LoginBind);

export default Login;
