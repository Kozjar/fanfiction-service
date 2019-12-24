const initState = {
  name: undefined,
  loginError: false,
  registerError: {
    status: false,
    problemField: undefined
  }
}

const user = (state = initState, action) => {
  switch (action.type) {
    case 'LOGIN':
      console.log(action);
      return {
        ...state,
        name: action.username
      }
  
    case 'REGISTER':
      console.log(action);
      return {
        ...state,
        name: action.username
      }
  
    case 'LOGIN_ERROR':
      return {
        ...state,
        loginError: action.status
      }
  
    case 'REGISTER_ERROR':
      return {
        ...state,
        registerError: {
          status: action.status,
          problemField: action.problemField
        }
      }

    default:
      return {...state}
  }
}

export default user;