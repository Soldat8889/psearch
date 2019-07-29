import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { BrowserRouter as Router, withRouter } from 'react-router-dom';

// Packages
import MobileDetect from 'mobile-detect';

// Router
import Routing from './routes/Routing';

// Common
import PubDisplay from "./components/app/layouts/Footer/PubDisplay";

// Utils
import GetCookie from "./assets/client/utils/getCookie";
import GetOffsetPosition from "./assets/client/utils/getOffsetPosition";

// GOOGLE ANALYTICS
if(window.CONF.env === 'production') {
    ReactGA.initialize('UA-106638919-2');
    ReactGA.pageview(window.location.pathname + window.location.search);
}

// Context API
import ConfigProvider from './context/ConfigContext';
import ManifestProvider from './context/ManifestContext';
import UserProvider from './context/UserContext';

class App extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            isReady : false
        }

        // Binding methods
        this.controlPub   = this.controlPub.bind(this);
        this.handleAnchor = this.handleAnchor.bind(this);
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

    handleAnchor() {
        setTimeout(() => {
            try {
                const hash = window.location.hash,
                      el   = document.querySelector(hash);
    
                // ScrollTo hash id
                if(hash) {
                    window.scroll({
                        top: GetOffsetPosition(el).top, 
                        left: window.scrollX, 
                        behavior: 'smooth'
                    });
                }
            } catch (e) {}
        }, 100);
    }

    componentWillUpdate(nextProps, nextState) {
        if(nextState.isReady !== this.state.isReady) {
            // ScrollTo the Anchor (normally, this is a native function => with the awaiting render, it does not work)
            this.handleAnchor();
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <ConfigProvider>
                <ManifestProvider>
                    <UserProvider>
                        <div className="app">
                            <PubDisplay isDisabled={this.controlPub()} />
                            <Router>
                                <Routing />
                            </Router>
                        </div>
                    </UserProvider>
                </ManifestProvider>
            </ConfigProvider>
        );
    }
}

export default withRouter(App);