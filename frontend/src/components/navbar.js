import React, { Component } from 'react';
import {
  NavLink, Link
} from "react-router-dom";
import { LinkContainer } from 'react-router-bootstrap'
import { connect } from 'react-redux';

import '../styles/navbar.css';
import { logoutAsync } from '../actions/auth';
import { setLanguage } from '../actions/translation';

import Dropdown from "react-bootstrap/Dropdown";

class Navbar extends Component {

    state = {
        location: window.location.pathname,
        langDropdownOpen: false,
        profileDropdownOpen: false
    }

  logout() {
    this.props.logout();
  }

  setLang(lang) {
    if (lang !== this.props.lang)
      this.props.setLang(lang);
  }

  render() {
    return ( 
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark" style={{marginBottom: '50px'}}>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav mr-auto">
            <NavLink className={`navbar-brand nav-link`} exact to='/' activeClassName="active"
                     onClick={() => this.setState({location: '/'})}>
              {this.props.i18n.t('navbar.Home')}
            </NavLink>
          </div>

          <Dropdown alignRight
            onMouseOver={() => this.setState({langDropdownOpen: true})}
            onMouseLeave={() => this.setState({langDropdownOpen: false})}
            show={this.state.langDropdownOpen}
            onToggle={() => this.setState({langDropdownOpen: false})}
            onSelect={() => this.setState({langDropdownOpen: false})}>
            <Dropdown.Toggle>
              {this.props.i18n.t('navbar.Language')}: {this.props.lang}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as="button" onClick={this.setLang.bind(this, 'en')}>
                English
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={this.setLang.bind(this, 'ru')}>
                Русский
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>


          {this.props.username ? (
            <Dropdown alignRight
                onMouseOver={() => this.setState({profileDropdownOpen: true})}
                onMouseLeave={() => this.setState({profileDropdownOpen: false})}
                show={this.state.profileDropdownOpen}
                onToggle={() => this.setState({profileDropdownOpen: false})}
                onSelect={() => this.setState({profileDropdownOpen: false})}>
              <Dropdown.Toggle>
                {this.props.username}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <LinkContainer to={`/search/user/${this.props.username}`}>
                  <Dropdown.Item>
                  View my novels
                  </Dropdown.Item>
                </LinkContainer>

                <LinkContainer to='/editNovel/'>
                  <Dropdown.Item>
                  {this.props.i18n.t('navbar.Create_novel')}
                  </Dropdown.Item>
                </LinkContainer>

                <Dropdown.Divider></Dropdown.Divider>

                <LinkContainer to="/login">
                  <Dropdown.Item onClick={this.logout.bind(this)}>
                    {this.props.i18n.t('navbar.Log_out')}
                  </Dropdown.Item>
                </LinkContainer>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Link className={`nav-item login__btn`} to='/login'>{this.props.i18n.t('navbar.Login')}</Link>
          )}
        </div>
      </nav>
      );
  }
}
 
const mapStateToProps = (state) => {
  return {
    username: state.user.name,
    lang: state.language.lang,
    i18n: state.language.i18n
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logoutAsync()),
    setLang: (lang) => dispatch(setLanguage(lang))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);