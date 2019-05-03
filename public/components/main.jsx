import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';
// Root
import App from './App';
import { AppContainer } from 'react-hot-loader';

const render = Component => {
    ReactDOM.render(
        <AppContainer>
            <Router>
                <Route component={Component} />
            </Router>
        </AppContainer>,
        document.getElementById('root'),
    );
}

render(App);

if (module.hot) {
  module.hot.accept('./App', () => { render(App) })
}