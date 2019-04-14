import React, { Component }                             from 'react';
import PropTypes                                        from 'prop-types';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';
// Components
import Loader from './../../../utils/Loader';

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
                    }
                }, 80000);
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
                        maxLength={48}
                        rule={{
                            type: "Regex",
                            content: /([a-z0-9])*/gi
                        }}
                    />
                    <Input 
                        title="Email" 
                        name="email"
                        type="email"
                        minLength={3}
                        maxLength={254}
                        rule={{
                            type: "Regex",
                            content: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi
                        }}
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

class Input extends Component {
    /*
     * @minLength { number }: Equal OR Greater, accepted
     * @maxLength { number }: Equal OR Less, accepted
    */

    static defaultProps = {
        title: 'Default title',
        name: 'default-title',
        minLength: 6,
        maxLength: 52
    }

    static propTypes = {
        title: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        minLength: PropTypes.number.isRequired,
        maxLength: PropTypes.number.isRequired,
        rule: PropTypes.shape({
            type: PropTypes.string,
            content: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.instanceOf(RegExp),
                PropTypes.instanceOf(Element),
            ]),
        }).isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            currentLabel: null,
            currentInput: null,
            handleError : false,
            ruleType    : "",
            ruleContent : null,
            isAvailable : false
        }

        this.checkInput = this.checkInput.bind(this);
        this.handleBlur  = this.handleBlur.bind(this);
    }

    componentDidMount() {
        this.setState({
            currentLabel: document.querySelector(`[data-reference="${this.props.name}"]`),
            currentInput: document.getElementsByName(this.props.name)[0],
            ruleType    : this.props.rule.type,
            ruleContent : this.props.rule.content
        });
    }

    componentWillUnmount() {
        document.removeEventListener("keyup", this.checkInput, false);
        document.removeEventListener("blur", this.handleBlur, false);
    }

    checkInput() {
        let
            negativeColor = "#B22222";

        if(this.state.currentInput.value.length < this.props.minLength || this.state.currentInput.value.length > this.props.maxLength) {
            this.setState({
                handleError: true,
                isAvailable: false
            });
            this.state.currentLabel.style.color = negativeColor;
        } else {
            switch(this.state.ruleType) {
                case 'Regex':
                    if(this.state.ruleContent.test(this.state.currentInput.value) === true) {
                        this.setState({
                            handleError: false,
                            isAvailable: true
                        });
                        this.state.currentLabel.style.color = "";
                    } else if(this.state.ruleContent.test(this.state.currentInput.value) === false) {
                        this.setState({
                            handleError: true,
                            isAvailable: false
                        });
                        this.state.currentLabel.style.color = negativeColor;
                    }
                    break;
                case 'Match':
                    if(document.getElementsByName(this.state.ruleContent)[0].value != this.state.currentInput.value) {
                        this.setState({
                            handleError: true,
                            isAvailable: false
                        });
                        this.state.currentLabel.style.color = negativeColor;
                    } else {
                        this.setState({
                            handleError: false,
                            isAvailable: true
                        });
                        this.state.currentLabel.style.color = "";
                    }
                    break;
                default:
                    window.CONF.env == 'development' ? console.warn('Any rule ?') : false;
                    break;
            }
        }
    }

    handleBlur() {
        this.checkInput();
        
        if(this.state.currentInput.value == "") {
            this.setState({
                handleError: false,
                isAvailable: false
            });
            this.state.currentLabel.style.color = "";
        }
    }

    render() {
        return (
            <div className="auth-group">
                <label 
                    className="auth-label" 
                    data-reference={this.props.name}
                    data-state="none"
                    data-error={this.state.handleError}
                >
                    {this.props.title}
                </label>
                <input 
                    type={this.props.type} 
                    name={this.props.name} 
                    className="auth-input" 
                    data-available={this.state.isAvailable}
                    onKeyUp={this.checkInput} 
                    onBlur={this.handleBlur}
                />
                {this.props.children ? <div className="auth-input_box">{this.props.children}</div> : false}
            </div>
        );
    }
}

export default SignUp;