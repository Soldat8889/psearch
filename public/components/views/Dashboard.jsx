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
            <section className="dashboard-container page-content">
                <div id="packed" className="packed"></div>
                <Sidebar 
                    config={config}
                    isAuthed={isAuthed}
                    user={user}    
                />
                <div className="dashboard-main page-part-content">
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
        return (
            <aside className="dashboard-sidebar">
                <div className="dashboard-menu"></div>
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
        const { config, user } = this.props;
        
        return (
            <header id="Dashboard_Header" className="dashboard-header page-part-wrapper">
                <TopBar 
                    config={config} 
                    params={
                        {
                            isSticky: false
                        }
                    }
                />
                <div className="dashboard-header_review--container">
                    <div className="dashboard-header_review--content container">
                        <h1>Welcome to your profile !</h1>
                        {/* <h2>{JSON.stringify(user)}</h2> */}
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
            <section id="Dashboard_Body" className="dashboard-body container page-part-wrapper">
                {/* <Chat 
                    user={user}
                /> */}
                <div className="dashboard-body--line">
                    <div className="dashboard-body_box--wrapper col-m-5">
                        <div className="dashboard-body_box"></div>
                    </div>
                    <div className="dashboard-body_box--wrapper col-m-7">
                        <div className="dashboard-body_box"></div>
                    </div>
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
            </section>
        );
    }
}

export default withRouter(Dashboard);