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
            <li className="flex flex-row"><Link to="/">EscapeRoom</Link></li>
            <li className="flex flex-row"><Link to="/Profile">Profile</Link></li>
            <li className="flex flex-row"><Link to="/Create">Create</Link></li>
            <li className="flex flex-row right-link"><Link to="/Logout">Logout</Link></li>
          </ul>
        </div>
      )
    } else {
      return (
        <div className="outer-navbar">
          <ul className>
            <li className="flex flex-row"><Link to="/">EscapeRoom</Link></li>
            <li className="flex flex-row"><Link to="/Create">Create</Link></li>
            <li className="flex flex-row right-link"><Link to="/Login">Login</Link></li>
          </ul>
        </div>
      )
    }
  }
}

const NavBar = connect(mapStateToProps)(NavBarBind);

export default NavBar;
