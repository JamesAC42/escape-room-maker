import { handleActions } from "redux-actions";

// Reducer for mutating the session relevant redux store data
const session = handleActions(
  {
    LOGIN: (state, action) => ({
      ...state,
      loggedin: true,
    }),
    LOGOUT: (state, action) => ({
      ...state,
      loggedin: false,
    }),
  },
  {
    loggedin: undefined,
  }
);

export { session as default };
