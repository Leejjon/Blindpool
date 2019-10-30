import React, { Component } from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import intl from "react-intl-universal";
import Typography from "@material-ui/core/Typography";
import ComicStepper from "../../components/bpcomicstepper";
import Divider from "@material-ui/core/Divider";
import {Helmet} from "react-helmet";

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



class ViewHowTo extends Component {

    render() {
        const { classes } = this.props;

        return (
            <Grid container justify="center" spacing={2} className={classes.root}
                  style={{marginRight: "-16px", marginLeft: "-16px", paddingLeft: "15px"}}>
                <Helmet>
                    <title>{intl.get('TITLE')} - {intl.get('HOW_DOES_IT_WORK')}</title>
                </Helmet>
                <Grid key="definition" item>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography variant="h2" >
                                {intl.get("HOW_DOES_IT_WORK")}
                            </Typography>
                            <Divider style={{margin: '0.5em'}} />

                            <ComicStepper intl={intl} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(ViewHowTo);