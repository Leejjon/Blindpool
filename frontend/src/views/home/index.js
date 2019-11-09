import React, { Component } from 'react';
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import intl from "react-intl-universal";
import {Link} from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";

const styles = () => ({
    root: {
        flexGrow: 1,
        textAlign: 'center',
        marginTop: '1em',
        marginBottom: '0em'
    },
    card: {
        minWidth: "20em",
        maxWidth: "20em"
    },
    firstButton: {
        flexGrow: 1,
        textAlign: "left",
        textDecoration: 'none'
    },
});

class ViewHome extends Component {

    render() {
        const { classes } = this.props;
        return (
            <Grid container justify="center" spacing={2} className={classes.root}
                  style={{marginRight: "-16px", marginLeft: "-16px", paddingLeft: "15px"}}>
                  {/* The insane style correction makes sure there is no horizontal scrollbar and it's centered on mobile */}
                <Grid key="definition" item>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography variant="h2" >
                                {intl.get("BLINDPOOL_DEFINITION_TITLE")}
                            </Typography>
                            <Divider style={{marginTop: '0.5em'}} />
                            <Typography component="p">
                                <br />
                                {intl.get("BLINDPOOL_DEFINITION_DESCRIPTION")}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Link className={classes.firstButton} to="/create">
                                <Button size="medium">{intl.get("CREATE_POOL")}</Button>
                            </Link>
                            <Link to="/howto" style={{textDecoration: 'none'}}>
                                <Button size="medium">{intl.get("HOW_TO_USE_BLINDPOOL_TITLE")}</Button>
                            </Link>
                        </CardActions>
                    </Card>
                </Grid>
                {/*<Grid key="matches" item>*/}
                {/*    <Card className={classes.card}>*/}
                {/*        <CardContent>*/}
                {/*            <Typography variant="h2" className={this.props.classes.title}>*/}
                {/*                Upcoming matches*/}
                {/*            </Typography>*/}
                {/*            <Divider style={{marginTop: '0.5em'}} />*/}
                {/*            <List component="matches-list">*/}
                {/*                <ListItemText>Ado Den Haag - Willem II</ListItemText>*/}
                {/*                <ListItemText>De Graafschap - Ajax</ListItemText>*/}
                {/*                <ListItemText>Excelsior - AZ</ListItemText>*/}
                {/*                <ListItemText>FC Emmen - FC Groningen</ListItemText>*/}
                {/*                <ListItemText>FC Utrecht - SC Heerenveen</ListItemText>*/}
                {/*                <ListItemText>Fortuna Sittard - Feyenoord</ListItemText>*/}
                {/*                <ListItemText>Nac Breda - Pec Zwolle</ListItemText>*/}
                {/*                <ListItemText>PSV - Heracles Almelo</ListItemText>*/}
                {/*                <ListItemText>VVV Venlo - Vitesse</ListItemText>*/}
                {/*            </List>*/}
                {/*        </CardContent>*/}
                {/*        <CardActions>*/}
                {/*            <Button size="medium">View all</Button>*/}
                {/*        </CardActions>*/}
                {/*    </Card>*/}
                {/*</Grid>*/}
            </Grid>
        );
    }
}


export default withStyles(styles)(ViewHome);