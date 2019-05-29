import React from 'react';
import axios from 'axios';
import socketIoClient from 'socket.io-client';
import { withRouter } from 'react-router-dom';

class Chat extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        
        this.state = {
            status: false,
            channel01: {},
            socket: socketIoClient(`http://localhost:8000`)
        }
    }
    
    componentDidMount() {
        let { socket } = this.state;
        this._isMounted = true;

        if(this._isMounted) {
            // Socket Status
            socket.on("status", status => this.setState({status: status}));
        }

        let 
            textarea = document.getElementById('typing-message--01').textContent,
            send     = document.getElementById('sending-message--01');

        send.addEventListener('click', () => {
            socket.emit("channel01", textarea)
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { user } = this.props;

        return (
            <div>
                <h1>{this.state.status ? "OK" : "WAITING"}</h1>
                <h1>Hello! You're {user.Username_User}</h1>
                <textarea id="typing-message--01"></textarea>
                <button id="sending-message--01" className="button text">Send message</button>
            </div>
        );
    }
}

export default withRouter(Chat);