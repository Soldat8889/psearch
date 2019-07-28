import React          from 'react';
import { withRouter } from 'react-router-dom';
import axios          from 'axios';
// Components
import Loader from './../../../utils/Loader';
import Input  from './../../../utils/Input';

class LogIn extends React.Component {
	constructor(props) {
        super(props);

        this.state = {
            submitState: 'none',
            errorTarget: undefined
        }

        this.child = React.createRef();
        
        this.handleSubmit  = this.handleSubmit.bind(this);
        this.handleLoading = this.handleLoading.bind(this);
    }

    handleSubmit(e) {
        // Inputs
        let 
            usernameInput = document.getElementsByName('username')[0],
            passwordInput = document.getElementsByName('password')[0];

        let
            target = e.target;
        
        e.preventDefault();
        target.setAttribute('disabled', true);
        target.style.transition = "none";

        this.setState({
            submitState: 'loading'
        });

        new Promise(async (res, rej) => {
            // Verify all inputs, are they no errors (defined by regex / limits)?
            let 
                inputsChecking = document.querySelectorAll('.form-input'),
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
            // Catch all errors and apply color to inputs (which have errors)
            let checkFalse = new Promise(async (res, rej) => {
                let
                    authLabel = document.querySelectorAll('.form-label');

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
                // UX Timeout (just visual)
                setTimeout(() => {
                    // If there's at least one error
                    if(res == false) {
                        this.setState({
                            submitState: 'none'
                        });
                        target.removeAttribute('disabled');
                        target.style.transition = "";
                    } else {
                        console.log('FRONT END VERIFY => OK');

                        // Calling API
                        axios
                            .post(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/auth/user`, {
                                callType: 'login',
                                username: usernameInput.value,
                                password: passwordInput.value
                            })
                            .then(async res => {
                                let
                                    data = res.data;
                                
                                if(data === 'OK') {
                                    // We can submit if username & pw are okay and verified
                                    this.setState({
                                        submitState: 'submit'
                                    });
                                    target.removeAttribute('disabled');
                                    target.style.transition = "";
                                    console.log('CALL API VERIFY => OK');
                                    console.log('SUBMIT');

                                    document.forms['login'].submit();
                                } else {
                                    // Display errors
                                    await this.child.current.displayMessage(data.errorTarget, 'error', data.error);

                                    this.setState({
                                        submitState: 'none',
                                        errorTarget: data.errorTarget
                                    });
                                    target.removeAttribute('disabled');
                                    target.style.transition = "";
                                    console.log('CALL API VERIFY => OK');
                                    console.log(data.error);
                                }
                            })
                            .catch(e => {
                                window.CONF.env == "development" ? console.warn(`DEVELOPMENT MODE => ${e}`) : null;
                            });
                    }
                }, 566); // One animation step timing
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
        let inputSubmit = document.getElementById('form-submit');

        inputSubmit.addEventListener('click', (e) => {
            this.handleSubmit(e);
        }, false);
    }

    componentWillUnmount() {
        let inputSubmit = document.getElementById('form-submit');

        inputSubmit.removeEventListener('click', this.handleSubmit, false);
    }
    
	render() {
		return (
			<div className="form-wrapper">
				<header className="form-header inline-vh">
					<div className="form-header_banner"></div>
					<h1 className="form-header_title">
						LOGIN <br />
						Welcome back!
					</h1>
				</header>
				<fieldset className="form-inner">
                    <Input 
                        form="login"
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
                        ref={this.child}
                        apiErrorTarget={this.state.errorTarget}
                    />
                    <Input 
                        form="login"
                        title="Password" 
                        name="password"
                        type="password"
                        minLength={8}
                        maxLength={256}
                        rule={{
                            type: "Regex",
                            content: /(.*)*/gi
                        }}
                        ref={this.child}
                        apiErrorTarget={this.state.errorTarget}
                        pwViewer={true}
                    />
                    <div className="form-group">
                        <label htmlFor="remember_me">Remember Me</label>
                        <input type="checkbox" name="remember_me" id="remember_me" />
                    </div>
					<div className="form-group">
                        <button 
                            type="submit" 
                            id="form-submit" 
                            className="form-submit" 
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

export default withRouter(LogIn);