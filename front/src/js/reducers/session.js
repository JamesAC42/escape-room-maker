import { handleActions } from 'redux-actions';

const session = handleActions(
    {
        LOGIN: (state, action) => ({
            ...state,
            loggedin: true
        }),
        LOGOUT: (state, action) => ({
            ...state,
            loggedin: false
        })
    },
    {
        loggedin: undefined
    }
)

export { session as default }