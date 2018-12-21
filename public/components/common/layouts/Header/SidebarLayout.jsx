import React, { Component } from 'react';
// Components
import CustomFieldSelect from './../../../utils/CustomFieldSelect';

class Options extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const crossBtnStyle = {
			stroke: '#fff',
			strokeWidth: '3px'
		}

		return (
			<aside id="sidebar--right" className="sidebar--right content-wrapper">
				<div className="sidebar--right_header">
					<h2>Options</h2>
					<button id="sidebar--right_cross-button">
						<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" alt="Cross icon">
							<line x1="0" x2="30" y1="0" y2="30" style={crossBtnStyle} />
							<line x1="0" x2="30" y1="30" y2="0" style={crossBtnStyle} />
						</svg>
					</button>
				</div>
				<div className="sidebar--right_body">
					<form action="" method="POST">
						<fieldset className="sidebar--right_body-options-group">
							<span className="sidebar--right_body-label me-text">Langue:</span>
							<CustomFieldSelect 
								id="1"
								class="dark"
								name="lang"
								options=
								{
									{
										none: "Sélectionnez votre langue",
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
			</aside>
		);
	}
}

export default Options;