import React, { Component } from 'react';
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";

const styles = theme => ({
    root: {
        flexGrow: 1,
        textAlign: 'center',
        marginTop: '1em',

    },
    paper: {
        height: 140,
        width: 100,

        textAlign: 'center',
    },
    control: {
        padding: theme.spacing.unit * 2,
    },
});

class ViewHome extends Component {


    constructor(props, context, handleChange) {
        super(props, context);
        this.state = {
            spacing: '16',
        };
    }

    render() {
        const { classes } = this.props;
        const { spacing } = this.state;
        return (
            <Grid container className={classes.root} spacing={16}>

                <Grid item xs={12}>
                    <Grid container justify="center" spacing={Number(spacing)}>
                        <Grid key="hoi" item>
                            <Paper className={classes.paper}>
                                Hoi
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}


export default withStyles(styles)(ViewHome);