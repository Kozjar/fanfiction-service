import React, { Component } from 'react';
import {
  NavLink, Link
} from "react-router-dom";
import { connect } from 'react-redux';

import '../styles/navbar.css';

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
          <div className="navbar-nav mr-auto">
            <NavLink className={`navbar-brand nav-link`} exact to='/' activeClassName="active"
                     onClick={() => this.setState({location: '/'})}>
              Home
            </NavLink>

          </div>
            {this.props.username ? (
              <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="navbarDropdown" 
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {this.props.username ? this.props.username : 'Guest'}
                </button>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href="#">Create novel</a>
                  <Link className="dropdown-item" to='/login'
                        onClick={this.logout.bind(this)}>Log out</Link>
                </div>
              </div>
            ) : (
              <Link className={`nav-item login__btn`} to='/login'>Login</Link>
            )}
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