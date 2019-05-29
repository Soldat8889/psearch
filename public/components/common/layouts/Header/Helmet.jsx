import React     from 'react';
import MetaTags  from 'react-meta-tags';
import PropTypes from 'prop-types';

class Helmet extends React.Component {
    static defaultProps = {
        manifest   : '/assets/dist/manifest.json',
        title      : 'pSearch: Need a title',
        description: 'pSearch Description'
    }

    static propTypes = {
        manifest   : PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
        ]).isRequired,
        title      : PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
        ]).isRequired,
        description: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
        ]).isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            mainCSS: '/assets/styles/main-css.css',
            isReady: false
        }
    }

    callTracker() {
        if(window.CONF.env !== 'development') {
            return (
                false
            );
        }
    }

    componentDidMount() {
        if(window.CONF.env === 'production') {
            this.setState({
                mainCSS: JSON.parse(this.props.manifest)['main-css.css']
            });   
        }

        this.setState({
            isReady: true
        });
    }

    render() {
        if(this.state.isReady) {
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
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,700" />
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

export default Helmet;