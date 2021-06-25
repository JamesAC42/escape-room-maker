import React from 'react';
import '../css/fonts.scss';
import '../css/App.scss';
import '../css/master.scss';
import {
  Switch,
  Route
} from 'react-router-dom';

import Home from './components/Home';
import Create from './components/create/Create';

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
          
      </Switch>
    </div>
  );
}

export default App;
