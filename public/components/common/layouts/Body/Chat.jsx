import React from 'react';
import axios from 'axios';
import socketIoClient from 'socket.io-client';
import { withRouter } from 'react-router-dom';

class Chat extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        
        this.state = {
            socket: socketIoClient(`http://localhost:8000`),
            status: false,
            channels: {
                channel01: {}
            },
            currentLocationTab: "recent-messages"
        }

        // Binding methods
        this.handleLocationTabs = this.handleLocationTabs.bind(this);
        this.setActiveTab       = this.setActiveTab.bind(this);
    }

    handleLocationTabs(ref) {
        const { currentLocationTab } = this.state;

        const
            locationTabsIntefaces = document.querySelectorAll(`[data-reference="${ref}"][data-location-tab]`),
            activeTab = document.querySelector(`[data-reference="${ref}"][data-location-tab=${currentLocationTab}]`);

        // Visual active tab
        this.setActiveTab(locationTabsIntefaces, activeTab);

        Array.prototype.forEach.call(locationTabsIntefaces, el => {
            const locationTab = el.getAttribute('data-location-tab');

            el.addEventListener('click', e => {
                new Promise((res, rej) => {
                    this.setState({
                        currentLocationTab: locationTab
                    });
                    
                    res(locationTab);
                })
                .then((v) => {
                    this.setActiveTab(locationTabsIntefaces, document.querySelector(`[data-reference="${ref}"][data-location-tab="${v}"]`));
                });
            }, false);
        });
    }

    setActiveTab(els, active) {
        Array.prototype.forEach.call(els, el => {
            el === active ? el.classList.add('chat-box--active') : el.classList.remove('chat-box--active');
        });
    }
    
    componentDidMount() {
        let { socket } = this.state;
        this._isMounted = true;

        if(window.CONF.env === "production") {
            this.setState({
                socket: socketIoClient(`https://psearch.alwaysdata.net`)
            });
        }

        if(this._isMounted) {
            // Socket Status
            socket.on("status", status => this.setState({status: status}));
            console.log("Socket.io Client is OK!");
        }

        // Handle Chat Category
        this.handleLocationTabs("chat-category");

        // let 
        //     textarea = document.getElementById('typing-message--01').textContent,
        //     send     = document.getElementById('sending-message--01');

        // send.addEventListener('click', () => {
        //     socket.emit("channel01", textarea)
        // });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { user } = this.props;

        return (
            <div className="dashboard-body_box--wrapper col-m-8">
                <div className="dashboard-body_box chat" data-status={this.state.status}>
                    {/* 
                        <h1>{this.state.status ? "OK" : "WAITING"}</h1>
                        <h1>Hello! You're {user.Username_User}</h1>
                        <textarea id="typing-message--01"></textarea>
                        <button id="sending-message--01" className="button text">Send message</button>
                    */}
                    <div className="col-s-5 chat-sidebar">
                        <div className="col-s-6 chat-sidebar--channels">
                            <ChatBoxCategory icon="" title="Messages" locationTab="recent-messages" />
                            <ChatBoxCategory icon="" title="Channels" locationTab="public-channels" />
                        </div>
                        <div className="col-s-6 chat-sidebar--recently">
                            
                        </div>
                    </div>
                    <div className="col-s-7 chat-area--wrapper">
                        <div className="chat-area">
                            <div className="chat-area--heading"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class ChatBoxCategory extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { icon, title, locationTab } = this.props;

        return (
            <div className="chat-box interface text" data-reference="chat-category" data-location-tab={locationTab}>
                <i className="fas chat-box--icon">{icon}</i>
                <span className="chat-box--title">{title}</span>
            </div>
        );
    }
}

export default withRouter(Chat);