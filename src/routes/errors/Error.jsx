import React     from "react";
import PropTypes from "prop-types";

// Components
	import Error404 from "./Error-404";

class Error extends React.Component {
	static defaultProps = {
		type: 404
	}

	/**
	 * @param { Number } this.props.type It means the type of error (e.g. Is it an error 404? Undefined page)
	 */

	static propTypes = {
		type  : PropTypes.number.isRequired
	}

	constructor(props) {
		super(props);

		this.handleCatch = this.handleCatch.bind(this);
	}

	/**
	 * Create an adaptative return in terms of the type of this error
	 * 
	 * @param { Number } type The type of this error
	 * @return { Object } Return the Component Error
	 */

	handleCatch(type) {
		switch(type) {
			case 404:
				return ( 
					<Error404 
						config={this.props.config}
						isAuthed={this.props.isAuthed}	
					/>
				);
			default:
				return ( 
					<Error404 
						config={this.props.config}
						isAuthed={this.props.isAuthed}	
					/>
				);
		}
	}

	render() {
		const { type } = this.props;

		return this.handleCatch(type);
	}
}

export default Error;