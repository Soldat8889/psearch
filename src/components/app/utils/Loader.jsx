import React, { Component } from "react";
import PropTypes            from "prop-types";

class Loader extends Component {
    static defaultProps = {
        class       : "",
        style       : {},
        styleContent: {}
    }

    static propTypes = {
        class       : PropTypes.string,
        style       : PropTypes.object,
        styleContent: PropTypes.object
    }
    
    render() {
        return (
            <div className={`loader ${this.props.class}`} style={this.props.style}>
                <div className="loader_content" style={this.props.styleContent}>
                    <span className="loader_bubble"></span>
                    <span className="loader_bubble"></span>
                    <span className="loader_bubble"></span>
                </div>
            </div>
        );
    }
}

export default Loader;