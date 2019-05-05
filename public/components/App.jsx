import React, { Component } from 'react';
import ReactGA from 'react-ga';
import axios from 'axios';
import { BrowserRouter as Router, withRouter } from 'react-router-dom';

// Packages
import MobileDetect from 'mobile-detect';

// Router
import Routing from './views/Routing';

// Common
import PubDisplay from "./common/layouts/Footer/PubDisplay";

// Utils
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

        this.controlPub = this.controlPub.bind(this);
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

        try {
            let
                JSONFile;

            GetCookie('lang') !== null ? JSONFile = `/assets/config/config-${GetCookie('lang')}.json` : JSONFile = "/assets/config/config-en.json";
            Promise.all(
            [
                new Promise((res, rej) => {
                    axios
                        .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/auth/user`)
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
                <div className="app" data-is-auth={this.state.isAuthed ? true : false}>
                    <PubDisplay isDisabled={this.controlPub()} />
                    <Router isAuthed={this.state.isAuthed}>
                        <Routing 
                            manifest={this.state.manifest}
                            config={this.state.config}
                            isAuthed={this.state.isAuthed} 
                        />
                    </Router>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default withRouter(App);