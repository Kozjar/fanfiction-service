import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { connect } from 'react-redux';
import { login } from './actions/auth';

import Login from './components/login';
import Home from './components/home';
import Navbar from './components/navbar'

import { setCookie, getCookie } from './workingWithCookie'

class App extends Component {
  state = {
    loadingUser: true
  }

  componentDidMount() {
    
  }

  loadUser() {
    fetch('/api/users/login', {method: 'POST'})
    .then(res => {
      if (res.ok)
        return res.json();
      else 
        throw new Error(res);
    })
    .then(res => { 
      this.props.login(res.access, res.username);
      this.setState({loadingUser: false});
    })
    .catch(err => console.log(err));
  }

  setLanguage() {
    
  }

  render() {
    if (!this.state.loadingUser) {
      return ( 
        <>
          <Router>
            <Navbar />
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route exact path="/">
                <Home />
              </Route>
            </Switch>
          </Router>
        </>
      )
    }
    else return (<></>);
  }
}

const mapStateToProps = (state) => {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {
      login: (access, username) => dispatch(login(access, username))
  }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(App);