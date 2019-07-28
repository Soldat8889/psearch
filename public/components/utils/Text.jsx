import React from 'react';
import PropTypes from 'prop-types';

// Contexts
import { ConfigContext } from './../common/contexts/ConfigContext';

class Text extends React.Component {
    _isMounted = false;

    static propTypes = {
        path: PropTypes.array.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            status: "__WAITING",
            text  : null
        }

        // Binding methods
        this.handleLoading = this.handleLoading.bind(this);
    }

    handleLoading() {
        const path      = this.props.path;
        let  pathToText = this.context[path[0]];

        new Promise(async (res, rej) => {
            let pathSearching = new Promise(async (res, rej) => {
                for(let i = 1, j = path.length; i < j; i++) {
                    pathToText = pathToText[path[i]];
                }

                res(pathToText);
            });

            res(await pathSearching);
        })
        .then((r) => {
            this.setState({
                status: "__DONE",
                text  : r
            });
        })
        .catch((e) => {
            window.CONF.env == 'development' ? console.error('DEVELOPMENT => ' + e) : false;
        });
    }

    componentDidMount() {
        this._isMounted = true;

        this.handleLoading();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { status, text } = this.state;

        if(status === "__DONE") {
            return text;
        } else {
            return false;
        }
    }
}

Text.contextType = ConfigContext;

export default Text;