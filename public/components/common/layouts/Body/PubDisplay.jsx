import React, { Component } from 'react';

class PubDisplay extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		try {
			let pubDisplayBtn = document.getElementById('pubDisplayBtn');

			pubDisplayBtn.addEventListener('click', () => {
				let date = new Date(),
					monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
					expiresDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()} ${date.getHours() + 12}:${date.getMinutes()}:${date.getSeconds()} GMT`,
					pubDisplay = document.getElementById('pub-display');

				document.cookie = `advDisabling=true; Expires=${expiresDate}; Path=/;`;
				pubDisplay.classList.add("has-no-display");
			}, false);
		} catch(e) {}
	}

	render() {
		if(this.props.isDisabled) {
			return false;
		} else {
			return (
				<div id="pub-display" className="pub-display">
					<div className="pub-display-wrapper">
						<img src="https://via.placeholder.com/1600x1800" alt="ADS" className="pub-display-pub" />
						<div className="pub-display-footer">
							<button id="pubDisplayBtn" className="button pub-display-button">Ne plus afficher pour 12h</button>
						</div>
					</div>
				</div>
			);
		}
	}
}

export default PubDisplay;