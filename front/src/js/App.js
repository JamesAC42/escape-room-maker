import React from 'react';
import '../css/fonts.scss';
import '../css/App.scss';
import '../css/master.scss';
import {
  Switch,
  Route
} from 'react-router-dom';

import Home from './components/Home';
import Create from './components/Create';
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
          path="/window"
          component={Window} />
          
      </Switch>
    </div>
  );
}

export default App;
