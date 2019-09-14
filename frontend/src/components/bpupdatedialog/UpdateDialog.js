import React, {Component} from 'react';

// Get the current version in code
import {majorVersion as MAJOR_VERSION} from "../../version.json";
import {minorVersion as MINOR_VERSION} from "../../version.json";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import intl from "react-intl-universal";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";

const styles = () => ({
    root: {
        // flexShrink: 0,
        // textAlign: 'center',
        marginTop: '1.5em',
    },
    card: {
        minWidth: "20em",
        maxWidth: "20em"
    },
    updateMessage: {
        flexGrow: 1,
        textAlign: "left",
        paddingLeft: '0.5em'
    },
    button: {
        paddingTop: '0.55em',
        fontSize: 15
    }
});

class UpdateDialog extends Component {

    state = {
        shouldUpdate: false,
        latestVersion: "1.2"
    };

    componentDidMount() {
        if (window.location.hostname !== 'localhost') {
            // Now get the current version from the server
            fetch('/version.json').then((response) => {
                return response.json();
            }).then((updateInfo) => {
                if (updateInfo.majorVersion > MAJOR_VERSION || (updateInfo.majorVersion === MAJOR_VERSION && updateInfo.minorVersion > MINOR_VERSION)) {
                    this.setState({
                        shouldUpdate: true,
                        shouldClearCache: updateInfo.shouldClearCache,
                    });
                }
            });
        }
    }

    // Refresh on a user action
    handleRefreshApp = () => {
        // In some extreme cases we might want to clear the cache too
        if (this.state.shouldClearCache) {
            if (caches) {
                caches.keys().then((names) => {
                    for (let name of names) caches.delete(name);
                });
            }
        }
        window.location.reload();
    };

    render() {
        const classes = this.props.classes;
        return (this.state.shouldUpdate &&
            <Grid container justify="center" key="definition" item className={classes.root}>
                <Card className={classes.card}>
                    <CardActions>
                        <Typography variant="body1" className={classes.updateMessage}>
                            {intl.get('NEW_VERSION_AVAILABLE')}
                        </Typography>
                        <Button size="medium" className={classes.button} onClick={this.handleRefreshApp}>
                            {intl.get('UPDATE_NOW')}
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        );
    }
}

export default withStyles(styles)(UpdateDialog);