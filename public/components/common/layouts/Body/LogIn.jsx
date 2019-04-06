import React, { Component } from 'react';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';

class LogIn extends React.Component {
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
					<div className="auth-group">
						<label className="auth-label" data-state="none">
							Username
						</label>
						<input type="text" name="username" className="auth-input" />
					</div>
					<div className="auth-group">
						<label className="auth-label" data-state="none">
							Password
						</label>
						<input type="password" name="password" className="auth-input" />
					</div>
					<div className="auth-group inline-vh">
						<input type="submit" value="LOG IN" className="auth-submit" />
					</div>
				</fieldset>
			</div>
		);
	}
}

export default LogIn;