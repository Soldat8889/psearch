/* eslint-disable no-async-promise-executor */
import React            from "react";
import { withRouter }   from "react-router-dom";
import axios            from "axios";

// Components
import Loader from "./../../utils/Loader";
import Input  from "./../../utils/Input";

class SignUp extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            submitState: "none",
            errorTarget: undefined,
            stage: 1,
            ready: false
        };

        // Link this to its child
        this.child = React.createRef();

        this.handleSubmit  = this.handleSubmit.bind(this);
        this.handleLoading = this.handleLoading.bind(this);
    }

    handleSubmit(e) {
        // Inputs
        let
            usernameInput  = document.getElementsByName("username")[0],
            emailInput     = document.getElementsByName("email")[0],
            passwordInput  = document.getElementsByName("password")[0];

        const target = e.target;
        
        e.preventDefault();
        target.setAttribute("disabled", true);
        target.style.transition = "none";

        this.setState({
            submitState: "loading"
        });

        switch(this.state.stage) {
            case 1:
                new Promise(async (res) => {
                    // Verify all inputs, are they no errors (defined by regex / limits)?
                    const inputsChecking = document.querySelectorAll(".form-input");
                    const checkingList = [];
        
                    const checkingListPush = new Promise(async (res) => {
                        Array.prototype.forEach.call(inputsChecking, inputChecking => {
                            let
                                inputCheckingAttribute = inputChecking.getAttribute("data-available");
            
                            checkingList.push(inputCheckingAttribute);
                        });
            
                        res(checkingList);
                    })
                    .catch((e) => {
                        window.CONF.env == "development" ? console.error("DEVELOPMENT => " + e) : false;
                    });
                
                    res(await checkingListPush);
                })
                .then(async (response) => {
                    // Catch all errors and apply color to inputs (which have errors)
                    const checkFalse = new Promise(async (res) => {
                        const authLabel = document.querySelectorAll(".form-label");
        
                        for(let i = 0, j = response.length; i < j; i++) {
                            if(response[i] == "false") {
                                authLabel[i].style.color = "#B22222";
                                res(false);
                            }
                        }
                        res(true);
                    });
        
                    new Promise(async (res) => {
                        res(await checkFalse);
                    })
                    .then(async (res) => {
                        // UX Timeout (just visual)
                        setTimeout(() => {
                            // If there"s at least one error
                            if(res == false) {
                                this.setState({
                                    submitState: "none"
                                });
                                target.removeAttribute("disabled");
                                target.style.transition = "";
                            } else {
                                console.log("FRONT END VERIFY => OK");
        
                                // Calling API
                                axios
                                    .post(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/auth/user`, {
                                        callType: "signup",
                                        username: usernameInput.value,
                                        email   : emailInput.value,
                                        password: passwordInput.value
                                    })
                                    .then(async res => {
                                        let
                                            data = res.data;
                                        
                                        if(data === "OK") {
                                            // We can submit if username & pw are okay and verified
                                            this.setState({
                                                submitState: "submit"
                                            });
                                            target.removeAttribute("disabled");
                                            target.style.transition = "";
                                            console.log("CALL API VERIFY => OK");
                                            console.log("SUBMIT");
        
                                            // Change Stage to 2 => Params User View
                                            this.setState({
                                                stage: 2
                                            });
                                        } else {
                                            // Display errors
                                            await this.child.current.child.current.child.current.displayMessage(data.errorTarget, "error", data.error);
        
                                            this.setState({
                                                submitState: "none",
                                                errorTarget: data.errorTarget
                                            });
                                            target.removeAttribute("disabled");
                                            target.style.transition = "";
                                            console.log("CALL API VERIFY => OK");
                                            console.log(data.error);
                                        }
                                    })
                                    .catch(e => {
                                        window.CONF.env == "development" ? console.warn(`DEVELOPMENT MODE => ${e}`) : null;
                                    });
                            }
                        }, 566); // One animation step timing
                    });
                })
                .catch((e) => {
                    window.CONF.env == "development" ? console.error("DEVELOPMENT => " + e) : false;
                });
                break;
            case 2:
                document.forms["signup"].submit();
                break;
        }
    }

    componentDidMount() {
        this._isMounted = true;

        this.setState({
            ready: true
        });

        let inputSubmit = document.getElementById("form-submit");

        inputSubmit.addEventListener("click", (e) => {
            this.handleSubmit(e);
        }, false);
    }

    componentWillUnmount() {
        this._isMounted = false;

        this.setState({
            ready: false
        });

        let inputSubmit = document.getElementById("form-submit");

        inputSubmit.removeEventListener("click", this.handleSubmit, false);
    }

    handleLoading() {
        if(this.state.submitState == "loading") {
            return (
                <Loader style={{position: "absolute"}} styleContent={{transform: "scale(0.6) translateY(8px)"}} />
            );
        } else {
            return (
                "SIGN UP"
            );
        }
    }

	render() {
        const { config } = this.props;
        const { stage, submitState, errorTarget, ready } = this.state;

        return (
            <div className="form-wrapper">
                <header className="form-header inline-vh">
                    <div className="form-header_banner"></div>
                    <h1 className="form-header_title">
                        SIGN UP<br />
                        Hi! Who are you?
                    </h1>
                </header>
                <fieldset className="form-inner">
                    <StagesRouting 
                        config={config}
                        stage={stage}
                        errorTarget={errorTarget}
                        ready={ready}
                        ref={this.child}
                    />
                    <div className="form-group inline-vh">
                        <button 
                            type="submit" 
                            id="form-submit" 
                            className="form-submit" 
                            data-state={submitState}
                            data-form="signup"
                        >
                            {this.handleLoading()}
                        </button>
                    </div>
                </fieldset>
            </div>
        );
    }
}

// Components
import BreadCrumb from "./../../utils/Breadcrumb";

class StagesRouting extends React.Component {
    constructor(props) {
        super(props);

        this.child = React.createRef();
    }

    componentDidMount() {
        const tabs = [].slice.call(document.querySelectorAll(".form-context"));

        const 
            n = tabs.filter(tab => tab.getAttribute("data-stage") != this.props.stage);

        Array.prototype.forEach.call(n, n => {
            n.style.display = "none";
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.stage !== this.props.stage) {
            const tabs = [].slice.call(document.querySelectorAll(".form-context"));

            const 
                n = tabs.filter(tab => tab.getAttribute("data-stage") != this.props.stage);
                const y = tabs.filter(tab => tab.getAttribute("data-stage") == this.props.stage);

            Array.prototype.forEach.call(y, y => {
                y.style.opacity = "0";
                y.style.transform = "translateX(-125%)";

                setTimeout(() => {
                    y.style.display = "none";
                }, 550);
            });

            Array.prototype.forEach.call(n, n => {
                n.style.opacity = "1";
                n.style.transform = "translateX(0)";

                setTimeout(() => {
                    n.style.display = "block";
                }, 550);
            });
        }
    }

    render() {
        const { stage, errorTarget, ready } = this.props;

        return (
            <div>
                <BreadCrumb 
                    name="Breadcrumb--SignUp"
                    currentStage={stage}
                    params={
                        {
                            stages: {
                                1: "Sign Up",
                                2: "Adding your preferences",
                                3: "Review your profile!"
                            }
                        }
                    }
                />
                <StageOne 
                    errorTarget={errorTarget}
                    ready={ready}
                    ref={this.child}
                />
                <StageTwo
                    errorTarget={errorTarget}
                    ready={ready}
                />
            </div>
        );
    }
}

class StageOne extends React.Component {
    constructor(props) {
        super(props);

        this.child = React.createRef();
    }

    render() {
        const { errorTarget } = this.props;

        return (
            <div className="form-context" data-form="signup" data-stage={1}>
                <Input 
                    form="signup"
                    title="Username" 
                    name="username"
                    type="text"
                    minLength={6}
                    maxLength={45}
                    rule={{
                        type: "Regex",
                        content: /([a-z0-9])*/gi
                    }}
                    value={window.CONF.params.username !== undefined ? window.CONF.params.username : ""}
                    ref={this.child}
                    apiErrorTarget={errorTarget}
                />
                <Input 
                    form="signup"
                    title="Email" 
                    name="email"
                    type="email"
                    minLength={3}
                    maxLength={254}
                    rule={{
                        type: "Regex",
                        content: /(?!.*\.{2})^([a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i,
                        error: "Must be an email."
                    }}
                    value={window.CONF.params.email !== undefined ? window.CONF.params.email : ""}
                    ref={this.child}
                    apiErrorTarget={errorTarget}
                />
                <Input 
                    form="signup"
                    title="Password" 
                    name="password"
                    type="password"
                    minLength={8}
                    maxLength={256}
                    rule={{
                        type: "Regex",
                        content: /(.*)*/gi
                    }}
                    ref={this.child}
                    apiErrorTarget={errorTarget}
                    pwViewer={true}
                />
                <Input 
                    form="signup"
                    title="Repeat Password" 
                    name="r-password"
                    type="password"
                    minLength={8}
                    maxLength={256}
                    rule={{
                        type: "Match",
                        content: "password",
                        error: "Must be the same password."
                    }}
                    ref={this.child}
                    apiErrorTarget={errorTarget}
                />
            </div>
        );
    }
}

class StageTwo extends React.Component {
    constructor(props) {
        super(props);

        // Binding method-s
        this.handlePreviewImage = this.handlePreviewImage.bind(this);
    }

    componentDidMount() {
        document.getElementById("avatar-upload").addEventListener("change", (e) => {
            this.handlePreviewImage(e.target);
        }, false);
    }

    handlePreviewImage(el) {
        if(el.files && el.files[0]) {
            const 
                reader    = new FileReader();
                const previewer = document.getElementById("avatar-preview");

            reader.addEventListener("load", (e) => {
                previewer.setAttribute("src", e.target.result);
            }, false);

            reader.readAsDataURL(el.files[0]);
        }
    }

    render() {
        return (
            <div className="form-context" data-form="signup" data-stage={2}>
                <h1>Choose your image</h1>
                <img id="avatar-preview" className="form-avatar" src="#" alt="Uploading Image Preview" />
                <input id="avatar-upload" type="file" name="avatar" />
            </div>
        );
    }
}

export default withRouter(SignUp);