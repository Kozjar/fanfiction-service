import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Login from './components/login';
import Home from './components/home';
import Navbar from './components/navbar'

class App extends Component {

  state = {
    currentUser: undefined
  }

  setUser(user) {
    this.setState({currentUser: user});
  }

  render() { 
    
    return ( 
      <>
        <Router>
          <Navbar currentUser={this.state.currentUser}
                  setUser={this.setUser.bind(this)} />
          <Switch>
            <Route path="/login">
              <Login currentUser={this.state.currentUser} 
                     setUser={this.setUser.bind(this)} />
            </Route>
            <Route exact path="/">
              <Home currentUser={this.state.currentUser} />
            </Route>
          </Switch>
        </Router>
      </>
     );
  }
}
 
export default App;