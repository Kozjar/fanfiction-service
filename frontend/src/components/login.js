import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { loginAsync, registerAsync, loginError, registerError } from '../actions/auth';

class Login extends Component {
    constructor(props) {
        super(props);
        this.emailInput = React.createRef();
    }

    state = { 
        email: '',
        username: '',
        password: '',
        newUser: false,
        wrongLoginPair: false,
        wrongRegField: ''
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.props.user.loginError) {
        this.emailInput.current.focus();
        this.setState({
            email: '',
            username: '',
            password: '',
            wrongLoginPair: true
        });
        this.props.solveLoginError();
      }
      if (this.props.user.registerError.status) {
        this.emailInput.current.focus();
        this.setState({
            email: '',
            username: '',
            password: '',
            wrongRegField: this.props.user.registerError.problemField
        });
        this.props.solveRegisterError();
      }
    }

    handleEmailChange(e) {
        this.setState({email: e.target.value});
    }
    
    handleUsernameChange(e) {
        this.setState({username: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    onSubmitForm(e) {
        e.preventDefault();
        if (this.state.newUser) {
          this.props.register(this.state.email, this.state.username, this.state.password);
        }
        else {
          this.props.login(this.state.email, this.state.password);
        }
    }

    render() {
      if (this.props.user.name) {
        return <Redirect to="/" />
      }
        return ( 
            <div className='container'>
                {this.props.currentUser ? <Redirect to='/' /> : ''}
                <form className='mx-auto w-50' onSubmit={this.onSubmitForm.bind(this)}>
                    <nav className="nav nav-pills enter-type-nav">
                        <div className={`nav-item nav-link ${!this.state.newUser ? 'active' : ''}`}
                           onClick={() => {
                                this.setState({newUser: false, wrongRegField: ''});
                                this.emailInput.current.focus();
                            }}>Login</div>
                        <div className={`nav-item nav-link ${this.state.newUser ? 'active' : ''}`}
                           onClick={() => {
                                this.setState({newUser: true, wrongLoginPair: false});
                                this.emailInput.current.focus();
                            }
                        }>Register</div>
                    </nav>

                    {
                        this.state.wrongLoginPair &&
                        <p style={{color: 'red', justifyContent: 'flex'}}>Wrong email-password pair</p>
                    }
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Email</label>
                        <input type="email" className="form-control" placeholder="Enter email" required
                               aria-describedby="emailHelp" value={this.state.email}
                               onChange={this.handleEmailChange.bind(this)} autoFocus ref={this.emailInput}></input>
                    </div>
                    {
                        this.state.newUser &&
                        <div className="form-group">
                            <label htmlFor="exampleInputUsername">Username</label>
                            <input type="text" className="form-control" placeholder="Enter username"  value={this.state.username}
                                required onChange={this.handleUsernameChange.bind(this)}></input>
                        </div>
                    }
                    
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type="password" className="form-control" placeholder="Password" value={this.state.password}
                               required onChange={this.handlePasswordChange.bind(this)}></input>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
         );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (email, password) => dispatch(loginAsync(email, password)),
        register: (email, username, password) => dispatch(registerAsync(email, username, password)),
        solveLoginError: () => dispatch(loginError(false)),
        solveRegisterError: () => dispatch(registerError(false))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);