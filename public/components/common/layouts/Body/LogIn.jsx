import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
// Components
import Loader from './../../../utils/Loader';
import Input  from './../../../utils/Input';

class LogIn extends React.Component {
	constructor(props) {
        super(props);

        this.state = {
            submitState: 'none'
        }
        
        this.handleClick   = this.handleClick.bind(this);
        this.handleSubmit  = this.handleSubmit.bind(this);
        this.handleLoading = this.handleLoading.bind(this);
    }

    handleClick(e) {
        let
            passwordViewer      = document.getElementById('view-password'),
            passwordInput       = document.getElementsByName('password')[0];

        e.preventDefault();

        if(passwordViewer.getAttribute('data-state') == 'hidden') {
            passwordViewer.innerHTML = "";
            passwordViewer.setAttribute('data-state', 'visible');
            
            passwordInput.setAttribute('type', 'text');
        } else {
            passwordViewer.innerHTML = "";
            passwordViewer.setAttribute('data-state', 'hidden');
            
            passwordInput.setAttribute('type', 'password');
        }
    }

    handleSubmit(e) {
        let
            target = e.target;
        
        e.preventDefault();
        target.style.transition = "none";

        this.setState({
            submitState: 'loading'
        });

        new Promise(async (res, rej) => {
            let 
                inputsChecking = document.querySelectorAll('.auth-input'),
                checkingList = [];

            let checkingListPush = new Promise(async (res, rej) => {
                Array.prototype.forEach.call(inputsChecking, inputChecking => {
                    let
                        inputCheckingAttribute = inputChecking.getAttribute('data-available');
    
                    checkingList.push(inputCheckingAttribute);
                });
    
                res(checkingList);
            })
            .catch((e) => {
                window.CONF.env == 'development' ? console.error('DEVELOPMENT => ' + e) : false;
            });
        
            res(await checkingListPush);
        })
        .then(async (response) => {
            let checkFalse = new Promise(async (res, rej) => {
                let
                    authLabel = document.querySelectorAll('.auth-label');

                for(let i = 0, j = response.length; i < j; i++) {
                    if(response[i] == 'false') {
                        authLabel[i].style.color = '#B22222';
                        res(false);
                    }
                }
                res(true);
            });

            new Promise(async (res, rej) => {
                res(await checkFalse);
            })
            .then(async (res) => {
                setTimeout(() => {
                    if(res == false) {
                        target.style.transition = "";
                        
                        this.setState({
                            submitState: 'none'
                        });
                    } else {
                        console.log('FRONT END VERIFY => OK');
                        target.style.transition = "";

                        this.setState({
                            submitState: 'submit'
                        });

                        document.forms['login'].submit();
                    }
                }, 566);
            });
        })
        .catch((e) => {
            window.CONF.env == 'development' ? console.error('DEVELOPMENT => ' + e) : false;
        });
    }

    handleLoading() {
        if(this.state.submitState == "loading") {
            return (
                <Loader style={{position: 'absolute'}} styleContent={{transform: 'scale(0.6) translateY(8px)'}} />
            );
        } else {
            return (
                "SIGN UP"
            );
        }
	}
	
	componentDidMount() {
        let
            passwordViewer = document.getElementById('view-password'),
            inputSubmit    = document.getElementById('auth-submit');

        passwordViewer.addEventListener('click', (e) => {
            this.handleClick(e);
        }, false);
        inputSubmit.addEventListener('click', (e) => {
            this.handleSubmit(e);
        }, false);
    }

    componentWillUnmount() {
        let
            passwordViewer = document.getElementById('view-password'),
            inputSubmit    = document.getElementById('auth-submit');

        passwordViewer.removeEventListener('click', this.handleClick, false);
        inputSubmit.removeEventListener('click', this.handleSubmit, false);
    }

	render() {
		return (
			<div className="auth-wrapper">
				<header className="auth-header inline-vh">
					<div className="auth-header_banner"></div>
					<h1 className="auth-header_title">
						LOGIN <br />
						Welcome back!
					</h1>
				</header>
				<fieldset className="auth-inner">
					<Input 
                        title="Username" 
                        name="username"
                        type="text"
                        minLength={6}
                        maxLength={45}
                        rule={{
                            type: "Regex",
                            content: /([a-z0-9])*/gi
                        }}
                        value={window.CONF.params.username !== undefined ? window.CONF.params.username : ""}
                    />
                    <Input 
                        title="Password" 
                        name="password"
                        type="password"
                        minLength={8}
                        maxLength={256}
                        rule={{
                            type: "Regex",
                            content: /(.*)*/gi
                        }}
                        children={<button id="view-password" className="far fa-2x" data-state="hidden"></button>}
                    />
					<div className="auth-group inline-vh">
                        <button 
                            type="submit" 
                            id="auth-submit" 
                            className="auth-submit" 
                            data-state={this.state.submitState}
                        >
                            {this.handleLoading()}
                        </button>
						<input type="checkbox" name="remember_me" />
					</div>
				</fieldset>
			</div>
		);
	}
}

export default withRouter(LogIn);