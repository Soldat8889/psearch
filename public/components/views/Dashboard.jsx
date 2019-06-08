import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Dashboard extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    render() {
        const { config, isAuthed, user } = this.props;

        return (
            <section className="page-content">
                <div id="packed" className="packed"></div>
                <Sidebar 
                    config={config}
                    isAuthed={isAuthed}
                    user={user}    
                />
                <div className="dashboard-main">
                    <Header 
                        config={config}
                        isAuthed={isAuthed}
                        user={user}
                    />
                    <Body 
                        config={config}
                        isAuthed={isAuthed}
                        user={user}
                    />
                </div>
            </section>
        )
    }
}

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { user } = this.props;

        return (
            <aside className="dashboard-sidebar">
                <div className="dashboard-sidebar--heading"></div>
                <div className="dashboard-menu"></div>
                <div className="dashboard-sidebar--container">
                    <img className="dashboard--avatar" src={`/assets${user.Avatar_User}`} />
                    <h1>{user.Username_User}</h1>
                </div>
            </aside>
        );
    }
}

// Components
import TopBar from './../common/layouts/Header/TopBar';

class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { config, user, isAuthed } = this.props;
        
        return (
            <header id="Dashboard_Header" className="dashboard-header page-part-wrapper">
                <div className="background-overlay overlay--horizon-zero-dawn" style={{backgroundImage: 'url(https://cdna.artstation.com/p/assets/images/images/011/428/098/large/graham-tattersall-flat-background-mountains.jpg?1529525121)'}}></div>
                <div className="page-part-content">
                    <TopBar 
                        config={config} 
                        params={
                            {
                                isSticky: false
                            }
                        }
                        isAuthed={isAuthed}
                    />
                    <div className="dashboard-header_review--container">
                        <div className="dashboard-header_review--content container">
                            <h1>Welcome to your profile !</h1>
                            {/* <h2>{JSON.stringify(user)}</h2> */}
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

// Components
import Chat from './../common/layouts/Body/Chat';

class Body extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { user } = this.props;

        return (
            <section id="Dashboard_Body" className="dashboard-body page-part-wrapper container">
                <div className="page-part-content">
                    <div className="dashboard-body--line">
                        <CurrentPlaying user={user} />
                        <Chat user={user} />
                    </div>
                    <div className="dashboard-body--line">
                        <div className="dashboard-body_box--wrapper col-m-3">
                            <div className="dashboard-body_box"></div>
                        </div>
                        <div className="dashboard-body_box--wrapper col-m-3">
                            <div className="dashboard-body_box"></div>
                        </div>
                        <div className="col-m-6">
                            <div className="dashboard-body_box--wrapper dashboard-body_box--vertical">
                                <div className="dashboard-body_box"></div>
                            </div>
                            <div className="dashboard-body_box--wrapper dashboard-body_box--vertical">
                                <div className="dashboard-body_box"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

class CurrentPlaying extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="dashboard-body_box--wrapper col-m-4">
                <div className="dashboard-body_box background--cover-all webp-test lazy-loading" data-background data-lazy-loading="/assets/images/league-of-legends--summoners-rift .jpg">
                </div>
            </div>
        );
    }
}

export default withRouter(Dashboard);