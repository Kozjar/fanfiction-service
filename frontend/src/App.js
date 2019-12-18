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

// const history = createBrowserHistory();

class App extends Component {

  render() { 
    
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
     );
  }
}
 
export default App;