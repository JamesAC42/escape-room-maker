import React, { Component } from 'react';
import maze from '../../../images/maze.png';
import '../../../css/login.scss';

import { LoginState } from './LoginState';

class Login extends Component {
    state;
    constructor(props) {
        super(props);
        this.state = new LoginState();
    }
    toggleMode() {
        this.setState({
            mode: this.state.mode ? 0 : 1
        });
    }
    updateLoginValues(e) {
        this.setState({
            ...this.state,
            login: {
                ...this.state.login,
                [e.target.name] : e.target.value
            }
        });
    }
    updateRegisterValues(e) {
        this.setState({
            ...this.state,
            register: {
                ...this.state.register,
                [e.target.name] : e.target.value
            }
        });
    }
    submit() {
        console.log(this.state.login);
        console.log(this.state.register);
    }
    render() {
        return(
            <div className="login-outer">
                <div className="maze-image center-child">
                    <img src={maze} alt="maze"/>
                </div>
                <div className="form-input-outer center-child">
                <div className="form-input-inner flex-col">
                    <div 
                        className="toggle-mode"
                        onClick={() => this.toggleMode()}>
                        { this.state.mode ? "Register" : "Login" }
                    </div>
                    <div className="login-header">
                        { this.state.mode ? "Login" : "Register" }
                    </div>
                    { 
                        this.state.mode ? 
                        <form>
                            <div className="input-item">
                                <label htmlFor="email">
                                    Email
                                </label>
                                <input 
                                    type="text" 
                                    name="email"
                                    placeholder="Email"
                                    value={this.state.login.email}
                                    onChange={(e) => this.updateLoginValues(e)}/>
                            </div>
                            <div className="input-item">
                                <label htmlFor="password">
                                    Password
                                </label>
                                <input 
                                    type="password" 
                                    name="password"
                                    placeholder="Password"
                                    value={this.state.login.password}
                                    onChange={(e) => this.updateLoginValues(e)}/>
                            </div>
                        </form>
                        :
                        <form>
                             <div className="input-item">
                                <label htmlFor="email">
                                    Email
                                </label>
                                <input 
                                    type="text" 
                                    name="email"
                                    placeholder="Email"
                                    value={this.state.register.email}
                                    onChange={(e) => this.updateRegisterValues(e)}/>
                            </div>
                            <div className="input-item">
                                <label htmlFor="username">
                                    Username
                                </label>
                                <input 
                                    type="text" 
                                    name="username"
                                    placeholder="Username"
                                    value={this.state.register.username}
                                    onChange={(e) => this.updateRegisterValues(e)}/>
                            </div>
                            <div className="input-item">
                                <label htmlFor="password">
                                    Password
                                </label>
                                <input 
                                    type="password" 
                                    name="password"
                                    placeholder="Password"
                                    value={this.state.register.password}
                                    onChange={(e) => this.updateRegisterValues(e)}/>
                            </div>
                            <div className="input-item">
                                <label htmlFor="passwordConfirm">
                                    Confirm Password
                                </label>
                                <input 
                                    type="password" 
                                    name="passwordConfirm"
                                    placeholder="Confirm Password"
                                    value={this.state.register.passwordConfirm}
                                    onChange={(e) => this.updateRegisterValues(e)}/>
                            </div>
                        </form>
                    }
                    
                    <div className="submit-login">
                        <div 
                            className="submit-button"
                            onClick={() => this.submit()}>
                            {this.state.mode ? "Login" : "Register"}
                        </div>
                    </div>
                </div>
                </div>
            </div>
        )
    }

}

export default Login;