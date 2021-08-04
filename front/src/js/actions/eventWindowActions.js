import { createActions } from "redux-actions";

// Redux actions for mutating the eventWindow store values

export const eventWindowActions = createActions({
  SET_ROOM_VALS: (roomVals) => ({ roomVals }),
});
