import React from 'react';
import axios from 'axios';

export const PATH_MANIFEST = '/assets/dist/manifest.json';

export const ManifestContext = React.createContext();

export default class ManifestProvider extends React.Component {
    _isMounted = false;
    // Abort axios
    abortController = new AbortController();

    constructor(props) {
        super(props);

        this.state = {
            manifest: false
        }
    }

    componentDidMount() {
        this._isMounted = true;

        // Call /assets/dist/manifest.json
        axios
            .get(PATH_MANIFEST, { signal: this.abortController.signal })
            .then((r) => {
                this.setState({ manifest: r.data });
            });
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.abortController.abort();
    }

    render() {
        const { manifest } = this.state;

        return (
            <ManifestContext.Provider value={manifest}>
                {this.props.children}
            </ManifestContext.Provider>
        )
    }
}