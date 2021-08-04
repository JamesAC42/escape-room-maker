import { createActions } from "redux-actions";

export const settingsActions = createActions({
  TOGGLE_DARKMODE: (enabled) => ({ enabled }),
});

export const sessionActions = createActions({}, "LOGIN", "LOGOUT");

export const userinfoActions = createActions(
  {
    SET_USERNAME: (username) => ({ username }),
    SET_UID: (uid) => ({ uid }),
    SET_DISPLAY_NAME: (displayName) => ({ displayName }),
    SET_EMAIL: (email) => ({ email }),
    SET_CREATION_DATE: (creationDate) => ({ creationDate }),
    SET_DOB: (dob) => ({ dob }),
    SET_ADMIN: (admin) => ({ admin }),
    SET_VERIFIED: (verified) => ({ verified }),
    SET_SETTINGS: (settings) => ({ settings }),
    SET_RATED: (rated) => ({ rated }),
    SET_PLAYED: (played) => ({ played }),
    SET_FAVORITES: (favorites) => ({ favorites }),
  },
  "SET_LOADED",
  "UNLOAD"
);

export const createPageActions = createActions({
  SET_ACTIVE_ROOM: (activeRoom) => ({ activeRoom }),
  SET_MAP: (map) => ({ map }),
  SET_GRAPH: (graph) => ({ graph }),
});
