import { createActions } from "redux-actions";

export const eventWindowActions = createActions(
  {
    SET_ROOM_VALS: roomVals => ({ roomVals })
  }
);
