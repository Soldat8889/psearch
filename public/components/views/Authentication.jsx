import React, { Component } from 'react';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';

class Authentication extends React.Component {
	constructor(props) {
		super(props);

		this.renderingContent = this.renderingContent.bind(this);
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
				<section id="context" className="page-part-wrapper">
					<div className="background-overlay webp-test overlay--portal"></div>
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