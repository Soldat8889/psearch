import React, { Component }                             from 'react';
import PropTypes                                        from 'prop-types';
import { withRouter } from 'react-router-dom';

// Components
import Loader from './../../../utils/Loader';
import Input  from './../../../utils/Input';

class SignUp extends React.Component {
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
            passwordInput       = document.getElementsByName('password')[0],
            passwordRepeatInput = document.getElementsByName('r-password')[0];

        e.preventDefault();

        if(passwordViewer.getAttribute('data-state') == 'hidden') {
            passwordViewer.innerHTML = "";
            passwordViewer.setAttribute('data-state', 'visible');
            
            passwordInput.setAttribute('type', 'text');
            passwordRepeatInput.setAttribute('type', 'text');
        } else {
            passwordViewer.innerHTML = "";
            passwordViewer.setAttribute('data-state', 'hidden');
            
            passwordInput.setAttribute('type', 'password');
            passwordRepeatInput.setAttribute('type', 'password');
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

                        document.forms['signup'].submit();
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
						SIGN UP<br />
						Hi! Who are you?
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
                        title="Email" 
                        name="email"
                        type="email"
                        minLength={3}
                        maxLength={254}
                        rule={{
                            type: "Regex",
                            content: /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i
                        }}
                        value={window.CONF.params.email !== undefined ? window.CONF.params.email : ""}
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
                    <Input 
                        title="Repeat Password" 
                        name="r-password"
                        type="password"
                        minLength={8}
                        maxLength={256}
                        rule={{
                            type: "Match",
                            content: "password"
                        }}
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
					</div>
				</fieldset>
			</div>
		);
	}
}

export default withRouter(SignUp);