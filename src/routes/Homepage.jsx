import React from "react";

// Components
import FooterLayout from "./../components/app/layouts/Footer/FooterLayout";
// Utils
import Border from "./../components/app/utils/Border";

class Homepage extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<section className="page-content">
				<div id="packed" className="packed"></div>
				<Header />
				<Body />
				<FeedbackLayout />
				<footer id="Homepage-Footer">
					<FooterLayout />
				</footer>
			</section>
		);
	}
}

// Components
import TopBar from "./../components/app/layouts/Header/TopBar";

class Header extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<header id="Homepage-Heading" className="page-part-wrapper">
				<div className="background-overlay webp-test overlay--lol"></div>
				<TopBar 
					params={{
						isSticky: true
					}}
				/>
				<div className="page-part-content" style={{height: "100vh"}}>
					{/* <Slider 
						id="slider1"
						class="slider"
						items={3}
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
					/> */}
				</div>
				<Border type="basic" style={{ bottom: "-1px", fill: "#292929" }} />
			</header>
		);
	}
}

class Body extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<section id="Homepage-Body" className="page-part-wrapper">
				<div className="background-overlay overlay--neutral"></div>
				<Hero />
			</section>
		);
	}
}

const Hero = () => {
	return (
		<div className="page-part-content" style={{ padding: "0", fill: "#181718" }}>
			<div className="hero">
				<div className="hero_wrapper">
					<HeroHeader />
				</div>
				<div className="test"></div>
			</div>
			<div className="hero_background">
				<HeroFooter />
			</div>
		</div>
	);
};

const HeroHeader = () => {
	return (
		<div className="hero_content">
			<h1>This sentence is a test for testing.</h1>
			<button className="button me-text">Submit</button>
		</div>
	);
};

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
		};
	}

	componentDidMount() {
		const
			heroItems = document.getElementsByClassName("hero_footer-item");

		Array.prototype.forEach.call(heroItems, (heroItem) => {
			heroItem.addEventListener("click", () => {
				const
					dataId = heroItem.getAttribute("data-id");

				if(dataId === this.state.currentItem) {
					const
						resume = document.getElementById("hero_footer-resume");
						
					resume.style.display = "block";
					return;
				}

				switch(dataId) {
				case "1":
					this.setState({
						contain: {
							title: "League of Legends",
							resume: "League of Legends est un MOBA développé et édité par Riot Games. Sorti en octobre 2009, il se voit placé dans le monde de l\"e-sport. Rendez-vous sur la faille de l\"invocateur !",
							src: "https://img.gaming.gentside.com/article/480/league-of-legends/26724_33cd5e8e1d4810da98262f9392ee7e735d9ada97.jpg"
						}
					});
					break;
				case "2":
					this.setState({
						contain: {
							title: "Overwatch",
							resume: "Overwatch est un FPS en multijoueur 6 VS 6 sorti en mai 2016. Il se voit accompagné d\"une multitude de héros. Incarnez le héros que vous voulez !",
							src: "https://images2.minutemediacdn.com/image/upload/c_fill,w_912,h_516,f_auto,q_auto,g_auto/shape/cover/sport/5b7ec29325465562a8000001.jpeg"
						}
					});
					break;
				case "3":
					this.setState({
						contain: {
							title: "Super Smash Bros. Ultimate",
							resume: "Super Smash Bros. Ultimate, sorti récemment en décembre 2018, est un jeu de combat allant de 1 à 8 joueurs: parfait pour jouer à plusieurs ! Éliminez les tous avec votre Super Smash !",
							src: "https://cdn.wccftech.com/wp-content/uploads/2018/07/Super-Smash-Bros-Ultimate.jpg"
						}
					});
					break;
				case "4":
					this.setState({
						contain: {
							title: "Apex Legends",
							resume: "Anéantissez vos ennemis dans le sang ! Incarnez plusieurs personnages, tous aux allures différentes.",
							src: "https://res.cloudinary.com/lmn/image/upload/c_limit,h_360,w_640/e_sharpen:100/f_auto,fl_lossy,q_auto/v1/gameskinnyc/a/p/e/apex-legends-cross-platform-gameplay-b1210.jpg"
						}
					});
					break;
				default:
					this.setState({
						contain: {
							title: "No title.",
							resume: "No resume.",
							src: "https://via.placeholder.com/380x225"
						}
					});
					break;
				}

				this.setState({
					state: "visible",
					currentItem: dataId
				});

				const resume = document.getElementById("hero_footer-resume");
				const image = document.getElementById("hero_footer-resume_image");
				const loading = document.getElementById("hero_footer-loading");
				const hideResumeBtn = document.getElementById("hero_footer-resume_hide-folder");

				resume.style.display = "none";
				loading.style.display = "block";

				if(!image.complete) {
					image.addEventListener("load", () => {
						resume.style.display = "block";
						loading.style.display = "none";
					}, false);
				} else {
					resume.style.display = "block";
					loading.style.display = "none";
				}

				hideResumeBtn.addEventListener("click", () => {
					resume.style.display = "none";

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
					<div className="hero_footer-item" data-id="1" data-tooltip="League of Legends">
						<div className="hero_footer-item_wrapper">						
							<img src="/assets/images/loading-content.jpg" alt="League of Legends" className="hero_footer-item_img webp-test lazy-loading" data-lazy-loading="/assets/images/icon--league-of-legends .jpg" />
						</div>
					</div>
					<div className="hero_footer-item" data-id="2" data-tooltip="Overwatch">
						<div className="hero_footer-item_wrapper">
							<img src="/assets/images/loading-content.jpg" alt="Overwatch" className="hero_footer-item_img webp-test lazy-loading" data-lazy-loading="/assets/images/icon--overwatch .jpg" />
						</div>
					</div>
					<div className="hero_footer-item" data-id="3" data-tooltip="Super Smash Bros. Ultimate">
						<div className="hero_footer-item_wrapper">
							<img src="/assets/images/loading-content.jpg" alt="Super Smash Bros. Ultimate" className="hero_footer-item_img webp-test lazy-loading" data-lazy-loading="/assets/images/icon--super-smash-bros-ultimate .jpg" />
						</div>
					</div>
					<div className="hero_footer-item" data-id="4" data-tooltip="Apex Legends">
						<div className="hero_footer-item_wrapper">
							<img src="/assets/images/loading-content.jpg" alt="Apex Legends" className="hero_footer-item_img webp-test lazy-loading" data-lazy-loading="/assets/images/icon--apex-legends .jpg" />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const HeroFooterFoldingContent = (props) => {
	switch(props.state) {
	case "hidden":
		return false;
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
	default:
		return false;
	}
};

const FeedbackLayout = () => {
	return (
		<section id="Homepage-Feedback" className="page-part-wrapper">
			<div id="Homepage-Feedback-Bg" className="background-overlay webp-test overlay--overwatch" style={{filter: "blur(15px)"}}></div>
			<div className="page-part-content">
				<Border type="basic" style={ { top: "-1px", transform: "rotateZ(180deg) rotateY(180deg)", fill: "#181718" } } />
				<div className="container">
					<div id="feedback" className="feedback page-part-content">
						<h1>Des idées ? Aidez-nous !</h1>
					</div>
				</div>
				<Border type="basic" style={{ bottom: "-1px", transform: "rotateY(-180deg)", fill: "#181718" }} />
			</div>
		</section>
	);
};

export default Homepage;