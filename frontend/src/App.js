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
import NovelChapter from './components/novelChapter';
import SearchPage from './components/searchPage'

import { setLanguage } from './actions/translation';

import { getCookie } from './workingWithCookie'

class App extends Component {
  state = {
    loadingUser: true
  }

  componentDidMount() {
    this.loadUser();
    const lang = getCookie('lang') || 'en';
    this.props.setLang(lang);
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
      this.props.login(res.username);
      this.setState({loadingUser: false});
    })
    .catch(err => console.log(`err!!! ${err}`));
  }

  setLanguage() {
    
  }

  render() {
    if (!this.state.loadingUser && this.props.genres) {
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
              <Route exact path="/novel/:id" component={Novel}>
              </Route>
              <Route exact path="/novel/:id/chapter/:chapterId" component={NovelChapter}></Route>
              <Route path="/editNovel/:novelId" component={EditNovel}></Route>
              <Route path="/editNovel/" component={EditNovel}></Route>
              <Route exact path='/search/:genre' component={SearchPage}></Route>
              <Route exact path='/search/user/:username' component={SearchPage}></Route>
            </Switch>
          </Router>
        </>
      )
    }
    else return (<>Loading...</>);
  }
}

const mapStateToProps = (state) => {
  return {
    genres: state.language.genres.val
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
      login: (access, username) => dispatch(login(access, username)),
      setLang: (lang) => dispatch(setLanguage(lang))
  }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(App);