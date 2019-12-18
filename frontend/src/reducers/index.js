import ACCESS_TYPE from '../config/userAccessType'

const initState = {
  user: {
    access: ACCESS_TYPE.guest,
    name: undefined,
    loginError: false,
    registerError: {
      status: false,
      problemField: undefined
    }
  }
}

const rootReducer = (state = initState, action) => {
  switch (action.type) {
  case 'LOGIN':
    console.log(action);
    return {
      ...state,
      user: {
        ...state.user,
        access: action.access,
        name: action.username
      }
    }

    case 'REGISTER':
      console.log(action);
      return {
        ...state,
        user: {
          ...state.user,
          access: action.access,
          name: action.username
        }
      }

    case 'LOGIN_ERROR':
      return {
        ...state,
        user: {
          ...state.user,
          loginError: action.status
        }
      }

    case 'REGISTER_ERROR':
      return {
        ...state,
        user: {
          ...state.user,
          registerError: {
            status: action.status,
            problemField: action.problemField
          }
        }
      }
  }

  return state;
}

export default rootReducer;