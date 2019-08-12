import React from "react";
import axios from "axios";

export const URL_API_AUTH = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/auth/user`;

export const UserContext = React.createContext();

export default class UserProvider extends React.Component {
    _isMounted = false;
    // Abort axios
    abortController = new AbortController();

    constructor(props) {
        super(props);

        this.state = {
            user: false
        };
    }

    componentDidMount() {
        this._isMounted = true;

        // Update the this.state.user, verify if the user is logged
        // Call API User
        axios
            .get(URL_API_AUTH, { signal: this.abortController.signal })
            .then((r) => {
                this.setState({ user: r.data });
            });
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.abortController.abort();
    }

    render() {
        const { user } = this.state;
        
        return (
            <UserContext.Provider value={user}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}