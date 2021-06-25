import { createActions } from "redux-actions";

export const createPageActions = createActions(
  {
    SET_ACTIVE_ROOM: activeRoom => ({ activeRoom }),
    SET_MAP: map => ({ map }),
    SET_GRAPH: graph => ({ graph })
  }
);
