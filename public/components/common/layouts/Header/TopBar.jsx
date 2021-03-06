﻿import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

// Utils
import Text from '../../../utils/Text';

class TopBar extends React.Component {
	constructor(props) {
		super(props);
	}

	render () {
		return (
			<header className="topbar page-part-wrapper">
				<div className="page-part-content">
					<NavigationBarHeader config={this.props.config} />
					<NavigationBarInner config={this.props.config} />
					<div id="topbar_menu-wrapper--clone" className="has-no-display" style={{height: '98px'}}></div>
				</div>
			</header>
		);
	}
}

class NavigationBarHeader extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		// TopBar Options
		(() => {
			const
				body = document.body,
				packed = document.getElementById('packed'),
				onClick = () => {
					body.classList.toggle('has-no-scroll');
					packed.classList.toggle('is-visible');
				};

			packed.addEventListener('click', onClick, false);
		})();
	}

	render() {
		return(
			<div className="topbar_header container">
				<Link 
					to={
						JSON.parse(this.props.config)['heading']['navigation']['links']['homepage']
					} 
					className="topbar_header-icon"
				>
				<div>
					<img src="/assets/images/favicon.png" alt="pSearch's Logo" />
					<h1>pSearch: </h1>
					<h4>
						<Text config={this.props.config} path={['heading', 'navigation', 'linksTitles', 'homepageSub']} />
					</h4>
				</div>
				</Link>
				<div id="topbar_options-menu_header" className="topbar_options">
					<Link 
						to={
							JSON.parse(this.props.config)['heading']['navigation']['links']['login']
						} 
						className="topbar_button button me-text"
					>
						<Text path={['heading', 'navigation', 'linksTitles', 'login']} config={this.props.config} />
					</Link>
				</div>
			</div>
		);
	}
}

class NavigationBarInner extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		let 
			topbarHeader            = document.querySelector('.topbar_header'),
			topbarMenu              = document.querySelector('.topbar_menu'),
			topbarMenuHeading       = document.querySelector('.topbar_menu-heading'),
			topbarMenuWrapper       = document.getElementById('topbar_menu-wrapper'),
			topbarMenuWrapperCloned = document.getElementById('topbar_menu-wrapper--clone'),
			topbarMenuLinksSticky   = document.querySelectorAll('.topbar--underlined.stickytable'),
			topbarMenuOptionsSticky = document.getElementById('topbar_options-menu_sticky'),
			topbarMenuOptionsMenu   = document.getElementById('topbar_options-menu'),
			topbarMenuIcon          = topbarMenu.querySelector('.topbar_menu-icon');

		let stickyBar = () => {
			for(let i = 0, j = topbarMenuLinksSticky.length; i < j; i++) {
				if((topbarHeader.offsetTop + topbarHeader.offsetHeight) <= window.pageYOffset) {
					topbarMenuHeading.classList.remove('has-no-display');
					topbarMenuWrapper.classList.add('is-sticky');
					topbarMenuLinksSticky[i].classList.add('is-in-sticky');
					topbarMenuOptionsSticky.classList.remove('has-no-display');
					topbarMenuOptionsMenu.classList.add('has-no-display');
					topbarMenuIcon.parentNode.classList.remove('has-no-display');

					topbarMenuWrapperCloned.classList.remove('has-no-display');
				} else {
					topbarMenuHeading.classList.add('has-no-display');
					topbarMenuWrapper.classList.remove('is-sticky');
					topbarMenuLinksSticky[i].classList.remove('is-in-sticky');
					topbarMenuOptionsSticky.classList.add('has-no-display');
					topbarMenuOptionsMenu.classList.remove('has-no-display');
					topbarMenuIcon.parentNode.classList.add('has-no-display');

					topbarMenuWrapperCloned.classList.add('has-no-display');
				}
			}
		}
		
		window.addEventListener('scroll', stickyBar, false);
	}

	render() {
		return (
			<div className="topbar_menu-wrapper" id="topbar_menu-wrapper">
				<nav className="topbar_menu container">
					<div className="topbar_menu-heading has-no-display"></div>
					<span className="topbar_menu-links">
						<Link 
							to={
								JSON.parse(this.props.config)['heading']['navigation']['links']['homepage']
							}
							className="has-no-display"
						>
							<img className="topbar_menu-icon" alt="pSearch's Logo" src="/assets/images/favicon.png" />
						</Link>
						<Link 
							to={
								JSON.parse(this.props.config)['heading']['navigation']['links']['forum']
							} 
							className="text topbar--underlined topbar_menu-links--forum stickytable"
						>
							<Text path={['heading', 'navigation', 'linksTitles', 'forum']} config={this.props.config} />
						</Link>
						<Link 
							to={
								JSON.parse(this.props.config)['heading']['navigation']['links']['patchNotes']
							} 
							className="text topbar--underlined stickytable"
						>
							<Text path={['heading', 'navigation', 'linksTitles', 'patchNotes']} config={this.props.config} />
						</Link>
						<HashLink 
							smooth
							to={
								JSON.parse(this.props.config)['heading']['navigation']['links']['feedback']
							} 
							className="text topbar--underlined stickytable"
						>
							<Text path={['heading', 'navigation', 'linksTitles', 'feedback']} config={this.props.config} />
						</HashLink>
					</span>
					<div id="topbar_options-menu" className="topbar_options">
						<Link 
							to={
								JSON.parse(this.props.config)['heading']['navigation']['links']['login']
							} 
							className="topbar_button button me-text"
						>
							<Text path={['heading', 'navigation', 'linksTitles', 'login']} config={this.props.config} />
						</Link>
					</div>
					<div id="topbar_options-menu_sticky" className="topbar_options has-no-display">
						<Link 
							to={
								JSON.parse(this.props.config)['heading']['navigation']['links']['login']
							} 
							className="topbar_button button me-text"
						>
							<Text path={['heading', 'navigation', 'linksTitles', 'login']} config={this.props.config} />
						</Link>
					</div>
				</nav>
			</div>
		);
	}
}

export default TopBar;