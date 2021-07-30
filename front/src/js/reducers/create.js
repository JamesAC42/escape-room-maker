import { handleActions } from 'redux-actions'

const create = handleActions(
  {
    SET_ACTIVE_ROOM: (state, action) => {
      return {
        ...state,
        activeRoom: action.payload.activeRoom
      }
    },
    SET_MAP: (state, action) => {
      return {
        ...state,
        map: action.payload.map
      }
    },
    SET_GRAPH: (state, action) => {
      return {
        ...state,
        graph: action.payload.graph
      }
    }
  },
  {
    activeRoom: undefined,
    map: undefined,
    graph: undefined
  }
)

export { create as default }
