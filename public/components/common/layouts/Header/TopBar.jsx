import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
				sidebarRight = document.getElementById('sidebar--right'),
				sidebarRightButtons = document.getElementsByClassName('sidebar--right--button'),
				sidebarRightCrossButton = document.getElementById('sidebar--right_cross-button'),
				onClick = () => {
					body.classList.toggle('has-no-scroll');
					packed.classList.toggle('is-visible');
					sidebarRight.classList.toggle('is-visible');
				};

			for(let i = 0, j = sidebarRightButtons.length; i < j; i++) {
				sidebarRightButtons[i].addEventListener('click', onClick, false);
			}
			packed.addEventListener('click', onClick, false);
			sidebarRightCrossButton.addEventListener('click', onClick, false);
		})();
	}

	render() {
		return(
			<div className="topbar_header container">
				<div className="text topbar_header-icon">
					<img src="/assets/images/favicon.png" alt="pSearch's Logo" />
					<h1>pSearch: </h1>
					<h4>
						<Text config={this.props.config} path={['heading', 'navigation', 'linksTitles', 'homepageSub']} />
					</h4>
				</div>
				<div className="topbar_options">
					<button id="sidebar--left_button" className="topbar_button" data-sidebar="left">
						<i className="fa fa-4x"></i>
					</button>
					<Link 
						to={
							JSON.parse(this.props.config)['heading']['navigation']['links']['login']
						} 
						className="topbar_button button"
					>
						<Text path={['heading', 'navigation', 'linksTitles', 'login']} config={this.props.config} />
					</Link>
					<button className="topbar_button sidebar--right--button" data-sidebar="right">
						<i className="fa fa-3x"></i>
					</button>
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
			topbarHeader = document.querySelector('.topbar_header'),
			topbarMenu = document.querySelector('.topbar_menu'),
			topbarMenuWrapper = document.getElementById('topbar_menu-wrapper'),
			topbarMenuWrapperCloned = document.getElementById('topbar_menu-wrapper--clone'),
			topbarMenuLinksSticky = document.querySelectorAll('.topbar--underlined.stickytable'),
			topbarMenuOptions = topbarMenu.querySelector('.topbar_options'),
			topbarMenuIcon = topbarMenu.querySelector('.topbar_menu-icon');

		window.addEventListener('scroll', (e) => {
			for(let i = 0, j = topbarMenuLinksSticky.length; i < j; i++) {
				if((topbarHeader.offsetTop + topbarHeader.offsetHeight) <= window.pageYOffset) {
					topbarMenuWrapper.classList.add('is-sticky');
					topbarMenuLinksSticky[i].classList.add('is-in-sticky');
					topbarMenuOptions.classList.remove('has-no-display');
					topbarMenuIcon.classList.remove('has-no-display');

					topbarMenuWrapperCloned.classList.remove('has-no-display');
				} else {
					topbarMenuWrapper.classList.remove('is-sticky');
					topbarMenuLinksSticky[i].classList.remove('is-in-sticky');
					topbarMenuOptions.classList.add('has-no-display');
					topbarMenuIcon.classList.add('has-no-display');

					topbarMenuWrapperCloned.classList.add('has-no-display');
				}
			}
		});
	}

	render() {
		return (
			<div className="topbar_menu-wrapper" id="topbar_menu-wrapper">
				<nav className="topbar_menu container">
					<span className="topbar_menu-links">
						<Link 
							to={
								JSON.parse(this.props.config)['heading']['navigation']['links']['homepage']
							}
						>
							<img className="topbar_menu-icon has-no-display" alt="pSearch's Logo" src="/assets/images/favicon.png" />
						</Link>
						<Link 
							to={
								JSON.parse(this.props.config)['heading']['navigation']['links']['forum']
							} 
							className="text topbar--underlined stickytable"
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
						<Link 
							to={
								JSON.parse(this.props.config)['heading']['navigation']['links']['feedback']
							} 
							className="text topbar--underlined stickytable"
						>
							<Text path={['heading', 'navigation', 'linksTitles', 'feedback']} config={this.props.config} />
						</Link>
					</span>
					<div className="topbar_options has-no-display">
						<Link 
							to={
								JSON.parse(this.props.config)['heading']['navigation']['links']['login']
							} 
							className="topbar_button button"
						>
							<Text path={['heading', 'navigation', 'linksTitles', 'login']} config={this.props.config} />
						</Link>
						<button className="topbar_button sidebar--right--button" data-sidebar="right">
							<i className="fa fa-3x"></i>
						</button>
					</div>
				</nav>
			</div>
		);
	}
}

export default TopBar;