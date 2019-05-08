import React, { Component } from 'react';
import PropTypes            from 'prop-types';

class Input extends Component {
    /*
     * @minLength { number }: Equal OR Greater, accepted
     * @maxLength { number }: Equal OR Less, accepted
    */

    static defaultProps = {
        title: 'Default title',
        name: 'default-title',
        minLength: 6,
        maxLength: 52,
        apiErrorTarget: undefined
    }

    static propTypes = {
        title: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        minLength: PropTypes.number.isRequired,
        maxLength: PropTypes.number.isRequired,
        rule: PropTypes.shape({
            type: PropTypes.string,
            content: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.instanceOf(RegExp),
                PropTypes.object,
            ]),
        }).isRequired,
        apiErrorTarget: PropTypes.string
    }

    constructor(props) {
        super(props);

        this.state = {
            currentLabel  : null,
            currentInput  : null,
            handleError   : false,
            ruleType      : "",
            ruleContent   : null,
            isAvailable   : false,
            errorTarget   : false,
            apiErrorTarget: undefined
        }

        this.checkInput         = this.checkInput.bind(this);
        this.handleBlur         = this.handleBlur.bind(this);
        this.displayMessage     = this.displayMessage.bind(this);
        this.inputRemoveMessage = this.inputRemoveMessage.bind(this);
    }

    componentDidMount() {
        this.setState({
            currentLabel: document.querySelector(`[data-reference="${this.props.name}"]`),
            currentInput: document.getElementsByName(this.props.name)[0],
            ruleType    : this.props.rule.type,
            ruleContent : this.props.rule.content
        });

        // If the page has been refresh, get window.CONF.params
        if(window.CONF.params.errorTarget !== "" && this.props.name == window.CONF.params.errorTarget) {
            this.setState({
                errorTarget: true
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        // When apiErrorTarget changes, so update state
        if(nextProps.apiErrorTarget !== this.props.apiErrorTarget || this.state.apiErrorTarget === undefined) {
            this.setState({
                apiErrorTarget: nextProps.apiErrorTarget 
            });
        }
    }

    componentWillUnmount() {
        let
            inputs = document.querySelectorAll('.auth-input');

        // Get all inputs
        Array.prototype.forEach.call(inputs, input => {
            input.removeEventListener("keyup", this.checkInput, false);
            input.removeEventListener("blur", this.handleBlur, false);
        });
    }

    checkInput() {
        // Set Negative Color
        let
            negativeColor = "#B22222";

        // Verify minLength & maxLength
        if(this.state.currentInput.value.length < this.props.minLength || this.state.currentInput.value.length > this.props.maxLength) {
            this.setState({
                handleError: true,
                isAvailable: false
            });
            
            // Negative color
            this.state.currentLabel.style.color = negativeColor;
        } else {
            // RuleType between Regex & Match
            switch(this.state.ruleType) {
                case 'Regex':
                    if(this.state.ruleContent.test(this.state.currentInput.value) === true) {
                        this.setState({
                            handleError: false,
                            isAvailable: true
                        });
                        this.state.currentLabel.style.color = "";
                    } else if(this.state.ruleContent.test(this.state.currentInput.value) === false) {
                        this.setState({
                            handleError: true,
                            isAvailable: false
                        });
                        this.state.currentLabel.style.color = negativeColor;
                    }
                    break;
                case 'Match':
                    if(document.getElementsByName(this.state.ruleContent)[0].value != this.state.currentInput.value) {
                        this.setState({
                            handleError: true,
                            isAvailable: false
                        });
                        this.state.currentLabel.style.color = negativeColor;
                    } else {
                        this.setState({
                            handleError: false,
                            isAvailable: true
                        });
                        this.state.currentLabel.style.color = "";
                    }
                    break;
                default:
                    window.CONF.env == 'development' ? console.warn('Any rule ?') : false;
                    break;
            }
        }

        // Call this
        this.inputRemoveMessage();
    }

    handleBlur() {
        // Call this
        this.checkInput();
        
        // Remove all errors displays
        if(this.state.currentInput.value == "") {
            this.setState({
                handleError: false,
                isAvailable: false
            });
            this.state.currentLabel.style.color = "";
        }
    }

    async displayMessage(target, type, message) {
        const
            label = document.querySelector(`label[data-reference="${target}"`),
            box   = label.parentNode.querySelector('.auth-input_box');

        const 
            msgWrapper = document.createElement('div'),
            msgCross   = document.createElement('span');

        new Promise(async (res, rej) => {
            // Get all children of box
            Array.prototype.forEach.call([].slice.call(box.children), child => {
                const
                    childClasses = [].slice.call(child.classList);

                // Not the cross
                if(childClasses.indexOf('auth-message_wrapper') === -1) {
                    // Display: none for all except the cross
                    child.setAttribute('data-display', 'none');
                    child.style.display = 'none';
                } else {
                    box.removeChild(child);
                }
            });

            // Message Wrapper
            msgWrapper.setAttribute('class', `auth-message_wrapper`);
            msgWrapper.setAttribute('data-reference', target);

            // Message Cross
            msgCross.setAttribute('class', `fas sm-text auth-message_icon auth-message--${type}`);
            msgCross.textContent = '';

            // Message Text
            label.innerHTML = `${this.props.title} - <span class="auth-message_text">${message}</span>`;

            // Set color
            switch(type) {
                case 'error':
                    label.style.color = '#B22222';
                    break;
                default:
                    break;
            }

            res();
        })
        .then(() => {
            // Insert elements to the DOM
            box.appendChild(msgWrapper);
            msgWrapper.appendChild(msgCross);
        });
    }

    inputRemoveMessage() {
        const
            label = this.state.currentLabel;

        // Reinitialize its title
        label.textContent = this.props.title;

        // Not undefined so...
        if(this.state.apiErrorTarget !== undefined && this.state.apiErrorTarget === this.props.name) {
            const
                msg = document.querySelector(`div.auth-message_wrapper[data-reference="${this.state.apiErrorTarget}"]`),
                box = msg.parentNode;

            // Each children so...
            Array.prototype.forEach.call([].slice.call(box.children), child => {
                const
                    childClasses = [].slice.call(child.classList);

                // Not the cross
                if(childClasses.indexOf('auth-message_wrapper') === -1) {
                    // Hidden all except the cross
                    child.setAttribute('data-display', 'block');
                    child.style.display = 'block';
                } else {
                    box.removeChild(child);
                }

                // Remove errorTargeter
                this.setState({
                    apiErrorTarget: undefined
                });
            });
        }
    }

    render() {
        return (
            <div className="auth-group">
                <label 
                    className="auth-label" 
                    data-reference={this.props.name}
                    data-state="none"
                    data-error={this.state.handleError}
                    style={this.state.errorTarget ? {'color': '#B22222'} : {'color': ''}}
                >
                    {this.props.title}
                </label>
                <input 
                    type={this.props.type} 
                    name={this.props.name} 
                    className="auth-input" 
                    defaultValue={this.props.value} 
                    autoComplete="on"
                    data-available={this.state.isAvailable}
                    onKeyUp={this.checkInput} 
                    onBlur={this.handleBlur}
                />
                <div className="auth-input_box">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Input;