import { createStore, combineReducers } from "redux";

import create from "./reducers/create";
import settings from "./reducers/settings";
import session from "./reducers/session";
import userinfo from "./reducers/userinfo";

// The default, initial state of the redux store
let initState = {
  settings: {
    darkMode: false,
  },
  session: {
    loggedin: false,
  },
  userinfo: {
    username: undefined,
    email: undefined,
    uid: undefined,
    displayName: undefined,
    creationDate: undefined,
    dob: undefined,
    verified: undefined,
    admin: undefined,
    rated: undefined,
    settings: undefined,
    played: undefined,
    favorites: undefined,
    loaded: false,
  },
  create: {
    activeRoom: undefined,
    graph: undefined,
    map: undefined,
  }
};

// Combines the reducers to bind them to the store
const escapeRoomReducer = combineReducers({
  settings,
  session,
  userinfo,
  create,
});

const configureStore = (reducer, initState) => {
  return createStore(reducer, initState);
};

export default configureStore(escapeRoomReducer, initState);
