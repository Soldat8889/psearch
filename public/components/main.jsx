import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';
// Root
import App from './views/App';
import { AppContainer } from 'react-hot-loader';

const renderApp = Component => {
    ReactDOM.render(
        <AppContainer>
            <Router>
                <Route component={Component} />
            </Router>
        </AppContainer>,
        document.getElementById('root'),
    );
}

renderApp(App);

if(module.hot) {
    module.hot.accept('./views/App', () => { 
        const NextApp = require('./views/App').default;
        renderApp(NextApp);
    });
}