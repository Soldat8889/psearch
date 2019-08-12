﻿import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import PropTypes from "prop-types";

// Contexts
import { ConfigContext } from "../../../../context/ConfigContext";
import { UserContext } from "../../../../context/UserContext";

// Utils
import Text from "../../utils/Text";

class TopBar extends React.Component {
	constructor(props) {
		super(props);
	}

	static defaultProps = {
		params: {
			isSticky: true
		}
	}

	/**
	 * @param { Object } this.props.params Define Params of Class
	 * @param { Boolean } this.props.params.isSticky Define bar will be stickyable
	 */

	static propTypes = {
		params: PropTypes.shape({
			isSticky: PropTypes.bool
		})
	}

	render () {
		return (
			<header className="topbar page-part-wrapper">
				<div className="page-part-content">
					<NavigationBarHeader />
					<NavigationBarInner 
						params={
							{
								isSticky: this.props.params.isSticky
							}
						}
					/>
					<div id="topbar_menu-wrapper--clone" className="has-no-display" style={{height: "98px"}}></div>
				</div>
			</header>
		);
	}
}

class NavigationBarHeader extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<ConfigContext.Consumer>
				{config => (
					<div className="topbar_header container">
						<Link 
							to={
								config.heading.navigation.links.homepage
							} 
							className="topbar_header-icon"
						>
						<div>
							<img src="/assets/images/favicon.png" alt="pSearch's Logo" />
							<h1>pSearch: </h1>
							<h4>
								<Text path={["heading", "navigation", "linksTitles", "homepageSub"]} />
							</h4>
						</div>
						</Link>
						<UserContext.Consumer>
							{user => (
								<div id="topbar_options-menu_header" className="topbar_options">
									{user ? 
										<Link 
											to={
												config.heading.navigation.links.dashboard
											} 
											className="topbar_button button me-text"
										>
											<Text path={["heading", "navigation", "linksTitles", "dashboard"]} />
										</Link>

										: 

										<Link 
											to={
												config.heading.navigation.links.login
											} 
											className="topbar_button button me-text"
										>
											<Text path={["heading", "navigation", "linksTitles", "login"]} />
										</Link>
									}
								</div>
							)}
						</UserContext.Consumer>
					</div>
				)}
			</ConfigContext.Consumer>
		);
	}
}

class NavigationBarInner extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isSticky: false
		};

		this.isSticky = this.isSticky.bind(this);
	}

	componentDidMount() {
		this.props.params.isSticky ? window.addEventListener("scroll", this.isSticky, false) : false;
	}

	componentWillUnmount() {
		this.props.params.isSticky ? window.removeEventListener("scroll", this.isSticky, false) : false;
	}

	isSticky() {
		let 
			topbarHeader            = document.querySelector(".topbar_header"),
			topbarMenu              = document.querySelector(".topbar_menu"),
			topbarMenuHeading       = document.querySelector(".topbar_menu-heading"),
			topbarMenuWrapper       = document.getElementById("topbar_menu-wrapper"),
			topbarMenuWrapperCloned = document.getElementById("topbar_menu-wrapper--clone"),
			topbarMenuLinksSticky   = document.querySelectorAll(".topbar--underlined.stickytable"),
			topbarMenuOptionsSticky = document.getElementById("topbar_options-menu_sticky"),
			topbarMenuOptionsMenu   = document.getElementById("topbar_options-menu"),
			topbarMenuIcon          = topbarMenu.querySelector(".topbar_menu-icon");

		for(let i = 0, j = topbarMenuLinksSticky.length; i < j; i++) {
			if((topbarHeader.offsetTop + topbarHeader.offsetHeight) <= window.pageYOffset) {
				topbarMenuHeading.classList.remove("has-no-display");
				topbarMenuWrapper.classList.add("is-sticky");
				topbarMenuLinksSticky[i].classList.add("is-in-sticky");
				topbarMenuOptionsSticky.classList.remove("has-no-display");
				topbarMenuOptionsMenu.classList.add("has-no-display");
				topbarMenuIcon.parentNode.classList.remove("has-no-display");

				topbarMenuWrapperCloned.classList.remove("has-no-display");

				this.setState({
					isSticky: true
				});
			} else {
				topbarMenuHeading.classList.add("has-no-display");
				topbarMenuWrapper.classList.remove("is-sticky");
				topbarMenuLinksSticky[i].classList.remove("is-in-sticky");
				topbarMenuOptionsSticky.classList.add("has-no-display");
				topbarMenuOptionsMenu.classList.remove("has-no-display");
				topbarMenuIcon.parentNode.classList.add("has-no-display");

				topbarMenuWrapperCloned.classList.add("has-no-display");

				this.setState({
					isSticky: false
				});
			}
		}
	}

	render() {
		return (
			<ConfigContext.Consumer>
				{config => (
					<div className="topbar_menu-wrapper" id="topbar_menu-wrapper">
						<nav className="topbar_menu container" data-is-sticky={this.state.isSticky}>
							<div className="topbar_menu-heading has-no-display"></div>
							<span className="topbar_menu-links">
								<Link 
									to={
										config.heading.navigation.links.homepage
									}
									className="has-no-display"
								>
									<img className="topbar_menu-icon" alt="pSearch's Logo" src="/assets/images/favicon.png" />
								</Link>
								<Link 
									to={
										config.heading.navigation.links.forum
									} 
									className="text topbar--underlined topbar_menu-links--forum stickytable"
								>
									<Text path={["heading", "navigation", "linksTitles", "forum"]} />
								</Link>
								<Link 
									to={
										config.heading.navigation.links.patchNotes
									} 
									className="text topbar--underlined stickytable"
								>
									<Text path={["heading", "navigation", "linksTitles", "patchNotes"]} />
								</Link>
								<HashLink 
									smooth
									to={
										config.heading.navigation.links.feedback
									} 
									className="text topbar--underlined stickytable"
								>
									<Text path={["heading", "navigation", "linksTitles", "feedback"]} />
								</HashLink>
							</span>
							<UserContext.Consumer>
								{user => (
									<div id="topbar_options-menu" className="topbar_options">
										{user ? 
											<Link 
												to={
													config.heading.navigation.links.dashboard
												} 
												className="topbar_button button me-text"
											>
												<Text path={["heading", "navigation", "linksTitles", "dashboard"]} />
											</Link>
											: 
											<Link 
												to={
													config.heading.navigation.links.login
												} 
												className="topbar_button button me-text"
											>
												<Text path={["heading", "navigation", "linksTitles", "login"]} />
											</Link>
										}
									</div>
								)}
							</UserContext.Consumer>
							<UserContext.Consumer>
								{user => (
									<div id="topbar_options-menu_sticky" className="topbar_options has-no-display">
										{user ? 
											<Link 
												to={
													config.heading.navigation.links.dashboard
												} 
												className="topbar_button button me-text"
											>
												<Text path={["heading", "navigation", "linksTitles", "dashboard"]} />
											</Link>
											: 
											<Link 
												to={
													config.heading.navigation.links.login
												} 
												className="topbar_button button me-text"
											>
												<Text path={["heading", "navigation", "linksTitles", "login"]} />
											</Link>
										}
									</div>
								)}
							</UserContext.Consumer>
						</nav>
					</div>
				)}
			</ConfigContext.Consumer>
		);
	}
}

export default TopBar;