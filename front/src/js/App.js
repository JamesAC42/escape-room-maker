import React from 'react';
import '../css/fonts.scss';
import '../css/App.scss';
import {
  Switch,
  Route
} from 'react-router-dom';

import Home from './components/Home';
import Create from './components/Create';
import Play from './components/Play';
import Window from './components/Window';

function App() {
  return (
    <div>
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
          path="/play"
          component={Play} />
        
        <Route
          exact
          path="/window"
          component={Window} />
          
      </Switch>
    </div>
  );
}

export default App;
