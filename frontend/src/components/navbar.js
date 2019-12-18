import React, { Component } from 'react';
import {
  NavLink
} from "react-router-dom";
import { connect } from 'react-redux';

class Navbar extends Component {

    state = {
        location: window.location.pathname
    }

  logout() {
    // this.props.setUser(undefined);
  }

  render() { 
    const { username } = this.props;
    return ( 
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark" style={{marginBottom: '50px'}}>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <NavLink className={`nav-item nav-link`} 
                     to='/login' activeClassName="active"
                     onClick={this.logout.bind(this)}>
              {username ? 'Log out' : 'Login'}
            </NavLink>
            <NavLink className={`nav-item nav-link`} exact to='/' activeClassName="active"
                     onClick={() => this.setState({location: '/'})}>
              Home
            </NavLink>
          </div>
        </div>
      </nav>
      );
  }
}
 
const mapStateToProps = (state) => {
  return {
    username: state.user.name
  }
}

export default connect(mapStateToProps)(Navbar);