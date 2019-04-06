import React, { Component } from 'react';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';
// Components
import SignUp from './../common/layouts/Body/SignUp';
import LogIn from './../common/layouts/Body/LogIn';

class Authentication extends React.Component {
	constructor(props) {
		super(props);

		this.renderAdaptativeTab = this.renderAdaptativeTab.bind(this);
		this.renderAdaptativeAccessibility = this.renderAdaptativeAccessibility.bind(this);
	}

	renderAdaptativeTab(type) {
		switch(type) {
			case 'signup':
				return <SignUp />
				break;
			case 'login':
				return <LogIn />
				break;
		}
	}

	renderAdaptativeAccessibility(type) {
		if(type === "signup") {
			return (
				<div className="auth-footer inline-vh">
					<div className="auth-footer_external-account inline-vh">
						<button className="button material-button auth-footer_external-account_buttons account_google">
							<span className="auth-footer_external-account_icon account_google"></span>
							<span className="auth-footer_external-account_label account_google">SIGN UP WITH GOOGLE</span>
						</button>
						<button className="button material-button auth-footer_external-account_buttons account_discord">
							<span className="auth-footer_external-account_icon account_discord"></span>
							<span className="auth-footer_external-account_label account_discord">SIGN UP WITH DISCORD</span>
						</button>
					</div>
					<div className="auth-footer_account">
						Have already an account? <Link to="/login" className="auth-footer_account-link"> Log in to yours</Link>														
					</div>
				</div>
			);
		} else {
			return (
				<div className="auth-footer inline-vh">
					<div className="auth-footer_external-account inline-vh">
						<button className="button material-button auth-footer_external-account_buttons account_google">
							<span className="auth-footer_external-account_icon account_google"></span>
							<span className="auth-footer_external-account_label account_google">SIGN IN WITH GOOGLE</span>
						</button>
						<button className="button material-button auth-footer_external-account_buttons account_discord">
							<span className="auth-footer_external-account_icon account_discord"></span>
							<span className="auth-footer_external-account_label account_discord">SIGN IN WITH DISCORD</span>
						</button>
					</div>
					<div className="auth-footer_account">
						Don't have an account? <Link to="/signup" className="auth-footer_account-link"> Create yours</Link>														
					</div>
				</div>
			);
		}
	}

	render() {
		return (
			<section className="page-content">
				<div id="packed" className="packed"></div>
				<section id="context" className="page-part-wrapper">
					<div className="page-part-content" style={{paddingTop: '30px'}}>
						<div className="container all-page-size inline-vh">
							<form action={`/${this.props.type}`} method="POST" className="auth-form">
								{this.renderAdaptativeTab(this.props.type)}
								<hr className="auth-hr" />
								{this.renderAdaptativeAccessibility(this.props.type)}
							</form>
						</div>
					</div>
				</section>
			</section>
		);
	}
}

export default Authentication;