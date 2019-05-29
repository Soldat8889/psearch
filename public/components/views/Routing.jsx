import React                                                  from 'react';
import { Route, BrowserRouter as Router, Switch, withRouter } from 'react-router-dom';
import PropTypes                                              from 'prop-types';

// Routes
import Homepage       from "./Homepage";
import LangSelect     from "./LangSelect";
import Authentication from "./Authentication";
import Dashboard      from './Dashboard';
import Error          from "./Error";

// Type of Routes
import ProtectedRoute from "./../utils/ProtectedRoute";

// Common
import Helmet from "./../common/layouts/Header/Helmet";
import Init   from "./../common/layouts/Footer/Init";

class Routing extends React.Component {
    static defaultProps = {
        manifest: '/assets/dist/manifest.json',
        config  : '/assets/config/config-en.json',
        isAuthed: false
    }

    static propTypes = {
        manifest: PropTypes.string.isRequired,
        config  : PropTypes.string.isRequired,
        isAuthed: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.object
        ]).isRequired
    }

    constructor(props) {
        super(props);
    }

    render() {
        const { manifest, config, isAuthed } = this.props;

        return (
            <div className="rooting">
                <Switch>
                    <Route 
                        exact 
                        path="/" 
                        component={
                            props => ( 
                            <div>
                                <Init {...props} 
                                    manifest={manifest}
                                />
                                <Helmet {...props}
                                    manifest={manifest}
                                    title={JSON.parse(config)['title']['index']}
                                    description={JSON.parse(config)['description']['index']}
                                />
                                <Homepage {...props} 
                                    config={config} 
                                    manifest={manifest}
                                />
                            </div> )
                        } 
                    />
                    <ProtectedRoute 
                        path="/login" 
                        redirect="/dashboard"
                        isAuthed={isAuthed}
                        rule={true}
                        Component={
                            props => ( 
                            <div>
                                <Init {...props} 
                                    manifest={manifest}
                                />
                                <Helmet {...props}
                                    manifest={manifest}
                                    title={JSON.parse(config)['title']['login']}
                                    description={JSON.parse(config)['description']['login']}
                                />
                                <Authentication {...props} 
                                    config={config} 
                                    manifest={manifest}
                                    type="login"
                                />
                            </div> )
                        } 
                    />
                    <ProtectedRoute 
                        path="/dashboard" 
                        redirect="/login"
                        isAuthed={isAuthed}
                        rule={false}
                        Component={
                            props => ( 
                            <div>
                                <Init {...props} 
                                    manifest={manifest}
                                />
                                <Helmet {...props}
                                    manifest={manifest}
                                    title={JSON.parse(config)['title']['dashboard']}
                                    description={JSON.parse(config)['description']['dashboard']}
                                />
                                <Dashboard {...props} 
                                    config={config} 
                                    manifest={manifest}
                                    type="login"
                                />
                            </div> )
                        } 
                    />
                    <ProtectedRoute 
                        path="/signup" 
                        redirect="/dashboard"
                        isAuthed={isAuthed}
                        rule={true}
                        Component={
                            props => ( 
                            <div>
                                <Init {...props} 
                                    manifest={manifest}
                                />
                                <Helmet {...props}
                                    manifest={manifest}
                                    title={JSON.parse(config)['title']['signup']}
                                    description={JSON.parse(config)['description']['signup']}
                                />
                                <Authentication {...props} 
                                    config={config} 
                                    manifest={manifest}
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
                                    manifest={manifest}
                                />
                                <Helmet {...props}
                                    manifest={manifest}
                                    title="pSearch: Select your language"
                                    description="Select the default language beetween the french and the english."
                                />
                                <LangSelect {...props} 
                                    config={config} 
                                    manifest={manifest}
                                />
                            </div> )
                        } 
                    />
                    <Route 
                        component={
                            props => ( 
                            <div>
                                <Init {...props} 
                                    manifest={manifest}
                                />
                                <Helmet {...props}
                                    manifest={manifest}
                                    title={JSON.parse(config)['title']['errors']['404']}
                                    description={JSON.parse(config)['description']['errors']['404']}
                                />
                                <Error {...props} 
                                    typeError={404} 
                                    config={config} 
                                    manifest={manifest}
                                />
                            </div> )
                        } 
                    />
                </Switch>
            </div>
        );
    }
}

export default withRouter(Routing);