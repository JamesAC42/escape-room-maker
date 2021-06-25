import { createStore, combineReducers } from "redux";

import create from './reducers/create';

let initState = {
  create: {
    activeRoom: undefined,
    graph: undefined,
    map:undefined
  }
};

const escapeRoomReducer = combineReducers({
  create
});

const configureStore = (reducer, initState) => {
  return createStore(reducer, initState);
}

export default configureStore(escapeRoomReducer, initState);