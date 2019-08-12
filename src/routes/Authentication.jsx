import React    from "react";
import { Link } from "react-router-dom";

// Components
import SignUp from "./../components/app/layouts/Body/SignUp";
import LogIn from "./../components/app/layouts/Body/LogIn";

class Authentication extends React.Component {
	constructor(props) {
		super(props);

		this.handleTab = this.handleTab.bind(this);
	}

	handleTab(type) {
		switch(type) {
			case "signup":
				return <SignUp />;
			case "login":
				return <LogIn />;
		}
	}

	render() {
		const { type } = this.props;

		return (
			<section className="page-content">
				<div id="packed" className="packed"></div>
				<section id="context" className="page-part-wrapper">
					<div className="page-part-content" style={{paddingTop: "30px"}}>
						<div className="container all-page-size inline-vh">
							<form 
								id={type} 
								action={`/${type}`} 
								method="POST" 
								// encType={type === "signup" ? "multipart/form-data" : "application/x-www-form-urlencoded"}
							>
								{this.handleTab(type)}
								<hr className="form-hr" />
								<div className="form-footer inline-vh">
									<div className="form-footer_external-account inline-vh">
										<button className="button material-button form-footer_external-account_buttons account--google">
											<span className="form-footer_external-account_icon account--google"></span>
											<span className="form-footer_external-account_label account--google">SIGN IN WITH GOOGLE</span>
										</button>
										<button className="button material-button form-footer_external-account_buttons account--discord">
											<span className="form-footer_external-account_icon account--discord"></span>
											<span className="form-footer_external-account_label account--discord">SIGN IN WITH DISCORD</span>
										</button>
									</div>
									{type === "signup" ?
										<div className="form-footer_account">Have already an account? <Link to="/login" className="form-footer_account-link"> Log in to yours</Link></div>
										:
										// eslint-disable-next-line react/no-unescaped-entities
										<div className="form-footer_account">Don't have an account? <Link to="/signup" className="form-footer_account-link"> Create yours</Link></div>
									}
								</div>
							</form>
						</div>
					</div>
				</section>
			</section>
		);
	}
}

export default Authentication;