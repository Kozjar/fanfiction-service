import { ACCESS_TYPE } from '../config/userAccessType';

export const login = (access, username) => {
  return {
    type: 'LOGIN', 
    access, 
    username
  }
}

export const loginError = (status) => {
  return {
    type: 'LOGIN_ERROR',
    status
  }
}

export const loginAsync = (email, password) => {
    return (dispatch, getState) => {
        fetch(`/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({email: email, password: password})
        })
        .then(res => {
            if (!res.ok)  throw new Error(res.statusText);
            return res.json();
        })
        .then(json => {
            dispatch(login(json.access, json.username));
            return Promise.resolve();
        })
        .catch(err => {
          console.log(`catch error in login action: ${err}`);
          dispatch(loginError(true));
          return Promise.reject();
        }) 
    }
}

export const registerError = (status, problemField) => {
  return {
    type: 'REGISTER_ERROR',
    status,
    problemField
  }
}

export const registerAsync = (email, username, password) => {
  return (dispatch, getState) => {
    fetch(`/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        email,
        username, 
        password
      })
    })
    .then(res => {
      return Promise.all([res.status, res.json()]);
    })
    .then(([status, json]) => {
      if (status === 400) throw new Error(json.problemField);
      dispatch(login(json.access, json.username));
    })
    .catch(err => {
      registerError(true, err);
    })
  }
}

export const logoutAsync = () => {
  return (dispatch, getState) => {
    fetch(`/api/users/logout`, {
      method: 'DELETE',
    })
    .then(res => Promise.all([res.ok, res.text()]))
    .then(([ok, json]) => {
      if (!ok) throw new Error('somthing goes wrong!!!');
      dispatch(login(ACCESS_TYPE.guest, undefined));
    })
  }
}