import React, { Component } from 'react';
import {
  Link
} from "react-router-dom";

class Navbar extends Component {

    state = {
        location: window.location.pathname
    }

  logout() {
    this.props.setUser(undefined);
    this.setState({location: '/login'});
  }

  render() { 
    const { currentUser } = this.props;
    return ( 
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark" style={{marginBottom: '50px'}}>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <Link className={`nav-item nav-link ${window.location.pathname === '/login' ? 'active' : ''}`} 
                  to='/login'
                  onClick={this.logout.bind(this)}>
              {currentUser ? 'Log out' : 'Login'}
            </Link>
            <Link className={`nav-item nav-link ${window.location.pathname === '/' ? 'active' : ''}`} to='/'
                  onClick={() => this.setState({location: '/'})}>
              Home
            </Link>
          </div>
        </div>
      </nav>
      );
  }
}
 
export default Navbar;