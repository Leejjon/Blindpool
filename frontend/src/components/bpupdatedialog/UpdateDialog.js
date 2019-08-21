import React, {Component} from 'react';

// Get the current version in code
import {majorVersion as MAJOR_VERSION} from "../../version.json";
import {minorVersion as MINOR_VERSION} from "../../version.json";

export default class UpdateDialog extends Component {

    state = {
        shouldUpdate: false,
        message: "An update is available",
    };

    componentDidMount() {
        // Now get the current version from the server
        fetch('/version.json').then((response) => {
            return response.json();
        }).then((updateInfo) => {
            if (updateInfo.majorVersion > MAJOR_VERSION || updateInfo.minorVersion > MINOR_VERSION) {
                this.setState({
                    shouldUpdate: true,
                    shouldClearCache: updateInfo.shouldClearCache,
                    message: updateInfo.updateMessage,
                });
            }
        });
    }

    // Refresh on a user action
    refreshApp = () => {
        // In some extreme cases we might want to clear the cache too
        if (this.state.shouldClearCache) {
            if (caches) {
                caches.keys().then((names) => {
                    for (let name of names) caches.delete(name);
                });
            }
        }
        window.location.reload(true);
    };

    render() {
        return (this.state.shouldUpdate &&
            <div className="updateDialog">
                <span>{this.state.message}</span>
                <button onClick={this.refreshApp}>Refresh</button>
            </div>
        );
    }
}