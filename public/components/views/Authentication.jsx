import React, { Component } from 'react';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';

class Authentication extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			appJS: null,
			contextID: null
		}

		this.renderingContext = this.renderingContext.bind(this);
	}

	componentDidMount(props) {		
		const getHash = () => {
			let
				signup = window.location.hash === '#/signup',
				login = window.location.hash === '#/login';

			switch (true) {
				case signup:
					this.setState({
						contextID: 'signup'
					})
					break;
				case login:
					this.setState({
						contextID: 'login'
					})
					break;
				default:
					this.setState({
						contextID: 'choose'
					})
					break;
			}
		}

		window.addEventListener('hashchange', getHash, false);
		getHash();
	}

	componentWillMount() {
		new Promise((res, rej) => {
			if(window.CONF.env === 'development') {
				this.setState({
					appJS: '/assets/dist/app.js'
				});

				res('/assets/dist/app.js');
			} else {
				this.setState({
					appJS: JSON.parse(this.props.manifest)['app.js']
				});

				res(JSON.parse(this.props.manifest)['app.js']);
			}
		})
		.then((val) => {
			let
				script = document.createElement('script');
				
			script.setAttribute('type', 'application/javascript');
			script.setAttribute('src', val);

			document.body.appendChild(script);
		});
	}

	componentWillUnmount() {
		document.body.removeChild(document.querySelector(`script[src="${this.state.appJS}"]`));
	}

	renderingContext() {
		switch (this.state.contextID) {
			case 'signup':
				return (<SingUp />);
				break;
			case 'login':
				return (<LogIn />);
				break;
			default:
				return (<Choose />);
				break;
		}
	}

	render() {
		return (
			<section className="page-content">
				<div id="packed" className="packed"></div>
				<section id="context" className="page-part-wrapper" data-context-id={this.state.contextID}>
					<div className="background-overlay chrome-test overlay--portal"></div>
					{this.renderingContext()}
				</section>
			</section>
		);
	}
}

class Choose extends React.Component {
	render() {
		return (
			<div className="page-part-content">
				<a href="/authentication/#/signup" className="me-text">
					SIGN UP
				</a>
				<a href="/authentication/#/login" className="me-text">
					LOG IN
				</a>
			</div>
		);
	}
}

class SingUp extends React.Component {
	render() {
		return (
			<div className="page-part-content">
				<h1>I chose Sing Up</h1>
			</div>
		);
	}
}

class LogIn extends React.Component {
	render() {
		return (
			<div className="page-part-content">
				<h1>I chose Log In</h1>
				<form action="/authentication/#/login" method="post">
					<div>
						<label>Username:</label>
						<input type="text" name="username" />
						<br/>
					</div>
					<div>
						<label>Password:</label>
						<input type="password" name="password" />
					</div>
					<div>
						<input type="submit" value="Submit" />
					</div>
				</form>
			</div>
		);
	}
}

export default Authentication;