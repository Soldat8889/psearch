import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

class Error extends React.Component {
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

	renderingContent() {
		switch (true) {
			case this.props.typeError == 404:
				return <UndefinedPage />;
				break;
			default:
				return <UndefinedPage />;
				break;
		}
	}

	render() {
		return (
			this.renderingContent()
		);
	}
}

const UndefinedPage = (props) => {
	return (
		<section className="page-content">
			<h1>
				404
			</h1>	
		</section>
	);
}

export default Error;