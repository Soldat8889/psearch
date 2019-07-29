import React from 'react';

class CustomFieldSelect extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentKey: Object.keys(this.props.options)[0],
			currentOption: Object.values(this.props.options)[0]
		}

		this.onClick = this.onClick.bind(this);
		this.createCustomOptions = this.createCustomOptions.bind(this);
	}

	componentDidMount() {
		const itemSelected = document.querySelector(`.select-selected[data-select-id="${this.props.id}"]`),
			itemsSelection = itemSelected.nextSibling,
			selectOptions = [].slice.call(itemsSelection.children);

		itemSelected.addEventListener('click', (e) => {
			e.preventDefault();
			
			this.onClick();
		}, false);
	}

	onClick() {
		const itemSelected = document.querySelector(`.select-selected[data-select-id="${this.props.id}"]`),
			itemsSelection = itemSelected.nextSibling,
			selectOptions = [].slice.call(itemsSelection.children);

		if(itemsSelection.getAttribute('data-state') === 'folded') {
			itemSelected.classList.add('is-selected');
			itemSelected.childNodes[0].childNodes[1].textContent = '';
			itemsSelection.setAttribute('data-state', 'unfolded');
		} else {
			itemSelected.classList.remove('is-selected');
			itemSelected.childNodes[0].childNodes[1].textContent = '';
			itemsSelection.setAttribute('data-state', 'folded');
		}

		itemSelected.blur();

		for (let i = 0, j = selectOptions.length; i < j; i++) {
			selectOptions[i].addEventListener('click', (e) => {
				e.preventDefault();

				this.setState({
					currentKey: selectOptions[i].value,
					currentOption: selectOptions[i].childNodes[0].childNodes[0].textContent
				});

				for (let i = 0, j = selectOptions.length; i < j; i++) {
					const realSelectOptions = document.querySelector(`select[data-select-id="${this.props.id}"]`),
						realOptions = [].slice.call(realSelectOptions.children);
					realOptions[i].removeAttribute('selected');
					selectOptions[i].classList.remove('is-selected');
					
					if(selectOptions[i].value === this.state.currentKey) {
						realOptions[i].setAttribute('selected', '');
						selectOptions[i].classList.add('is-selected');
					}
				}

				if(this.props.autoClose) {
					itemSelected.childNodes[0].childNodes[1].textContent = '';
					itemSelected.classList.remove('is-selected');
					itemsSelection.setAttribute('data-state', 'folded');
				}

				setTimeout(() => {
					selectOptions[i].blur();
				}, 300);
			}, false);
		}
	}

	createCustomOptions() {
		let customOptions = [],
			i = 0;
		const v = Object.values(this.props.options);

		for (let k in this.props.options) {
			if(this.state.currentKey === k) {
				customOptions.push(
					<button key={i} className="is-selected" value={k}>
						<div className="me-text content-wrapper">
							{v[i]}
						</div>
					</button>
				);
			} else {
				customOptions.push(
					<button key={i} value={k}>
						<div className="me-text content-wrapper">
							{v[i]}
						</div>
					</button>
				);
			}
			i++;
		}

		return customOptions;
	}

	createOptions() {
		let options = [],
			i = 0;
		const v = Object.values(this.props.options);

		for (let k in this.props.options) {
			if(this.state.currentKey === k) {
				options.push(
					<option key={i} value={k} defaultValue>{v[i]}</option>
				);
			} else {
				options.push(
					<option key={i} value={k}>{v[i]}</option>
				);
			}
			i++;
		}

		return options;
	}

	render() {
		return (
			<div className={`bar ${this.props.class}`}>
				<button className="select-selected" data-select-id={this.props.id}>
					<div className="content-wrapper">
						<span className="current-item me-text">{this.state.currentOption}</span>
						<i className="fa"></i>
					</div>
				</button>
				<div className="select-items" data-select-id={this.props.id} data-state="folded">
					{this.createCustomOptions()}
				</div>
				<select className="custom" data-select-id={this.props.id} name={this.props.name}>
					{this.createOptions()}
				</select>
			</div>
		)
	}
}

export default CustomFieldSelect;