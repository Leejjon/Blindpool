import React, { Component } from 'react';
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import {ListItemText} from "@material-ui/core";

const styles = theme => ({
    root: {
        flexGrow: 1,
        textAlign: 'center',
        marginTop: '1em',

    },
    card: {
        minWidth: "20em",
        maxWidth: "20em"
    },

    title: {
        fontSize: 24,
    },
});

class ViewHome extends Component {


    constructor(props, context, handleChange) {
        super(props, context);
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid container justify="center" spacing={2} className={classes.root} style={{marginRight: "-16px", marginLeft: "-16px"}}>
                <Grid key="definition" item>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography variant="h2" className={this.props.classes.title}>
                                What is a blindpool?
                            </Typography>
                            <Typography component="p">
                                <br />
                                {'A blind pool is gambling game where all participants make a blind bet on the results of football match.'}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="medium">Create a blindpool</Button>
                            <Button size="medium">Learn how this app works</Button>

                        </CardActions>
                    </Card>
                </Grid>
                <Grid key="matches" item>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography variant="h2" className={this.props.classes.title}>
                                Upcoming matches
                            </Typography>
                            <br />
                            <List component="matches-list">
                                <ListItemText>Ado Den Haag - Willem II</ListItemText>
                                <ListItemText>De Graafschap - Ajax</ListItemText>
                                <ListItemText>Excelsior - AZ</ListItemText>
                                <ListItemText>FC Emmen - FC Groningen</ListItemText>
                                <ListItemText>FC Utrecht - SC Heerenveen</ListItemText>
                                <ListItemText>Fortuna Sittard - Feyenoord</ListItemText>
                                <ListItemText>Nac Breda - Pec Zwolle</ListItemText>
                                <ListItemText>PSV - Heracles Almelo</ListItemText>
                                <ListItemText>VVV Venlo - Vitesse</ListItemText>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}


export default withStyles(styles)(ViewHome);