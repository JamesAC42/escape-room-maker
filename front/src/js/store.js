import { createStore, combineReducers } from "redux";

import create from './reducers/create';
import eventWindow from './reducers/eventWindow';

let initState = {
  create: {
    activeRoom: undefined,
    graph: undefined,
    map:undefined
  }
};

const escapeRoomReducer = combineReducers({
  create,
  eventWindow
});

const configureStore = (reducer, initState) => {
  return createStore(reducer, initState);
}

export default configureStore(escapeRoomReducer, initState);
