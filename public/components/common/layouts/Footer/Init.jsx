import React     from 'react';
import NProgress from 'nprogress';

// Contexts
import { ManifestContext } from './../../contexts/ManifestContext';

class Init extends React.Component {
    constructor(props) {
		super(props);

		this.state = {
			appJS: '/assets/dist/app.js'
		}
	}

	// Use context
	static manifest = ManifestContext;

	componentWillMount() {
        // Set loading top bar
        NProgress.start();

		// Set client file TODO: Remove this file, regrouping files
		new Promise((res, rej) => {
			if(window.CONF.env === 'development') {
				res('/assets/dist/app.js');
			} else {
				this.setState({
					appJS: this.manifest['app.js']
				});

				res(this.manifest['app.js']);
			}
		})
		.then((v) => {
			let
				app = document.createElement('script');
				
			// AppJS create Element
			app.setAttribute('type', 'application/javascript');
			app.setAttribute('src', v);

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
		// Render nothing
        return null;
    }
}

export default Init;