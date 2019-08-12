import React from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import AutoSize from "autosize";

// Utils
    import Loader from "./../../utils/Loader";

class Chat extends React.Component {
    _isMounted = false;

    /**
     * @param { Boolean } this.props.expand It means if this component is full window
     * @param { Boolean } this.props.hidden It means if the component is hidden
     */

    static propTypes = {
        expand: PropTypes.bool,
        hidden: PropTypes.bool
    }

    constructor(props) {
        super(props);
        
        /**
         * @param { Boolean } status Chat Status Indicator
         * @param { String } currentTab Custom Tab
         */
        this.state = {
            status: false,
            currentTab: "@channels"
        };

        // Binding methods
        this.fullscreenHandler = this.fullscreenHandler.bind(this);

        // Create Ref, parent can access now child methods
        this.child = React.createRef();
    }

    /**
     * If the User clicks inside the padding, it removes the fullscreen
     * 
     * @param { Object } e Event Object 
     */

    fullscreenHandler(e) {
       if(e.target === document.querySelector(".chat--fullscreen")) { 
            this.props.handler(e, "minify");
       }
    }
    
    componentDidMount() {
        this._isMounted = true;

        // Set active tab (URL) with location.hash
        if(location.href.split("/").slice(-1)[0] !== "dashboard") {
            this.setState({
                currentTab: location.href.split("/").slice(-1)[0]
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { status, hidden, expand, addClass, handler } = this.props;
        const { currentTab } = this.state;

        return (
            <div className={`dashboard-body__box--wrapper col-m-8 ${addClass}`} style={hidden ? {display: "none"} : {}} onClick={this.fullscreenHandler}>
                <div className="dashboard-body__box chat" data-status={status}>
                    {/* Main Content */}
                    <div className="col-s-4 chat__sidebar">
                        <div className="col-s-2 chat__sidebar-side">

                        </div>
                        <div className="col-s-10 chat__sidebar-main">
                            <ChatTab expand={expand} icon="" title="Channels" locationTab="@channels" ref={this.child} />
                            <ChatTab expand={expand} icon="" title="Messages" locationTab="@messages" ref={this.child} />                            
                            <Link to={expand ? "/dashboard" : "/dashboard/chat/@channels#fullscreen"} className="chat__sidebar-footer interface" data-action={expand ? "minify" : "expand"}>
                                <i className="fas sm-text">{expand ? "" : ""}</i>
                                <span className="chat__sidebar-footer-text sm-text">{expand ? "Minify Chat" : "Expand Chat"}</span>
                            </Link>
                        </div>
                    </div>
                    <HandleChatInterface currentTab={currentTab} />
                    {/* Not Available */}
                    <div className="chat__support--wrapper" data-status={status}>
                        <div className="chat__support inline-vh">
                            {status ? null : <Loader style={{position: "static"}} />}
                            <h2 className="chat__support-title">The chat will come soon, please wait.</h2>
                            <h3>A problem with the loading? <span className="highlight">Contact the support!</span></h3>
                        </div>
                    </div>
                    {expand ? 
                    <div className="chat__leave-button--wrapper interface">
                        <div className="chat__leave-button" data-action="minify" onClick={handler}>
                            <div className="tooltip--permanent--key-helper text">ESC</div>
                            <i className="fas"></i>
                        </div>
                    </div>
                    : null}
                </div>
            </div>
        );
    }
}

class ChatTab extends React.Component {
    constructor(props) {
        super(props);

        this.setActiveTab = this.setActiveTab.bind(this);
    }

    /**
     * Sets active tab, removes last active
     * 
     * @param { Object } e Event Object
     */

    setActiveTab(e) {
        // Convert Synthetic Event from React
        e.persist();

        const currentTab = e.currentTarget;

        const tabs = document.querySelectorAll(`[data-reference="${currentTab.getAttribute("data-reference")}"][data-location-tab]`);
        const selectionClass = "chat__box-active";

        Array.prototype.forEach.call(tabs, tab => {
            new Promise((res) => {
                // Removes last active tab
                tab.classList.remove(selectionClass);

                res(true);
            })
            .then(() => {
                // Sets active tab
                currentTab.classList.add(selectionClass);
            });
        });
    }

    render() {
        const { expand, icon, title, locationTab } = this.props;

        // Fullscreen?
        if(expand) {
            return (
                <Link to={"/dashboard/chat/@" + locationTab + location.hash} className="chat__box interface text" data-reference="chat-category" data-location-tab={locationTab}>
                    <i className="chat__box-icon fas">{icon}</i>
                    <span className="chat__box-title">{title}</span>
                </Link>
            );
        } else {
            return (
                <div to={"/dashboard/chat/@" + locationTab + location.hash} className="chat__box interface text" data-reference="chat-category" data-location-tab={locationTab}>
                    <i className="chat__box-icon fas">{icon}</i>
                    <span className="chat__box-title">{title}</span>
                </div>
            );
        }
    }
}

class HandleChatInterface extends React.Component {
    static propTypes = {
        currentTab: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props);
    }

    render() {
        const { currentTab } = this.props;

        return (
            <div className="col-s-8 chat__area--wrapper">
                {currentTab === "@messages" && <ChatInterfaceSending />}
                {currentTab === "@channels" && <ChatInterfaceChannels />}
            </div>
        );
    }
}

class ChatInterfaceSending extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const textarea = document.querySelectorAll(".chat__area-textarea");
        AutoSize(textarea);
    }

    render() {
        return (
            <div className="chat__area">
                <div className="chat__area-heading"></div>
                <div className="chat__area-body">
                    <div className="chat__area-textarea--wrapper text">
                        <textarea className="chat__area-textarea" rows="1"></textarea>
                    </div>
                </div>
            </div>
        );
    }
}

class ChatInterfaceChannels extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="chat__area">
                <div className="chat__area-heading"></div>
                <div>

                </div>
            </div>
        );
    }
}

export default withRouter(Chat);