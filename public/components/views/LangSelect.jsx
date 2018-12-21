import React, { Component } from 'react';
// Components
// Utils
import CustomFieldSelect from '../utils/CustomFieldSelect';

class LangSelect extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			appJS: null
		}
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

	render() {
		return (
			<section className="page-content">
				<div id="packed" className="packed"></div>
				<div className="page-part-wrapper">
					<div className="background-overlay chrome-test overlay--horizon-zero-dawn"></div>
					<div className="page-part-content all-page-size">
						<div className="content-wrapper">
							<h1><i className="fa"></i> Language</h1>
							<hr />
							<form action="" method="POST">
								<fieldset>
									<CustomFieldSelect 
										id="1"
										class="dark"
										name="lang"
										options=
										{
											{
												none: "Select yours",
												fr: "Français",
												en: "English"
											}
										}
										autoClose={true}
									/>
									<button type="submit" className="button--icon button--dark button--check fa-2x"></button>
								</fieldset>
							</form>
						</div>
					</div>
				</div>
			</section>
		);
	}
}

export default LangSelect;