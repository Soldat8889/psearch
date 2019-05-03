import React, { Component } from 'react';
    import PropTypes            from 'prop-types';

class Text extends Component {
    static defaultProps = {
        path: [],
        config: undefined
    }

    static propTypes = {
        path: PropTypes.array.isRequired,
        config: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            isReady: false,
            text   : '...'
        }

        this.handleLoading = this.handleLoading.bind(this);
    }

    handleLoading() {
        let
            path       = this.props.path,
            config     = JSON.parse(this.props.config),
            pathToText = config[path[0]];

        new Promise(async (res, rej) => {
            let pathSearching = new Promise(async (res, rej) => {
                for(let i = 1, j = path.length; i < j; i++) {
                    pathToText = pathToText[path[i]];
                }

                res(pathToText);
            })
            .catch((e) => {
                window.CONF.env == 'development' ? console.error('DEVELOPMENT => ' + e) : false;
            });

            res(await pathSearching);
        })
        .then((res) => {
            this.setState({
                isReady: true,
                text   : res
            });
        })
        .catch((e) => {
            window.CONF.env == 'development' ? console.error('DEVELOPMENT => ' + e) : false;
        });
    }

    componentDidMount() {
        this.handleLoading();
    }

    render() {
        if(this.state.isReady) {
            return this.state.text;
        } else {
            return '...';
        }
    }
}

export default Text;