import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';

class SignUp extends React.Component {
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
                    />
                    <Input 
                        title="Email" 
                        name="email"
                    />
                    <Input 
                        title="Password" 
                        name="password"
                    />
                    <Input 
                        title="Repeat Password" 
                        name="r-password"
                    />
					<div className="auth-group inline-vh">
						<input type="submit" value="SIGN UP" className="auth-submit" />
					</div>
				</fieldset>
			</div>
		);
	}
}

class Input extends Component {
    static defaultProps = {
        title: 'Default title',
        name: 'default-title'
    }

    static propTypes = {
        title: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="auth-group">
                <label className="auth-label" data-state="none">
                    {this.props.title}
                </label>
                <input type="text" name={this.props.name} className="auth-input" />
            </div>
        );
    }
}


export default SignUp;