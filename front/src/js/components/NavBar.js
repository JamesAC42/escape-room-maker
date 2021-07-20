import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import '../../css/NavBar.scss';

const mapStateToProps = (state, props) => ({
  session: state.session,
  userinfo: state.userinfo,
});

class NavBarBind extends Component {
  render() {
    if (this.props.session.loggedin) {
      return (
        <div className="outer-navbar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/Profile">Profile</Link></li>
            <li><Link to="/Create">Create</Link></li>
            <li class="navbar-right-item"><Link to="/Logout">Logout</Link></li>
          </ul>
        </div>
      )
    } else {
      return (
        <div className="outer-navbar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/Create">Create</Link></li>
            <li class="navbar-right-item"><Link to="/Login">Login</Link></li>
          </ul>
        </div>
      )
    }
  }
}

const NavBar = connect(mapStateToProps)(NavBarBind);

export default NavBar;
