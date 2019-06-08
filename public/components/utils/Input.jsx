import React, { Component } from 'react';
import PropTypes            from 'prop-types';

class Input extends Component {
    static defaultProps = {
        form: '',
        title: 'Default title',
        name: 'default-title',
        minLength: 6,
        maxLength: 52,
        errorTarget: undefined,
        pwViewer: false
    }

    /**
     * @param { String } this.props.form        Define reference form
     * @param { String } this.props.title       Define title label
     * @param { String } this.props.name        Define reference name, name attr
     * @param { Number } this.props.minLength   Equal OR Greater, accepted
     * @param { Number } this.props.maxLength   Equal OR Less, accepted
     * @param { Object } this.props.rule
     *  @param { String } this.props.rule.type                        Define rule type between Regex | Match
     *  @param { String || RegExp || Object } this.props.rule.content Define rule content
     *  @param { String } this.props.rule.error                       Define error callback
     * @param { String } this.props.errorTarget Define error target (reference label)
     * @param { Boolean } this.props.pwViewer   Define if it's a mirror password input
     */
    
    static propTypes = {
        form: PropTypes.string.isRequired,
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
            error: PropTypes.string,
        }).isRequired,
        errorTarget: PropTypes.string,
        pwViewer: PropTypes.bool
    }

    constructor(props) {
        super(props);

        this.state = {
            currentLabel  : null,
            currentMsgBox : null,
            currentInput  : null,
            handleError   : false,
            ruleType      : "",
            ruleContent   : null,
            isAvailable   : false,
            errorTarget   : false,
            errorTarget: undefined
        }

        this.checkInput         = this.checkInput.bind(this);
        this.handleBlur         = this.handleBlur.bind(this);
        this.displayMessage     = this.displayMessage.bind(this);
        this.inputRemoveMessage = this.inputRemoveMessage.bind(this);
        this.handleView         = this.handleView.bind(this);
    }

    componentDidMount() {
        this.setState({
            currentLabel : document.querySelector(`label[data-reference="${this.props.name}"]`),
            currentMsgBox: document.querySelector(`span#form-message_text[data-reference="${this.props.name}"]`),
            currentInput : document.getElementsByName(this.props.name)[0],
            ruleType     : this.props.rule.type,
            ruleContent  : this.props.rule.content
        });

        // If the page has been refresh, get window.CONF.params
        if(window.CONF.params.errorTarget !== "" && this.props.name == window.CONF.params.errorTarget) {
            this.setState({
                errorTarget: true
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        // When errorTarget changes, so update state
        if(nextProps.errorTarget !== this.props.errorTarget || this.state.errorTarget === undefined) {
            this.setState({
                errorTarget: nextProps.errorTarget 
            });
        }
    }

    componentWillUnmount() {
        const
            inputs   = document.querySelectorAll('.form-input'),
            pwViewer = document.getElementById('view-password');

        pwViewer.removeEventListener("click", this.handleView, false);

        // Get each input
        Array.prototype.forEach.call(inputs, input => {
            input.removeEventListener("keyup", this.checkInput, false);
            input.removeEventListener("blur", this.handleBlur, false);
        });
    }

    checkInput() {
        // Set Negative Color
        let
            negativeColor = "#B22222";

        if(this.state.currentInput.value == '') {
            this.inputRemoveMessage();
            return;
        }

        // Verify minLength & maxLength
        if(this.state.currentInput.value.length < this.props.minLength || this.state.currentInput.value.length > this.props.maxLength) {
            this.setState({
                handleError: true,
                isAvailable: false
            });
            
            // Negative color
            this.state.currentLabel.style.color = negativeColor;

            this.displayMessage(this.props.name, 'error', `Must contain between ${this.props.minLength} to ${this.props.maxLength} characters.`);
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

                        this.inputRemoveMessage();
                    } else if(this.state.ruleContent.test(this.state.currentInput.value) === false) {
                        this.setState({
                            handleError: true,
                            isAvailable: false
                        });
                        this.state.currentLabel.style.color = negativeColor;
                        
                        this.displayMessage(this.props.name, 'error', this.props.rule.error ? this.props.rule.error : null);
                    }
                    break;
                case 'Match':
                    if(document.getElementsByName(this.state.ruleContent)[0].value == this.state.currentInput.value) {
                        this.setState({
                            handleError: false,
                            isAvailable: true
                        });
                        this.state.currentLabel.style.color = "";
                        
                        this.inputRemoveMessage();
                    } else {
                        this.setState({
                            handleError: true,
                            isAvailable: false
                        });
                        this.state.currentLabel.style.color = negativeColor;

                        this.displayMessage(this.props.name, 'error', this.props.rule.error ? this.props.rule.error : null);
                    }
                    break;
                default:
                    window.CONF.env == 'development' ? console.warn('Any rule ?') : false;
                    break;
            }
        }
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
            label  = document.querySelector(`label[data-reference="${target}"`),
            msgBox = document.querySelector(`span#form-message_text[data-reference="${target}"`),
            box    = label.parentNode.querySelector('.form-input_box');

        const 
            msgWrapper = document.createElement('div'),
            msgCross   = document.createElement('span');

        new Promise(async (res, rej) => {
            // Get all children of box
            Array.prototype.forEach.call([].slice.call(box.children), child => {
                const
                    childClasses = [].slice.call(child.classList);

                // Not the cross
                if(childClasses.indexOf('form-message_wrapper') === -1) {
                    // Display: none for all except the cross
                    child.setAttribute('data-display', 'none');
                    child.style.display = 'none';
                } else {
                    box.removeChild(child);
                }
            });

            // Message Wrapper
            msgWrapper.setAttribute('class', `form-message_wrapper`);
            msgWrapper.setAttribute('data-reference', target);

            // Message Cross
            msgCross.setAttribute('class', `fas sm-text form-message_icon form-message--${type}`);
            msgCross.textContent = '';

            // Message Text
            msgBox.innerHTML = ` - <span class="form-message_text">${message}</span>`;

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
            msgBox = this.state.currentMsgBox;

        // Reinitialize its title
        msgBox.innerHTML = '';

        // Not undefined so...
        const
            label  = document.querySelector(`label[data-reference="${this.props.name}"`),
            box    = label.parentNode.querySelector('.form-input_box');

        // Each children so...
        Array.prototype.forEach.call([].slice.call(box.children), child => {
            const
                childClasses = [].slice.call(child.classList);

            // Not the cross
            if(childClasses.indexOf('form-message_wrapper') === -1) {
                // Hidden all except the cross
                child.setAttribute('data-display', 'block');
                child.style.display = 'block';
            } else {
                box.removeChild(child);
            }

            // Remove errorTargeter
            this.setState({
                errorTarget: undefined
            });
        });
    }

    handleView() {
        try {
            const
                pwViewer = document.getElementById('view-password'),
                pwInput  = document.getElementsByName('password')[0];

            const 
                pwRInput = document.getElementsByName('r-password')[0];

            if(pwViewer.getAttribute('data-state') == 'hidden') {
                // Eye is closed
                pwViewer.innerHTML = "";
                pwViewer.setAttribute('data-state', 'visible');

                // View inputs
                pwInput.setAttribute('type', 'text');
                pwRInput !== undefined ? pwRInput.setAttribute('type', 'text') : false;
            } else {
                // Eye is open
                pwViewer.innerHTML = "";
                pwViewer.setAttribute('data-state', 'hidden');
                
                // Hide inputs
                pwInput.setAttribute('type', 'password');
                pwRInput !== undefined ? pwRInput.setAttribute('type', 'password') : false;
            }
        } catch (e) {}
    }

    render() {
        const { name, title, type, value, pwViewer } = this.props;
        const { handleError, errorTarget, isAvailable } = this.state;

        return (
            <div className="form-group">
                <label 
                    className="form-label" 
                    data-reference={name}
                    data-state="none"
                    data-error={handleError}
                    style={errorTarget ? {'color': '#B22222'} : {'color': ''}}
                >
                    {title}
                    <span id="form-message_text" className="form-message_text" data-reference={name}></span>
                </label>
                <input 
                    type={type} 
                    name={name} 
                    className="form-input" 
                    defaultValue={value} 
                    autoComplete="on"
                    data-available={isAvailable}
                    onKeyUp={this.checkInput} 
                    onBlur={this.handleBlur}
                />
                <div className="form-input_box">
                    {type === 'password' && pwViewer ? 
                        <div 
                            id="view-password" 
                            className="far fa-2x interface" 
                            data-state="hidden" 
                            onClick={this.handleView}>
                            
                        </div> 
                        : null}
                </div>
            </div>
        );
    }
}

export default Input;