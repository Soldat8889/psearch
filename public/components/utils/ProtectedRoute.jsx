import React                                   from 'react';
import PropTypes                               from 'prop-types';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import axios                                   from 'axios';

class ProtectedRoute extends React.Component {
    _isMounted = false;

    static defaultProps = {
        Component: {},
        path     : '/',
        redirect : '/'
    }

    static propTypes = {
        Component: PropTypes.func.isRequired,
        path     : PropTypes.string.isRequired,
        redirect : PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            isAuthed : undefined,
            isLoading: true,
        }
    }

    componentDidMount() {
        this._isMounted = true;

        axios
            .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/auth/user`)
            .then((res) => {
                if(this._isMounted) {
                    this.setState({
                        isAuthed : res.data,
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
        let { Component, path, redirect, rule } = this.props;
        let { isAuthed, isLoading }             = this.state;

        if(isLoading === false) {
            return (
                <Route 
                    path={path}
                    component={
                        props =>
                        isAuthed == rule ? (
                            <Switch>
                                <Redirect
                                    to={redirect}
                                />
                            </Switch>
                        ) : (
                            <Component {...props} />
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