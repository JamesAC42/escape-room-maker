import { handleActions } from 'redux-actions'

const userinfo = handleActions(
  {
    SET_USERNAME: (state, action) => ({
      ...state,
      username: action.payload.username
    }),
    SET_UID: (state, action) => ({
      ...state,
      uid: action.payload.uid
    }),
    SET_DISPLAY_NAME: (state, action) => ({
      ...state,
      displayName: action.payload.displayName
    }),
    SET_EMAIL: (state, action) => ({
      ...state,
      email: action.payload.email
    }),
    SET_CREATION_DATE: (state, action) => ({
      ...state,
      creationDate: action.payload.creationDate
    }),
    SET_DOB: (state, action) => ({
      ...state,
      dob: action.payload.dob
    }),
    SET_ADMIN: (state, action) => ({
      ...state,
      admin: action.payload.admin
    }),
    SET_VERIFIED: (state, action) => ({
      ...state,
      verified: action.payload.verified
    }),
    SET_SETTINGS: (state, action) => ({
      ...state,
      settings: action.payload.settings
    }),
    SET_RATED: (state, action) => ({
      ...state,
      rated: action.payload.rated
    }),
    SET_PLAYED: (state, action) => ({
      ...state,
      played: action.payload.played
    }),
    SET_FAVORITES: (state, action) => ({
      ...state,
      favorites: action.payload.favorites
    }),
    SET_LOADED: (state, action) => ({
      ...state,
      loaded: true
    }),
    UNLOAD: (state, action) => ({
      ...state,
      loaded: false
    })
  },
  {
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
    loaded: false
  }
)

export { userinfo as default }
