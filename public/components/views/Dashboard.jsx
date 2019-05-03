import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Dashboard extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            apiResponse: '',
            isLoading  : true
        }
    }

    componentDidMount() {
        this._isMounted = true;

        axios
            .get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/auth/dashboard`)
            .then((res) => {
                if(this._isMounted) {
                    this.setState({
                        apiResponse: res.data,
                        isLoading  : false
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
        return (
            <section className="page-content">
                <div id="packed" className="packed"></div>
                <section id="context" className="page-part-wrapper">
                    <div className="page-part-content">
                        <h1>Welcome to your profile !</h1>
                        <h2>{JSON.stringify(this.state.apiResponse)}</h2>
                    </div>
                </section>
            </section>
        )
    }
}

export default withRouter(Dashboard);