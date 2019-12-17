import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props);
        this.usernameInput = React.createRef();
    }

    state = { 
        username: '',
        password: '',
        newUser: false,
        wrongInput: false
    }
    
    handleUsernameChange(e) {
        this.setState({username: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    onSubmitForm(e) {
        e.preventDefault();
        let apiEnterMethod = this.state.newUser ? 'register' : 'login';
        fetch(`http://localhost:8000/api/users/${apiEnterMethod}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({username: this.state.username, password: this.state.password})
        })
        .then(res => {
            if (!res.ok)  throw new Error('401');
            return res.json();
        })
        .then(json => {
            this.props.setUser({username: json.username, color: json.color});
        })
        .catch(err => {
            console.log(err);
            this.usernameInput.current.focus();
            if (err.message === '401') {
                this.setState({
                    wrongInput: true,
                    username: '',
                    password: ''
                }, () => {
                    setTimeout(() => {
                        this.setState({wrongInput: false, newUser: true});
                    }, 3000);
                })
            }
        });
    }

    render() { 
        return ( 
            <div className='container'>
                {this.props.currentUser ? <Redirect to='/' /> : ''}
                <form className='mx-auto w-50' onSubmit={this.onSubmitForm.bind(this)}>
                    <nav className="nav nav-pills enter-type-nav">
                        <div className={`nav-item nav-link ${!this.state.newUser ? 'active' : ''}`}
                           onClick={() => {
                                this.setState({newUser: false});
                                this.usernameInput.current.focus();
                            }}>Login</div>
                        <div className={`nav-item nav-link ${this.state.newUser ? 'active' : ''}`}
                           onClick={() => {
                                this.setState({newUser: true});
                                this.usernameInput.current.focus();
                            }
                        }>Register</div>
                    </nav>

                    {
                        this.state.wrongInput &&
                        <p style={{color: 'red', justifyContent: 'flex'}}>Wrong username and password</p>
                    }

                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Username</label>
                        <input type="text" className="form-control" placeholder="Enter username"  value={this.state.username}
                               onChange={this.handleUsernameChange.bind(this)} autoFocus ref={this.usernameInput}></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type="password" className="form-control" placeholder="Password" value={this.state.password}
                               onChange={this.handlePasswordChange.bind(this)}></input>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
         );
    }
}
 
export default Login;