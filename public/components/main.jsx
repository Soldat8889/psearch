import React from 'react';
import ReactDOM from 'react-dom';
import MetaTags from 'react-meta-tags';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';

// Containers
import Homepage from "./views/Homepage";
import LangSelect from "./views/LangSelect";
import Authentication from "./views/Authentication";
import Error from "./views/Error";

// Common
import PubDisplay from "./common/layouts/Body/PubDisplay";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isReady: false,
            config: null,
            manifest: null
        }

        this.getCookie = this.getCookie.bind(this);
    }

    getCookie(cname) {
        const name = cname + "=",
            decodedCookie = decodeURIComponent(document.cookie),
            ca = decodedCookie.split(';');

        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];

            while(c.charAt(0) == ' ') {
                c = c.substring(1);
            }

            if(c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        
        return null;
    }

    componentDidMount() {
        try {
            let
                JSONFile;

            this.getCookie('lang') !== null ? JSONFile = `/assets/config/config-${this.getCookie('lang')}.json` : JSONFile = "/assets/config/config-en.json";

            Promise.all(
            [
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
                this.setState({
                    isReady: true
                });
            });
        } catch(e) {
            throw new Error(e);
        }
    }

    render() {
        if(this.state.isReady) {
            return (
                <div className="app">
                    <PubDisplay isDisabled={/advDisabling=true/.test(document.cookie) ? true : false} />
                    <Router component={AppContainer}>
                        {/* Routing */}
                        <div className="rooting">
                            {/* Main[id="app"] */}
                            <Switch>
                                <Route 
                                    exact 
                                    path="/" 
                                    component={
                                        props => ( 
                                        <Homepage {...props} 
                                            config={this.state.config} 
                                            manifest={this.state.manifest}
                                        /> )
                                    } 
                                />
                                <Route 
                                    path="/authentication" 
                                    component={
                                        props => ( 
                                        <Authentication {...props} 
                                            config={this.state.config} 
                                            manifest={this.state.manifest}
                                        /> )
                                    } 
                                />
                                <Route 
                                    path="/lang-select" 
                                    component={
                                        props => ( 
                                        <LangSelect {...props} 
                                            config={this.state.config} 
                                            manifest={this.state.manifest}
                                        /> )
                                    } 
                                />
                                <Route 
                                    component={
                                        props => ( 
                                        <Error {...props} 
                                            typeError={404} 
                                            config={this.state.config} 
                                            manifest={this.state.manifest}
                                        /> )
                                    } 
                                />
                            </Switch>
                            {/* HeadTag */}
                            <Switch>
                                <Route 
                                    exact 
                                    path="/" 
                                    component={
                                        props => ( 
                                        <Helmet {...props}
                                            manifest={this.state.manifest}
                                            title={JSON.parse(this.state.config)['title']['index']}
                                            description={JSON.parse(this.state.config)['description']['index']}
                                        /> )
                                    } 
                                />
                                <Route 
                                    path="/authentication" 
                                    component={
                                        props => ( 
                                        <Helmet {...props}
                                            manifest={this.state.manifest}
                                            title={JSON.parse(this.state.config)['title']['authentication']}
                                            description={JSON.parse(this.state.config)['description']['authentication']}
                                        /> )
                                    } 
                                />
                                <Route 
                                    path="/lang-select" 
                                    component={
                                        props => ( 
                                        <Helmet {...props}
                                            manifest={this.state.manifest}
                                            title="pSearch: Select your language"
                                            description="Select the default language beetween the french and the english."
                                        >
                                            <meta name="robots" content="noindex, follow" />
                                        </Helmet> )
                                    } 
                                />
                                <Route 
                                    component={
                                        props => ( 
                                        <Helmet {...props}
                                            manifest={this.state.manifest}
                                            title={JSON.parse(this.state.config)['title']['errors']['404']}
                                            description={JSON.parse(this.state.config)['description']['errors']['404']}
                                        /> )
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

class Helmet extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mainCSS: null,
            isReady: false
        }
    }

    componentDidMount() {
        if(window.CONF.env === 'development') {
            this.setState({
                mainCSS: '/assets/styles/main-css.css',
                isReady: true
            });
        } else {
            this.setState({
                mainCSS: JSON.parse(this.props.manifest)['main-css.css'],
                isReady: true
            });
        }
    }

    render() {
        if(this.state.isReady) {
            if(window.CONF.env !== 'development') {
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'UA-106638919-2');
            }

            return (
                <MetaTags>
                    {/* Metas */}
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta name="Identifier-URL" content="https://psearch.alwaysdata.net" />
                    <meta name="theme-color" content="#30AE60" />
                    <meta name="language" content="fr, en" />
                    <meta name="reply-to" content="psearchfr@gmail.com" />
                    <meta name="copyright" content="Copyright © 2018 pSearch" />
                    <meta name="author" content="Soldat8889|pSearch" />
                    <meta name="publisher" content="Soldat8889|pSearch" />
                    <meta name="keywords" content="players, search, play, chat" />
                    <title>{this.props.title}</title>
                    <meta name="description" content={this.props.description} />
                    <meta name="category" content="Searching Players, Playing, Chatting" />
                    {/* The Open Graph protocol */}
                    <meta name="og:title" content={this.props.title} />
                    <meta name="og:description" content={this.props.description} />
                    <meta name="og:locale" content="fr_FR" />
                    <meta name="og:site_name" content="pSearch" />
                    <meta name="og:url" content={window.location} />
                    <meta name="og:type" content="website" />
                    {/* Loading */}
                    {/* Favicon */}
                    <link rel="shortcut icon" type="image/png" href="/assets/images/favicon.png" />
                    {/* Main CSS */}
                    <link rel="stylesheet" type="text/css" href={this.state.mainCSS} />
                    {/* Fonts */}
                    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/solid.css" integrity="sha384-VGP9aw4WtGH/uPAOseYxZ+Vz/vaTb1ehm1bwx92Fm8dTrE+3boLfF1SpAtB1z7HW" crossOrigin="anonymous" />
                    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/regular.css" integrity="sha384-4e3mPOi7K1/4SAx8aMeZqaZ1Pm4l73ZnRRquHFWzPh2Pa4PMAgZm8/WNh6ydcygU" crossOrigin="anonymous" />
                    {/* Global site tag (gtag.js) - Google Analytics */}
                    {window.CONF.env !== 'development' ? <script async src="https://www.googletagmanager.com/gtag/js?id=UA-106638919-2"></script> : null}
                    {/* Adding Metas */}
                    {
                        this.props.children
                    }
                </MetaTags>
            );
        } else {
            return null;
        }
    }
}

const renderApp = () => {
    ReactDOM.render(
        <App />,
        document.getElementById('root'),
    );
}

if(module.hot) {
    module.hot.accept('./main.js', renderApp);
}

renderApp();