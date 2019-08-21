import React, {Component} from 'react';

// Get the current version in code
import {majorVersion as CURRENT_VERSION} from "../../version.json";

export default class UpdateDialog extends Component {

    state = {
        shouldUpdate: false,
        message: "An update is available",
    };

    componentDidMount() {
        // Now get the current version from the server
        fetch('/version.json').then((response) => {
            console.log("Do we get here?");
            return response.json();
        }).then((updateInfo) => {
            console.log("En hier?");
            // Only display the update message on a major version change
            if (updateInfo.majorVersion > CURRENT_VERSION) {
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