import { handleActions } from "redux-actions";

// Reducer for mutating the event window relevant redux store data
const eventWindow = handleActions(
  {
    SET_ROOM_VALS: (state, action) => {
      return {
        ...state,
        roomVals: action.payload.roomVals,
      };
    },
  },
  {
    roomVals: undefined,
  }
);

export { eventWindow as default };
