import ACCESS_TYPE from '../config/userAccessType'

const initState = {
    userStatus: ACCESS_TYPE.guest,
    user: undefined
}

const rootReducer = (state = initState, action) => {
    return state;
}

export default rootReducer;