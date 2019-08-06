import * as React from "react";

class ViewPool extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pool: null
        };
    }

    componentDidMount() {
        const {key} = this.props.match.params;
        const storePool = this.props.loadPool;

        // if (this.state.pool === null || this.state.pool.key !== key) {
        //     fetch(`api/v1/pool/${key}`)
        //         .then(function (poolJsonFromServer) {
        //             return poolJsonFromServer.json;
        //         })
        //         .then(function (poolJson) {
        //             console.log(JSON.stringify(poolJson));
        //         });
        // } else {
        //     console.log(this.state.pool);
        // }
    }

    render() {
        return <p>Hoi</p>
    }
}

export default ViewPool;