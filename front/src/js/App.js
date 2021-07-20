import React from 'react';
import '../css/fonts.scss';
import '../css/App.scss';
import '../css/master.scss';
import {
  Switch,
  Route
} from 'react-router-dom';

import SessionHandler from './components/SessionHandler';

import Home from './components/Home';
import Create from './components/create/Create.jsx';
import Window from './components/Window';
import Profile from './components/profile/Profile';
import Login from './components/login/Login';
import Logout from './components/Logout';
import MapInfo from './components/mapinfo/MapInfo';
import NavBar from './components/NavBar';

function App() {
  return (
    <div>

      <SessionHandler/>

      <NavBar/>

      <div className="stripe"></div>
      <Switch>
        <Route
          exact
          path="/"
          component={Home} />

        <Route
          exact
          path="/create"
          component={Create} />

        <Route
          exact
          path="/window"
          component={Window} />

        <Route
          exact
          path="/login/:from?"
          component={Login} />

        <Route
          exact
          path="/profile"
          component={Profile} />

        <Route
          exact
          path="/logout"
          component={Logout} />

        <Route
          exact
          path="/map/:id?"
          component={MapInfo} />

      </Switch>
    </div>
  );
}

export default App;
