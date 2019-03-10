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
					<div className="page-part-content">
						<div className="container all-page-size inline-vh">
							{this.renderingContent(this.props.type)}
						</div>
					</div>
				</section>
			</section>
		);
	}
}

class SignUp extends React.Component {
	render() {
		return (
			<form action="/signup" method="POST" className="auth-form">
				<div className="auth-header">
					<h1 className="auth-title">Sign up</h1>
					<Link to="/">
						<i className="fa fa-3x"></i>
					</Link>
				</div>
				<fieldset className="form-inner">
					<div>
						<label>Username:</label>
						<input type="text" name="username" className="auth-input" />
					</div>
					<div>
						<label>Email:</label>
						<input type="email" name="email" className="auth-input" />
					</div>
					<div>
						<label>Password:</label>
						<input type="password" name="password" className="auth-input" />
					</div>
					<div>
						<label>Bio:</label>
						<input type="text" name="bio" className="auth-input" />
					</div>
					<div>
						<input type="submit" value="Submit" />
					</div>
				</fieldset>
				<div className="inline-vh" style={{flexDirection: "row"}}>
					<i className="fa fa-3x" style={{marginRight: "10px"}}></i>
					<Link to="/login" className="button auth-submit">
						I've already an account
					</Link>
				</div>
			</form>
		);
	}
}

class LogIn extends React.Component {
	render() {
		return (
			<form action="/login" method="POST" className="auth-form">
				<div className="auth-header">
					<h1 className="auth-title">Login</h1>
					<Link to="/">
						<i className="fa fa-3x"></i>
					</Link>
				</div>
				<fieldset className="form-inner">
					<div>
						<label>Username:</label>
						<input type="text" name="username" className="auth-input" />
					</div>
					<div>
						<label>Password:</label>
						<input type="password" name="password" className="auth-input" />
					</div>
					<div>
						<input type="submit" value="Submit" />
					</div>
				</fieldset>
				<div className="inline-vh" style={{flexDirection: "row"}}>
					<i className="fa fa-3x" style={{marginRight: "10px"}}></i>
					<Link to="/signup" className="button auth-submit">
						I don't have account
					</Link>
				</div>
			</form>
		);
	}
}

export default Authentication;