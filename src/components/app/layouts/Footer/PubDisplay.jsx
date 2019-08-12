import React from "react";

class PubDisplay extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		try {
			let 
				pubDisplay        = document.getElementById("pub-display"),
				pubDisplayPub     = document.getElementById("pub-display-pub"),
				pubDisplayOverlay = document.getElementById("pub-display-overlay"),
				pubDisplayBtn     = document.getElementById("pub-display-wrapper_remove-remove");

			pubDisplayPub.addEventListener("load", () => {
				pubDisplayOverlay.style.width = `${pubDisplayPub.offsetWidth}px`;
				pubDisplayOverlay.style.height = `${pubDisplayPub.offsetHeight}px`;
			}, false);

			pubDisplayBtn.addEventListener("mouseover", () => {
				pubDisplayBtn.classList.add("fa");
				pubDisplayBtn.classList.remove("far");
			}, false);

			pubDisplayBtn.addEventListener("mouseleave", () => {
				pubDisplayBtn.classList.remove("fa");
				pubDisplayBtn.classList.add("far");
			}, false);

			pubDisplayBtn.addEventListener("click", () => {
				let date = new Date(),
					monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
					expiresDate = `${date.getDate() + 1} ${monthNames[date.getMonth()]} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} GMT`;

				document.cookie = `advDisabling=true; Expires=${expiresDate}; Path=/;`;
				pubDisplay.classList.add("has-no-display");
			}, false);

			pubDisplayPub.addEventListener("mouseover", () => {
				pubDisplayOverlay.classList.remove("has-no-display");
			}, false);

			pubDisplayOverlay.addEventListener("mouseleave", () => {
				pubDisplayOverlay.classList.add("has-no-display");
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
						<img src="https://via.placeholder.com/970x90" alt="ADS" id="pub-display-pub" className="pub-display-pub" />
						<div id="pub-display-overlay" className="pub-display-overlay has-no-display">
							<div className="pub-display-wrapper_remove">
								<i id="pub-display-wrapper_remove-remove" className="far fa-2x pub-display-wrapper_remove-remove" data-tooltip="Désactiver pour 24h" data-tooltip-theme="positive"></i>
							</div>
						</div>
					</div>
				</div>
			);
		}
	}
}

export default PubDisplay;