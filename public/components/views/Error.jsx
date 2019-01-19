import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

class Error extends React.Component {
	constructor(props) {
		super(props);

		this.renderingContent = this.renderingContent.bind(this);
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