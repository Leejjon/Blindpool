import * as React from "react";

import appState from '../../state/AppState';
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import {CardContent} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import intl from "react-intl-universal";

const styles = theme => ({
    root: {
        flexShrink: 0,
        textAlign: 'center',
        marginTop: '1em',

    },
    card: {
        minWidth: "20em",
        maxWidth: "20em"
    },
});

class ViewPool extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            initialized: false
        };
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
                    this.setState({initialized: true});
                    // this.forceUpdate();
                });
        } else {
            this.setState({initialized: true});
        }
    }

    static getOwner() {

        // var jsonData = JSON.parse(myMessage);
        // for (var i = 0; i < jsonData.counters.length; i++) {
        //     var counter = jsonData.counters[i];
        //     console.log(counter.counter_name);
        // }
        let participantsAndScores = appState.poolData.participantsAndScores;
        return participantsAndScores[0].participant.name;
    }

    render() {
        const {classes} = this.props;
        return (
            this.state.initialized &&
            <Grid container justify="center" spacing={2} className={classes.root}
                  style={{marginRight: "-16px", marginLeft: "-16px", paddingLeft: "15px"}}>
                <Grid key="definition" item>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography variant="h2">
                                {intl.get("POOL_MADE_BY", {organizer: ViewPool.getOwner()})}
                            </Typography>
                                {JSON.stringify(appState.poolData)}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );

    }
}

export default  withStyles(styles)(ViewPool);