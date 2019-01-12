import React, { Component } from 'react';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';

class Authentication extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			appJS: null
		}

		this.renderingContent = this.renderingContent.bind(this);
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

	renderingContent(type) {
		switch(type) {
			case 'signup':
				return <SignUp />
				break;
			case 'login':
				return <LogIn />
				break;
		}
	}

	render() {
		return (
			<section className="page-content">
				<div id="packed" className="packed"></div>
				<section id="context" className="page-part-wrapper" data-context-id={this.state.contextID}>
					<div className="background-overlay chrome-test overlay--portal"></div>
					{this.renderingContent(this.props.type)}
				</section>
			</section>
		);
	}
}

class SignUp extends React.Component {
	render() {
		return (
			<div className="page-part-content">
				<h1>Sign up</h1>
				<form action="/signup" method="POST">
					<div>
						<label>Username:</label>
						<input type="text" name="username" />
						<br/>
					</div>
					<div>
						<label>Email:</label>
						<input type="email" name="email" />
					</div>
					<div>
						<label>Password:</label>
						<input type="password" name="password" />
					</div>
					<div>
						<label>Bio:</label>
						<input type="text" name="bio" />
					</div>
					<div>
						<input type="submit" value="Submit" />
					</div>
				</form>
			</div>
		);
	}
}

class LogIn extends React.Component {
	render() {
		return (
			<div className="page-part-content">
				<h1>I chose Log In</h1>
				<form action="/login" method="POST">
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