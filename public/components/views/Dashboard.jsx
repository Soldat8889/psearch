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
                <section id="context" className="page-part-wrapper">
                    <div className="page-part-content">
                        <Header 
                            config={config}
                            isAuthed={isAuthed}
                            user={user}
                        />
                    </div>
                </section>
            </section>
        )
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
            <header id="Dashboard_Header" className="page-part-wrapper dashboard-header">
                <TopBar 
                    config={config}   
                />
                <div className="container">
                    <h1>Welcome to your profile !</h1>
                    <h2>{JSON.stringify(user)}</h2>
                </div>
            </header>
        );
    }
}

export default withRouter(Dashboard);