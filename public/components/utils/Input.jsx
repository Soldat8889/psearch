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
        maxLength: 52
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
        }).isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            currentLabel: null,
            currentInput: null,
            handleError : false,
            ruleType    : "",
            ruleContent : null,
            isAvailable : false,
            errorTarget : false
        }

        this.checkInput = this.checkInput.bind(this);
        this.handleBlur  = this.handleBlur.bind(this);
    }

    componentDidMount() {
        this.setState({
            currentLabel: document.querySelector(`[data-reference="${this.props.name}"]`),
            currentInput: document.getElementsByName(this.props.name)[0],
            ruleType    : this.props.rule.type,
            ruleContent : this.props.rule.content
        });

        if(window.CONF.params.errorTarget !== "" && this.props.name == window.CONF.params.errorTarget) {
            this.setState({
                errorTarget: true
            });
        }
    }

    componentWillUnmount() {
        document.removeEventListener("keyup", this.checkInput, false);
        document.removeEventListener("blur", this.handleBlur, false);
    }

    checkInput() {
        let
            negativeColor = "#B22222";

        if(this.state.currentInput.value.length < this.props.minLength || this.state.currentInput.value.length > this.props.maxLength) {
            this.setState({
                handleError: true,
                isAvailable: false
            });
            this.state.currentLabel.style.color = negativeColor;
        } else {
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
    }

    handleBlur() {
        this.checkInput();
        
        if(this.state.currentInput.value == "") {
            this.setState({
                handleError: false,
                isAvailable: false
            });
            this.state.currentLabel.style.color = "";
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
                    data-available={this.state.isAvailable}
                    onKeyUp={this.checkInput} 
                    onBlur={this.handleBlur}
                />
                {this.props.children ? <div className="auth-input_box">{this.props.children}</div> : false}
            </div>
        );
    }
}

export default Input;