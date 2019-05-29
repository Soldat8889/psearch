import React            from 'react';

class Slider extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentSlide: 1,
			intervalID: null
		}

		this.slideTo 		     = this.slideTo.bind(this);
		this.previousSlide 	     = this.previousSlide.bind(this);
		this.nextSlide 		     = this.nextSlide.bind(this);
		this.directSlide 	     = this.directSlide.bind(this);
		this.createSliderPages   = this.createSliderPages.bind(this);
		this.createFooterButtons = this.createFooterButtons.bind(this);
	}

	componentDidMount(props) {
		/**
		 * Layout of Presentation
		 * <Slider
		 *     id={Slider ID}
		 *     items={Nbr. Slider Pages}
		 *	   content={}
		*     options={
		*          ||
		*         \||/
		*          \/
		*     }
		* />
		*/
		/**
		 * Slider Parameters:
		 * Allow Control    => Keyboard control is allowed     ? Default : false   Syntax : allowControl
		 * Allow Footer     => Specific slider can be selected ? Default : true    Syntax : allowFooter
		 * Auto Slide       => Slider slides automatically     ? Default : true    Syntax : autoSlide
							 Waiting time for slide one gut  ? Default : 10000ms Syntax : autoSlideTime
		* Draggable		=> Drag Slider 				   	   ? Default : false   Syntax : draggable
		* Infinite Slider  => Slider is infinite              ? Default : true    Syntax : infiniteSlider
		* Items per Scroll => Number of items/scroll          ? Default : 1       Syntax : itemsPerScroll
		* Items per Slide  => Number of items/slide           ? Default : 1       Syntax : itemsPerSlide
		* Transition Time  => Time of transition 			   ? Default : 300 	   Syntax : transitionTime
		*/

		if(this.props.items < this.props.options.itemsPerSlide || this.props.items < this.props.options.itemsPerScroll) {
			throw new Error('Item Prop. can\'t be smallest than Item/Slide and Item/Scroll Props.');
		}

		if(!Number.isInteger(this.props.options.itemsPerScroll) || !Number.isInteger(this.props.options.itemsPerSlide)) {
			throw new Error('Item/Slide and Item/Scroll Props. can\'t be decimals');
		}

		const
			slider = document.getElementById(this.props.id),
			sliderPages = slider.getElementsByClassName('slider_page'),
			initSlide = this.props.options.itemsPerSlide * (100 / sliderPages.length);

		if(this.props.options.draggable) {
			slider.style.cursor = 'grab';

			slider.addEventListener('mousedown', (e) => {
				let 
					originTargetX = e.screenX,
					originalSliderTranform = parseInt(slider.style.transform.split('translateX(')[1].split('%)')[0], 10);

				e.stopPropagation();

					slider.addEventListener('mousemove', (e) => {
						let
							pointerPosX = originTargetX - e.screenX,
							currentSliderTransform = parseInt(slider.style.transform.split('translateX(')[1].split('%)')[0], 10);

						slider.setAttribute('data-state', 'move');
						slider.style.transition = 'none';
						slider.style.cursor = 'grabbing';

						if(e.buttons === 1) {
							if(currentSliderTransform == 0 && Math.sign(pointerPosX) === -1) {
								return;
							}

							slider.style.transform = `translateX(-${((pointerPosX) / 100) - originalSliderTranform}%)`;
						} else {
							slider.setAttribute('data-state', 'static');
							slider.style.transition = '';
							slider.style.cursor = 'grab';
						}
					}, false);
				}, false);

				slider.addEventListener('mouseleave', (e) => {
					slider.setAttribute('data-state', 'static');
					slider.style.transition = '';
					slider.style.cursor = 'grab';
				}, false);
			}

		slider.style.width = `${sliderPages.length * (100 / this.props.options.itemsPerSlide)}%`;

		for (let i = 0, j = sliderPages.length; i < j; i++) {
			sliderPages[i].style.width = `${100 / this.props.items}%`;
		}

		if(this.props.options.infiniteSlider) {
			new Promise((res, rej) => {
				this.setState({
					currentSlide: Math.round(this.props.options.itemsPerSlide / this.props.options.itemsPerScroll)
				});

				res('Sucess');
			})
			.then(() => {
				slider.style.transform = `translateX(${-initSlide}%)`;
			});
		}
	}

	componentWillUnmount() {
		if(typeof slider === 'undefined') {
			return;
		}

		const 
			sliderButtonDirect = slider.getElementsByClassName('slider_button--direct');
			
		for (let k = 0, l = sliderButtonDirect.length; k < l; k++) {
			sliderButtonDirect[i].addEventListener('click', (e) => {
				this.directSlide(e);
			}, false);
		}
	}

	slideTo(direction, e) {
		const
			slider = document.getElementById(this.props.id),
			sliderPages = slider.getElementsByClassName('slider_page'),
			sliderBtns = [].slice.call(slider.parentNode.parentNode.querySelectorAll('.slider_button')),
			transformValue = this.props.options.itemsPerScroll * (100 / sliderPages.length);

		for (let i = 0, j = sliderBtns.length; i < j; i++) {
			sliderBtns[i].disabled = true;
		}

		switch (direction) {
			case 'previous':
				if(this.state.currentSlide == 0) {
					new Promise((res, rej) => {
						this.setState({
							currentSlide: Math.round((sliderPages.length - this.props.options.itemsPerSlide * 2) / this.props.options.itemsPerScroll) - 1
						});

						res(Math.round((sliderPages.length - this.props.options.itemsPerSlide * 2) / this.props.options.itemsPerScroll));
					})
					.then((val) => {
						slider.setAttribute('data-state', 'move');
						slider.style.transition = 'none';
						slider.style.transform = `translateX(${val * (-transformValue)}%)`;

						setTimeout(() => {
							slider.style.transition = '';
							slider.style.transform = `translateX(${val * (-transformValue) + transformValue}%`;
						}, this.props.options.transitionTime);

						setTimeout(() => {
							slider.setAttribute('data-state', 'static');
							for (let i = 0, j = sliderBtns.length; i < j; i++) {
								sliderBtns[i].disabled = false;
							}
						}, this.props.options.transitionTime * 2);
					});

					return;
				}

				new Promise((res, rej) => {
					this.setState({
						currentSlide: this.state.currentSlide - 1
					});

					res(this.state.currentSlide - 1);
				})
				.then((val) => {
					slider.setAttribute('data-state', 'move');
					slider.style.transform = `translateX(${transformValue * (-val)}%)`;

					setTimeout(() => {
						slider.setAttribute('data-state', 'static');
						for (let i = 0, j = sliderBtns.length; i < j; i++) {
							sliderBtns[i].disabled = false;
						}
					}, this.props.options.transitionTime);
				});
				break;
			case 'next':
				new Promise((res, rej) => {
					this.setState({
						currentSlide: this.state.currentSlide + 1
					});

					res(this.state.currentSlide + 1);
				})
				.then((val) => {
					slider.setAttribute('data-state', 'move');

					if(this.state.currentSlide == Math.ceil((sliderPages.length - this.props.options.itemsPerSlide) / this.props.options.itemsPerScroll)) {
						slider.style.transform = `translateX(${(sliderPages.length - this.props.options.itemsPerSlide) * (-100 / sliderPages.length)}%)`;
					} else {
						slider.style.transform = `translateX(${-transformValue * val}%)`;
					}

					setTimeout(() => {
						slider.setAttribute('data-state', 'static');

						if(this.state.currentSlide == Math.round(((sliderPages.length - this.props.options.itemsPerSlide * 2) / this.props.options.itemsPerScroll) + 1)) {
							new Promise((res, rej) => {
								this.setState({
									currentSlide: 1
								});
								res(1);
							})
							.then((val) => {
								setTimeout(() => {
									slider.setAttribute('data-state', 'move');
									slider.style.transition = 'none';
									slider.style.transform = `translateX(${-transformValue * val}%`;
	
									setTimeout(() => {
										slider.setAttribute('data-state', 'static');
										slider.style.transition = '';

										for (let i = 0, j = sliderBtns.length; i < j; i++) {
											sliderBtns[i].disabled = false;
										}
									}, this.props.options.transitionTime);
								}, this.props.options.transitionTime);
							})
						} else {
							for (let i = 0, j = sliderBtns.length; i < j; i++) {
								sliderBtns[i].disabled = false;
							}
						}
					}, this.props.options.transitionTime);
				});

				break;
			case 'direct':
				if(typeof e !== 'undefined') {

				}
				break;
		}
	}

	previousSlide() {
		this.slideTo('previous');
	}

	nextSlide() {
		this.slideTo('next');
	}

	directSlide(e) {
		console.log(e)
		// this.slideTo('direct', e);
	}

	createSliderPages() {
		let sliderPages = [];

		if(this.props.options.infiniteSlider) {
			for (let i = -this.props.options.itemsPerSlide, j = 0; i < j; i++) {
				sliderPages.push(
					<SliderPage 
						config={this.props.config} 
						class=" slider_page--duplicated"
						index={i} 
						page={this.props.items + i + 1}
						content={this.props.content[`item${this.props.items + i + 1}`]}
						key={i}
					/>
				);
			}
		}

		for (let i = 0, j = this.props.items - 1; i <= j; i++) {
			sliderPages.push(
				<SliderPage 
					config={this.props.config} 
					index={i} 
					page={i + 1}
					content={this.props.content[`item${i + 1}`]}
					key={i}
				/>
			);
		}

		if(this.props.options.infiniteSlider) {
			for (let i = this.props.items, j = this.props.items + this.props.options.itemsPerSlide; i < j; i++) {
				sliderPages.push(
					<SliderPage 
						config={this.props.config} 
						class=" slider_page--duplicated"
						index={i} 
						page={-(this.props.items - i - 1)}
						content={this.props.content[`item${-(this.props.items - i - 1)}`]}
						key={i}
					/>
				);
			}
		}

		return sliderPages;
	}

	createFooterButtons() {
		if(this.props.options.allowFooter) {
			let 
				btns = [];

			for(let i = 1, j = Math.round(this.props.items / this.props.options.itemsPerSlide); i <= j; i++) {
				btns.push(
					<button className="slider_button--direct" key={i} data-point-to-slide={i}>
						<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">
							<circle cx="5" cy="5" r="5" />
						</svg>
					</button>
				);
			}

			return btns;
		}
	}

	render() {
		return (
			<div className={this.props.class}>
				<div className="slider_wrapper container">
					<ul 
						id={this.props.id} 
						className="slider_list" 
						style={{transform: 'translateX(0)'}}
						data-items={this.props.items} 
						data-current-slide={this.state.currentSlide}
						data-state="static"
					>
						{this.createSliderPages()}
					</ul>
				</div>
				<div className="slider_footer container">
					<button className="slider_button--left slider_button fa fa-3x" data-direction="left" onClick={this.previousSlide}></button>
					<button className="slider_button--right slider_button fa fa-3x" data-direction="right" onClick={this.nextSlide}></button>
					<div className="slider_list-buttons">
						{this.createFooterButtons()}
					</div>
				</div>
			</div>
		);
	}
}

const SliderPage = (props) => (
	<li className={`slider_page${props.class ? props.class : ''}`} data-index={props.index} data-page={props.page}>
		<div className="content-wrapper">
			<SliderPageHeading title={props.content.title} />
			<SliderPageBody list={props.content.list} />
		</div>
	</li>
);

const SliderPageHeading = (props) => (
	<div className="text-heading">
		<svg className="triangular-bar" xmlns="http://www.w3.org/2000/svg" width="180" height="60" alt="triangular bar">
			<polygon points="0,60 60,60 30,0" />
			<polygon points="30,0 90,0 60,60" />
			<polygon points="60,60 120,60 90,0" />
			<polygon points="90,0 150,0 120,60" />
			<polygon points="120,60 180,60 150,0" />
		</svg>
		<h2>{props.title}</h2>
	</div>
);

class SliderPageBody extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isReady: false,
			children: []
		}

		this.createListItems = this.createListItems.bind(this);
	}

	componentDidMount() {
		this.createListItems();
	}

	createListItems() {
		new Promise((res, rej) => {
			let 
				ul = [],
				children = [];

			for(let i = 1; i <= 3; i++) {
				if(typeof this.props.list[`item${i}`] !== 'undefined') {
					children.push(`
						<li class="slider_items paragraph text">
							<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" alt="Bulleted list">
								<circle cx="5" cy="5" r="2.5" />
							</svg>
							${this.props.list[`item${i}`]}
						</li>
					`);
				}
			}
			
			ul.push(children.join(''))
			res(ul);
		})
		.then((array) => {
			this.setState({
				isReady: true,
				children: array.concat(this.state.children)
			});
		});
	}

	render() {
		if(this.state.isReady) {
			return (
				<ul dangerouslySetInnerHTML={{__html: this.state.children }}></ul>
			);
		} else {
			return null;
		}
	}
}

export default Slider;