import React, { Component } from 'react';
// Components
import Sidebar from '../common/layouts/Header/SidebarLayout';
// Utils
import Border from '../utils/Border';

class Homepage extends React.Component {
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
				<Header config={this.props.config} />
				<Sidebar config={this.props.config} />
				<Body config={this.props.config} />
				<Footer config={this.props.config} />
			</section>
		);
	}
}

// Components
import TopBar from '../common/layouts/Header/TopBar';
import Slider from '../common/widgets/Slider';

const Header = (props) => {
	return (
		<header className="page-part-wrapper">
			<div className="background-overlay chrome-test overlay--lol"></div>
			<TopBar config={props.config} />
			<div className="page-part-content">
				<Slider 
					id="slider1"
					class="slider"
					items={3}
					content={JSON.parse(props.config).widgets.slider1}
					options={
						{
							allowControl: true,
							allowFooter: true,
							autoSlide: 5000,
							draggable: false,
							infiniteSlider: true,
							itemsPerScroll: 1,
							itemsPerSlide: 1,
							transitionTime: 300
						}
					}
				/>
			</div>
			<Border type="basic" style={{ bottom: "-1px", fill: "#0e0e0e" }} />
		</header>
	);
}

class Body extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<section className="page-part-wrapper">
				<div className="background-overlay overlay--neutral"></div>
				<Hero />
			</section>
		);
	}
}

const Hero = (props) => {
	return (
		<div className="page-part-content" style={{ padding: "0" }}>
			<div className="hero">
				<div className="hero_wrapper">
					<HeroHeader />
				</div>
			</div>
			<div className="hero_background">
				<HeroFooter />
			</div>
		</div>
	);
}

const HeroHeader = (props) => {
	return (
		<div className="hero_content">
			<h1>This sentence is a test for testing.</h1>
			<button className="button">Submit</button>
		</div>
	);
}

class HeroFooter extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			state: "hidden",
			currentItem: null,
			contain: {
				title: null,
				resume: null,
				src: null
			}
		}
	}

	componentDidMount() {
		const
			heroItems = document.getElementsByClassName('hero_footer-item');

		Array.prototype.forEach.call(heroItems, (heroItem) => {
			heroItem.addEventListener('click', (e) => {
				const
					dataId = e.target.getAttribute('data-id');

				if(dataId === this.state.currentItem) {
					resume.style.display = "block";
					return;
				}

				switch(dataId) {
					case '1':
						this.setState({
							contain: {
								title: 'League of Legends',
								resume: 'League of Legends est un MOBA. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt earum sequi dolorem, non amet odit error ipsam cumque, dolores optio dolore aliquam sit dolor repellat explicabo consequuntur ex est ipsum!',
								src: 'https://img.gaming.gentside.com/article/480/league-of-legends/26724_33cd5e8e1d4810da98262f9392ee7e735d9ada97.jpg'
							}
						});
						break;
					case '2':
						this.setState({
							contain: {
								title: 'Overwatch',
								resume: 'Overwatch est un FPS en multijoueur 6 VS. 6. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt earum sequi dolorem, non amet odit error ipsam cumque, dolores optio dolore aliquam sit dolor repellat explicabo consequuntur ex est ipsum!',
								src: 'https://images2.minutemediacdn.com/image/upload/c_fill,w_912,h_516,f_auto,q_auto,g_auto/shape/cover/sport/5b7ec29325465562a8000001.jpeg'
							}
						});
						break;
					default:
						this.setState({
							contain: {
								title: 'No title.',
								resume: 'No resume.',
								src: 'https://via.placeholder.com/380x225'
							}
						});
						break;
				}

				this.setState({
					state: "visible",
					currentItem: dataId
				});

				const
					resume = document.getElementById('hero_footer-resume'),
					image = document.getElementById('hero_footer-resume_image'),
					loading = document.getElementById('hero_footer-loading'),
					hideResumeBtn = document.getElementById('hero_footer-resume_hide-folder');

				resume.style.display = 'none';
				loading.style.display = 'block';

				if(!image.complete) {
					image.addEventListener('load', () => {
						resume.style.display = 'block';
						loading.style.display = 'none';
					}, false);
				} else {
					resume.style.display = 'block';
					loading.style.display = 'none';
				}

				hideResumeBtn.addEventListener('click', () => {
					const 
						resume = document.getElementById('hero_footer-resume');
		
					resume.style.display = 'none';
					this.setState({
						state: "hidden",
						currentItem: 0
					});
				}, false);
			}, false);
		});
	}

	render() {
		return (
			<div className="container">
				<h1 className="hero_title">Jeux concernés:</h1>
				<HeroFooterFoldingContent state={this.state.state} contain={this.state.contain} />
				<div className="hero_footer" data-current-item={this.state.currentItem}>
					<button className="hero_footer-item league-of-legends" data-id="1" data-tooltip="League of Legends"></button>
					<button className="hero_footer-item overwatch" data-id="2" data-tooltip="Overwatch"></button>
					<button className="hero_footer-item" data-id="3"></button>
					<button className="hero_footer-item" data-id="4"></button>
					<button className="hero_footer-item" data-id="5"></button>
					<button className="hero_footer-item" data-id="6"></button>
					<button className="hero_footer-item" data-id="7"></button>
					<button className="hero_footer-item" data-id="8"></button>
					<button className="hero_footer-item" data-id="9"></button>
					<button className="hero_footer-item" data-id="10"></button>
				</div>
			</div>
		);
	}
}

const HeroFooterFoldingContent = (props) => {
	switch(props.state) {
		case "hidden":
			return false;
			break;
		case "visible":
			return (
				<div className="hero_footer-resume">
					<span id="hero_footer-resume" className="hero_footer-resume">
						<span className="hero_footer-resume_form--title fa"></span><h1 className="hero_footer-resume_title">{props.contain.title}</h1>
						<div className="hero_footer-resume_text">
							<p className="hero_footer-resume_paragraph">{props.contain.resume}</p>
							<img src={props.contain.src} className="hero_footer-resume_image" id="hero_footer-resume_image" alt={props.contain.title} />
						</div>
						<button id="hero_footer-resume_hide-folder" className="hero_footer-resume_hide-folder fa"></button>
						<hr className="hero_footer-delimitation" />
					</span>
					<span id="hero_footer-loading">
						<h2>Loading ...</h2>
					</span>
				</div>
			);
			break;
		default:
			return false;
			break;
	}
}

// Components
import FooterLayout from '../common/layouts/Footer/FooterLayout';

const Footer = (props) => {
	return (
		<footer>
			<div className="page-part-wrapper">
			<div className="background-overlay chrome-test overlay--overwatch"></div>
				<div className="page-part-content">
					<Border type="basic" style={ { top: "-1px", transform: "rotateZ(180deg) rotateY(180deg)", fill: "#090909" } } />
					<div className="container">
						<div className="page-part-content" style={ { margin: "auto", padding: '100px 0' } }>
							<h1 style={ {color: "#2d3436 !important", textAlign: "center"} }>Des idées ? Aidez-nous !</h1>
						</div>
					</div>
					<Border type="basic" style={{ bottom: "-1px", transform: "rotateY(-180deg)" }} />
				</div>
			</div>
			<FooterLayout config={JSON.parse(props.config)} />
		</footer>
	);
}

export default Homepage;