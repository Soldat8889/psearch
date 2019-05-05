import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Dashboard extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            user     : '',
            isLoading: true
        }
    }

    componentDidMount() {
        this._isMounted = true;

        axios
            .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/auth/user`)
            .then((res) => {
                if(this._isMounted) {
                    this.setState({
                        user     : res.data,
                        isLoading: false
                    });
                }
            })
            .catch((e) => {
                window.CONF.env == "development" ? console.warn(`DEVELOPMENT MODE => ${e}`) : null;
            });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    render() {
        const { user } = this.state;
        return (
            <section className="page-content grid-layout">
                <div id="packed" className="packed"></div>
                <section id="context" className="page-part-wrapper">
                    <div className="page-part-content">
                        <Header user={user} />
                    </div>
                </section>
            </section>
        )
    }
}

class Header extends React.Component {
    render() {
        const { user } = this.props;
        
        return (
            <header id="Dashboard_Header" className="page-part-wrapper">
                <h1>Welcome to your profile !</h1>
                <h2>{JSON.stringify(user)}</h2>
            </header>
        );
    }
}

export default withRouter(Dashboard);