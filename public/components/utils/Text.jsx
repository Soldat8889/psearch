import React, { Component } from 'react';

class Text extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: '',
            isReady: false
        }
    }

    componentDidMount(props) {
        const
            config = JSON.parse(this.props.config),
            path = this.props.path;

        let
            finalPath = config[path[0]];

        for(let i = 1, j = path.length; i < j; i++) {
            finalPath = finalPath[path[i]];
        }

        this.setState({
            text: finalPath,
            isReady: true
        });
    }

    render() {
        if(this.state.isReady) {
			return (
				this.state.text
			);
		} else {
			return '...';
		}
    }
}

export default Text;