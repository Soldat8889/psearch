import React     from 'react';
import MetaTags  from 'react-meta-tags';

// Context
import { ManifestContext } from './../context/ManifestContext';
import { ConfigContext } from './../context/ConfigContext';

class Helmet extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { name, title, description, children } = this.props;
    
        return (
            <ManifestContext.Consumer>
                {manifest => (
                    <ConfigContext.Consumer>
                        {config => (
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
                            <title>{title ? title : config['title'][name]}</title>
                            <meta name="description" content={description ? description : config['description'][name]} />} />
                            <meta name="category" content="Searching Players, Playing, Chatting" />
                            {/* The Open Graph protocol */}
                            <meta name="og:title" content={title ? title : config['title'][name]} />
                            <meta name="og:description" content={description ? description : config['description'][name]} />} />
                            <meta name="og:locale" content="fr_FR" />
                            <meta name="og:site_name" content="pSearch" />
                            <meta name="og:url" content={window.location} />
                            <meta name="og:type" content="website" />
                            {/* Loading */}
                            {/* Main CSS */}
                            <link rel="stylesheet" type="text/css" href={window.CONF.env === 'development' ? '/assets/dist/main-css.css' : manifest['main-css.css']} />
                            {/* Fonts */}
                            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/solid.css" integrity="sha384-VGP9aw4WtGH/uPAOseYxZ+Vz/vaTb1ehm1bwx92Fm8dTrE+3boLfF1SpAtB1z7HW" crossOrigin="anonymous" />
                            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/regular.css" integrity="sha384-4e3mPOi7K1/4SAx8aMeZqaZ1Pm4l73ZnRRquHFWzPh2Pa4PMAgZm8/WNh6ydcygU" crossOrigin="anonymous" />
                            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,700" />
                            {/* Adding Metadatas */}
                            <script type="application/ld+json" dangerouslySetInnerHTML={{__html: 
                            `{
                                "@context": "http://schema.org",
                                "@type": "Organization",
                                "name": "pSearch",
                                "contactPoint": {
                                    "@type": "ContactPoint",
                                    "url": "https://psearch.alwaysdata.net",
                                    "email": "psearchfr@gmail.com",
                                    "contactType": "technical support",
                                    "contactOption": "TollFree"
                                }
                            }`}}>
                            </script>
                            {
                                children
                            }
                        </MetaTags>
                        )}
                    </ConfigContext.Consumer>
                )}
            </ManifestContext.Consumer>
        );
    }
}

export default Helmet;