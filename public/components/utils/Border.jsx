import React from 'react';

class Border extends React.Component {
    constructor(props) {
        super(props);

        this.renderingContent = this.renderingContent.bind(this);
    }

    renderingContent() {
        switch(this.props.borderType) {
            case 'basic':
                return <BasicalBorder typeBorder="basic" style={this.props.style ? this.props.style : false} />;
                break;
            default:
                return <BasicalBorder typeBorder="basic" style={this.props.style ? this.props.style : false} />;
            break;
        }
    }

    render() {
        return (
            this.renderingContent()
        );
    }
}

class BasicalBorder extends React.Component {
    constructor(props) {
        super(props);

        this.renderingContent = this.renderingContent.bind(this);
    }

    renderingContent() {
        if(this.props.style) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 70" preserveAspectRatio="none" className="page-part-border" style={this.props.style}>
                    <polygon points="0,71 1000,71 0,0" />
                </svg>
            );
        } else {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 70" preserveAspectRatio="none" className="page-part-border">
                    <polygon points="0,71 1000,71 0,0" />
                </svg>
            );
        }
    }

    render() {
        return (
            this.renderingContent()  
        );
    }
}

export default Border;