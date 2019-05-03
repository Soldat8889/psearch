import React, { Component } from 'react';
import ReactGA from 'react-ga';
import axios from 'axios';
import { Route, BrowserRouter as Router, Switch, withRouter } from 'react-router-dom';

// Packages
import MobileDetect from 'mobile-detect';

// Containers
import Homepage from "./views/Homepage";
import LangSelect from "./views/LangSelect";
import Authentication from "./views/Authentication";
import Dashboard from './views/Dashboard';
import Error from "./views/Error";

// Common
import Helmet from "./common/layouts/Header/Helmet";
import Init from "./common/layouts/Body/Init";
import PubDisplay from "./common/layouts/Footer/PubDisplay";

// Utils
import ProtectedRoute from "./utils/ProtectedRoute";
import GetCookie from "../client/utils/getCookie";

// GOOGLE ANALYTICS
if(window.CONF.env === 'production') {
    ReactGA.initialize('UA-106638919-2');
    ReactGA.pageview(window.location.pathname + window.location.search);
}

class App extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            isReady    : false,
            config     : null,
            manifest   : null,
            apiResponse: "",
            isAuthed   : undefined
        }

        this.callAPI    = this.callAPI.bind(this);
        this.controlPub = this.controlPub.bind(this);
    }

    callAPI() {
        axios
            .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/testAPI`)
            .then((res) => { 
                if(this._isMounted) {
                    this.setState({
                        apiResponse: res.data
                    });
                }
            })
            .catch((e) => {
                window.CONF.env == "development" ? console.warn(`DEVELOPMENT MODE => ${e}`) : null;
            });
    }

    controlPub() {
        // Detect if the User is using his phone (not a tablet)
        let md = new MobileDetect(window.navigator.userAgent);

        if(!md.tablet() && md.mobile()) {
            // If yes => no pub
            return true;
        } else {
            try {
                // If no => Verify if he has already decline pub
                if(GetCookie('advDisabling') == "true") {
                    // Yes, he did => no pub
                    return true;
                } else {
                    // No, he didn't => pub
                    return false;
                }
            } catch (e) {
                window.CONF.env == "development" ? console.warn(`DEVELOPMENT MODE => ${e}`) : null;
                return false;
            }
        }
    }

    componentDidMount() {
        this._isMounted = true;

        this.callAPI();

        try {
            let
                JSONFile;

            GetCookie('lang') !== null ? JSONFile = `/assets/config/config-${GetCookie('lang')}.json` : JSONFile = "/assets/config/config-en.json";
            Promise.all(
            [
                new Promise((res, rej) => {
                    axios
                        .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/auth/isAuth`)
                        .then((r) => {
                            this.setState({isAuthed: r.data});
                            res(r.data)
                        })
                        .catch((e) => {
                            window.CONF.env == "development" ? console.warn(`DEVELOPMENT MODE => ${e}`) : null;
                            rej(`DEVELOPMENT MODE => ${e}`);
                        });
                }),
                new Promise((res, rej) => {
                    fetch(JSONFile, { 
                        method: 'GET',
                        headers: {
                            'X-Requested-With': 'xmlhttprequest'
                        }
                    }).then((response) => {
                        if(response.status !== 200) {
                            rej(`Network Error <<Fetch>> : ${response.status}`);
                            throw new Error(`Network Error <<Fetch>> : ${response.status}`);
                        }

                        if(response.ok) {
                            response.json().then((data) => {
                                this.setState({
                                    config: JSON.stringify(data)
                                });
                                res(data);
                            });
                        }
                    })
                    .catch((rej) => {
                        rej(`Network Error <<Fetch>> : ${response.status}`);
                        throw new Error(`Problem <<Fetch>> : ${rej}`);
                    })
                }), 
                new Promise((res, rej) => {
                    fetch('/assets/dist/manifest.json', {
                        method: 'GET',
                        headers: {
                            'X-Requested-With': 'xmlhttprequest'
                        }
                    }).then((response) => {
                        if(response.status !== 200) {
                            rej(`Network Error <<Fetch>> : ${response.status}`);
                            throw new Error(`Network Error <<Fetch>> : ${response.status}`);
                        }

                        if(response.ok) {
                            response.json().then((data) => {
                                this.setState({
                                    manifest: JSON.stringify(data)
                                });
                                res(data);
                            });
                        }
                    })
                    .catch((rej) => {
                        rej(`Network Error <<Fetch>> : ${response.status}`);
                        throw new Error(`Problem <<Fetch>> : ${rej}`);
                    });
                })
            ])
            .then(() => {
                if(this._isMounted) {
                    this.setState({
                        isReady: true
                    });
                }
            });
        } catch(e) {
            throw new Error(e);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        if(this.state.isReady) {
            return (
                <div className="app" data-is-auth={this.state.isAuthed}>
                    <PubDisplay isDisabled={this.controlPub()} />
                    <Router isAuthed={this.state.isAuthed}>
                        {/* Routing */}
                        <div className="rooting">
                            <Switch>
                                <Route 
                                    exact 
                                    path="/" 
                                    component={
                                        props => ( 
                                        <div>
                                            <Init {...props} 
                                                manifest={this.state.manifest}
                                            />
                                            <Helmet {...props}
                                                manifest={this.state.manifest}
                                                title={JSON.parse(this.state.config)['title']['index']}
                                                description={JSON.parse(this.state.config)['description']['index']}
                                            />
                                            <Homepage {...props} 
                                                config={this.state.config} 
                                                manifest={this.state.manifest}
                                            />
                                        </div> )
                                    } 
                                />
                                <ProtectedRoute 
                                    path="/login" 
                                    redirect="/dashboard"
                                    isAuthed={this.state.isAuthed}
                                    rule={true}
                                    Component={
                                        props => ( 
                                        <div>
                                            <Init {...props} 
                                                manifest={this.state.manifest}
                                            />
                                            <Helmet {...props}
                                                manifest={this.state.manifest}
                                                title={JSON.parse(this.state.config)['title']['login']}
                                                description={JSON.parse(this.state.config)['description']['login']}
                                            />
                                            <Authentication {...props} 
                                                config={this.state.config} 
                                                manifest={this.state.manifest}
                                                type="login"
                                            />
                                        </div> )
                                    } 
                                />
                                <ProtectedRoute 
                                    path="/dashboard" 
                                    redirect="/login"
                                    isAuthed={this.state.isAuthed}
                                    rule={false}
                                    Component={
                                        props => ( 
                                        <div>
                                            <Init {...props} 
                                                manifest={this.state.manifest}
                                            />
                                            <Helmet {...props}
                                                manifest={this.state.manifest}
                                                title={JSON.parse(this.state.config)['title']['dashboard']}
                                                description={JSON.parse(this.state.config)['description']['dashboard']}
                                            />
                                            <Dashboard {...props} 
                                                config={this.state.config} 
                                                manifest={this.state.manifest}
                                                type="login"
                                            />
                                        </div> )
                                    } 
                                />
                                <ProtectedRoute 
                                    path="/signup" 
                                    redirect="/dashboard"
                                    isAuthed={this.state.isAuthed}
                                    rule={true}
                                    Component={
                                        props => ( 
                                        <div>
                                            <Init {...props} 
                                                manifest={this.state.manifest}
                                            />
                                            <Helmet {...props}
                                                manifest={this.state.manifest}
                                                title={JSON.parse(this.state.config)['title']['signup']}
                                                description={JSON.parse(this.state.config)['description']['signup']}
                                            />
                                            <Authentication {...props} 
                                                config={this.state.config} 
                                                manifest={this.state.manifest}
                                                type="signup"
                                            /> 
                                        </div> )
                                    } 
                                />
                                <Route 
                                    path="/lang-select" 
                                    component={
                                        props => ( 
                                        <div>
                                            <Init {...props} 
                                                manifest={this.state.manifest}
                                            />
                                            <Helmet {...props}
                                                manifest={this.state.manifest}
                                                title="pSearch: Select your language"
                                                description="Select the default language beetween the french and the english."
                                            />
                                            <LangSelect {...props} 
                                                config={this.state.config} 
                                                manifest={this.state.manifest}
                                            />
                                        </div> )
                                    } 
                                />
                                <Route 
                                    component={
                                        props => ( 
                                        <div>
                                            <Init {...props} 
                                                manifest={this.state.manifest}
                                            />
                                            <Helmet {...props}
                                                manifest={this.state.manifest}
                                                title={JSON.parse(this.state.config)['title']['errors']['404']}
                                                description={JSON.parse(this.state.config)['description']['errors']['404']}
                                            />
                                            <Error {...props} 
                                                typeError={404} 
                                                config={this.state.config} 
                                                manifest={this.state.manifest}
                                            />
                                        </div> )
                                    } 
                                />
                            </Switch>
                        </div>
                    </Router>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default withRouter(App);