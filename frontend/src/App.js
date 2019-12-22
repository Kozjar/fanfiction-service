import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import { connect } from 'react-redux'
import { login } from './actions/auth'

import Login from './components/login'
import Home from './components/home'
import Navbar from './components/navbar'
import Novel from "./components/novel";
import EditNovel from './components/editNovel';

import { setLanguage } from './actions/translation';

import { getCookie } from './workingWithCookie'

class App extends Component {
  state = {
    loadingUser: true
  }

  componentDidMount() {
    this.loadUser();
  }

  loadUser() {
    fetch('/api/users/login')
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
    const lang = getCookie('lang') || 'en';
    this.props.setLang(lang);
    if (!this.state.loadingUser) {
      return ( 
        <>
          <Router>
            <Navbar />
            <Switch>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/novel">
                <Novel />
              </Route>
              <Route path="/editNovel">
                <EditNovel />
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
      login: (access, username) => dispatch(login(access, username)),
      setLang: (lang) => dispatch(setLanguage(lang))
  }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(App);