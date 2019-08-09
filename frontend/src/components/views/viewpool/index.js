import * as React from "react";

import appState from '../../../state/AppState';

class ViewPool extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {key} = this.props.match.params;
        if (appState.poolData === null || appState.poolData.key !== key) {
            fetch(`http://localhost:8080/api/v1/pool/${key}`)
                .then(function (poolJsonFromServer) {
                    return poolJsonFromServer.json();
                })
                .then((poolJson) => {
                    appState.setPool(poolJson);
                    this.forceUpdate();
                });
        }
    }

    render() {
        return <p>{JSON.stringify(appState.poolData)}</p>
    }
}

export default ViewPool;