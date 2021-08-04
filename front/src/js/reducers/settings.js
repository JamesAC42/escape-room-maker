import { handleActions } from "redux-actions";

// Reducer for mutating the settings relevant redux store data
const settings = handleActions(
  {
    TOGGLE_DARKMODE: (state, action) => {
      return {
        ...state,
        darkMode: action.payload.enabled,
      };
    },
  },
  {
    darkMode: false,
  }
);

export { settings as default };
