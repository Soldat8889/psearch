import React     from 'react';
import PropTypes from 'prop-types';
import NProgress from 'nprogress';

class Init extends React.Component {
    static defaultProps = {
        manifest: '/assets/dist/manifest.json'
    }

    static propTypes = {
        manifest: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
        ]).isRequired
    }

    constructor(props) {
		super(props);

		this.state = {
			appJS: '/assets/dist/app.js'
		}
	}

	componentWillMount() {
        // Set loading top bar
        NProgress.start();

		new Promise((res, rej) => {
			if(window.CONF.env === 'development') {
				res('/assets/dist/app.js');
			} else {
				this.setState({
					appJS: JSON.parse(this.props.manifest)['app.js']
				});

				res(JSON.parse(this.props.manifest)['app.js']);
			}
		})
		.then((val) => {
			let
				app = document.createElement('script'),
				socket = document.createElement('script');
				
			// AppJS create Element
			app.setAttribute('type', 'application/javascript');
			app.setAttribute('src', val);

			document.body.appendChild(app);
		});
    }
    
    componentDidMount() {
        // Loading top bar
		NProgress.done();
    }

	componentWillUnmount() {
		// Remove when Router is activated (change page)
		document.body.removeChild(document.querySelector(`script[src="${this.state.appJS}"]`));
    }
    
    render() {
        return true;
    }
}

export default Init;