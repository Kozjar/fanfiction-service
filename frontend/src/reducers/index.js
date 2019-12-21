import { ACCESS_TYPE } from '../config/userAccessType'
import i18next from 'i18next'

const initState = {
  user: {
    access: ACCESS_TYPE.guest,
    name: undefined,
    loginError: false,
    registerError: {
      status: false,
      problemField: undefined
    }
  },
  i18n: i18next,
  lang: 'en'
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

  case 'SET_LANGUAGE':
    return {
      ...state,
      lang: action.lang
    }
    
  default:
    return {...state}
  }

  return state;
}

export default rootReducer;