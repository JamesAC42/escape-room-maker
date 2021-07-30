import { handleActions } from 'redux-actions'

const eventWindow = handleActions(
  {
    SET_ROOM_VALS: (state, action) => {
      return {
        ...state,
        roomVals: action.payload.roomVals
      }
    }
  },
  {
    roomVals: undefined
  }
)

export { eventWindow as default }
