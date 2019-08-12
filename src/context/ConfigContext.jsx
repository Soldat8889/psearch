import React from "react";
import axios from "axios";
import GetCookie from "./../assets/client/utils/getCookie";

export const CONFIG_PATH = "/assets/config/config-";

export const ConfigContext = React.createContext();

export default class ConfigProvider extends React.Component {
    _isMounted = false;

    // Abort axios
    abortController = new AbortController();

    constructor(props) {
        super(props);

        this.state = {
            config: "__WAITING",
            status: "__WAITING"
        };
    }

    componentDidMount() {
        this._isMounted = true;

        // Config content JSON
        new Promise((res) => {
            if(GetCookie("lang") !== null) {
                document.documentElement.classList.add(GetCookie("lang"));
                res(`${CONFIG_PATH}${GetCookie("lang")}.json`);
            } else {
                // Default value
                document.documentElement.classList.add("en");
                res(`${CONFIG_PATH}-en.json`);
            }
        })
        .then((v) => {
            axios
                .get(v, { signal: this.abortController.signal })
                .then((r) => {
                    // Config JSON
                    this.setState({ config: r.data, status: "__DONE" });
                });
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.abortController.abort();
    }

    render() {
        const { config, status } = this.state;

        if(status === "__DONE") {
            return (
                <ConfigContext.Provider value={config}>
                    {this.props.children}
                </ConfigContext.Provider>
            );
        }

        return false;
    }
}