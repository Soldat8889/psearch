import React                                   from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import PropTypes                               from 'prop-types';
import axios                                   from 'axios';

// Routes
import Homepage       from "./Homepage";
import LangSelect     from "./LangSelect";
import Authentication from "./Authentication";
import Dashboard      from './Dashboard';
import Error          from "./Error";

// Common
import Helmet from "./../common/layouts/Header/Helmet";
import Init   from "../common/layouts/Footer/Init";

class Routing extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Switch>
                <Route 
                    exact 
                    path="/" 
                    component={
                        props => ( 
                        <div className="rooting">
                            <Init {...props} />
                            <Helmet {...props}
                                name="index"
                            />
                            <Homepage {...props} />
                        </div> )
                    } 
                />
                <ProtectedRoute 
                    path="/login" 
                    redirect="/dashboard"
                    needAuth={false}
                    Component={
                        props => ( 
                        <div className="rooting">
                            <Init {...props} />
                            <Helmet {...props}
                                name="login"
                            />
                            <Authentication {...props} type="login" />
                        </div> )
                    } 
                />
                <ProtectedRoute 
                    path="/signup" 
                    redirect="/dashboard"
                    needAuth={false}
                    Component={
                        props => ( 
                        <div className="rooting">
                            <Init {...props} />
                            <Helmet {...props}
                                name="signup"
                            />
                            <Authentication {...props} type="signup" /> 
                        </div> )
                    } 
                />
                <ProtectedRoute 
                    path="/dashboard/:componentInterface?/:tab?" 
                    redirect="/login"
                    needAuth={true}
                    Component={
                        props => ( 
                        <div className="rooting">
                            <Init {...props} />
                            <Helmet {...props}
                                name="dashboard"
                            />
                            <Dashboard {...props} />
                        </div> )
                    } 
                />
                <Route 
                    path="/lang-select" 
                    component={
                        props => ( 
                        <div className="rooting">
                            <Init {...props} />
                            <Helmet {...props}
                                title="pSearch: Select your language"
                                description="Select the default language beetween the french and the english."
                            />
                            <LangSelect {...props} />
                        </div> )
                    } 
                />
                <Route 
                    component={
                        props => ( 
                        <div className="rooting">
                            <Init {...props} />
                            <Helmet {...props}
                                name={['errors']['404']}
                            />
                            <Error {...props} 
                                type={404} 
                            />
                        </div> )
                    } 
                />
            </Switch>
        );
    }
}

class ProtectedRoute extends React.Component {
    _isMounted = false;
    abortController = new AbortController();

    static propTypes = {
        path     : PropTypes.string.isRequired,
        Component: PropTypes.func.isRequired,
        redirect : PropTypes.string.isRequired,
        needAuth : PropTypes.bool.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            isReady : false,
            isAuthed: undefined,
            user    : undefined
        }
    }

    componentDidMount() {
        this._isMounted = true;

        // Call API User
        axios
            .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/auth/user`, { 
                signal: this.abortController.signal, 
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }, 
            })
            .then((r) => {
                // Mounted?
                if(this._isMounted) {
                    // r.data isn't null/underfined?
                    if(r.data) {
                        this.setState({
                            isAuthed: true,
                            user    : r.data,
                            isReady : true
                        });
                    } else {
                        this.setState({
                            isAuthed: false,
                            user    : false,
                            isReady : true
                        });
                    }
                }
            })
            .catch((e) => {
                window.CONF.env == "development" ? console.warn(`DEVELOPMENT MODE => ${e}`) : null;
            });
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.abortController.abort();
    }

    render() {
        let { path, Component, redirect, propsToChild, needAuth } = this.props;
        let { isReady, isAuthed }             = this.state;

        if(isReady) {
            return (
                <Route 
                    path={path}
                    component={
                        props =>
                            isAuthed !== needAuth ? (
                                <Switch>
                                    <Redirect
                                        to={redirect}
                                    />
                                </Switch>
                            ) : (
                                <Component 
                                    {...props} 
                                    parentProps={propsToChild}
                                />
                            )
                        }
                />
            );
        } else {
            return null;
        }
    }
}

export default withRouter(Routing);