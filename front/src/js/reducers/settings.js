import { handleActions } from 'redux-actions'

const settings = handleActions(
  {
    TOGGLE_DARKMODE: (state, action) => {
      return {
        ...state,
        darkMode: action.payload.enabled
      }
    }
  },
  {
    darkMode: false
  }
)

export { settings as default }
