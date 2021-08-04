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

class LoginBind extends Component {
  state;
  constructor(props) {
    super(props);
    this.state = new LoginState();
  }
  toggleMode() {
    this.setState({
      mode: this.state.mode ? 0 : 1,
      error: "",
    });
  }
  updateLoginValues(e) {
    this.setState({
      ...this.state,
      login: {
        ...this.state.login,
        [e.target.name]: e.target.value,
      },
    });
  }
  updateRegisterValues(e) {
    this.setState({
      ...this.state,
      register: {
        ...this.state.register,
        [e.target.name]: e.target.value,
      },
    });
  }
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
  submit() {
    if (this.state.mode) {
      this.login();
    } else {
      this.register();
    }
  }
  login() {
    if (this.state.login.email === "" || this.state.login.password === "") {
      this.setState({
        error: "Invalid input.",
      });
      return;
    }
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
  register() {
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
    if (!validateEmail(this.state.register.email)) {
      this.setState({
        error: "Invalid email address.",
      });
      return;
    }
    if (this.state.register.password !== this.state.register.passwordConfirm) {
      this.setState({
        error: "Passwords do not match.",
      });
      return;
    }
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
  render() {
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
