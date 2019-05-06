import React                                   from 'react';
import PropTypes                               from 'prop-types';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import axios                                   from 'axios';

class ProtectedRoute extends React.Component {
    _isMounted = false;

    static defaultProps = {
        Component: {},
        path     : '/',
        redirect : '/',
        state    : {}
    }

    static propTypes = {
        Component: PropTypes.func.isRequired,
        path     : PropTypes.string.isRequired,
        redirect : PropTypes.string.isRequired,
        state    : PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = {
            isAuthed : undefined,
            isLoading: true,
            user     : undefined
        }
    }

    componentDidMount() {
        this._isMounted = true;

        axios
            .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/auth/user`)
            .then((res) => {
                if(this._isMounted) {
                    if(res.data) {
                        this.setState({
                            isAuthed: true,
                            user    : res.data
                        });
                    } else {
                        this.setState({
                            isAuthed: false
                        });
                    }
                    this.setState({
                        isLoading: false
                    });
                }
            })
            .catch((e) => {
                window.CONF.env == "development" ? console.warn(`DEVELOPMENT MODE => ${e}`) : null;
            });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        let { Component, path, redirect, propsToChild, rule } = this.props;
        let { isAuthed, user, isLoading }             = this.state;

        if(isLoading === false) {
            return (
                <Route 
                    path={path}
                    component={
                        props =>
                        isAuthed == rule ? (
                            <Switch>
                                <Redirect
                                    to={{
                                        pathname: redirect
                                    }}
                                />
                            </Switch>
                        ) : (
                            <Component 
                                {...props} 
                                parentProps={propsToChild}
                                isAuthed={isAuthed}
                                user={user}
                            />
                        )
                    }
                />
            );
        } else {
            return false;
        }
    }
}

export default withRouter(ProtectedRoute);