import React from "react";
import {Button, Card, CardActions, CardContent, Divider, Grid, makeStyles, Typography} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import Helmet from "react-helmet";

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        textAlign: 'center',
        marginTop: '1em',
        marginBottom: '0em',
        marginRight: "-16px", marginLeft: "-16px", paddingLeft: "15px"
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

const Home: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <Grid container justify="center" spacing={2} className={classes.root}>
            <Helmet>
                <title>{t('TITLE')} - {t('BLINDPOOL_DEFINITION_TITLE')}</title>
                <meta name="description" content={t('BLINDPOOL_DEFINITION_DESCRIPTION')}/>
                <meta property="og:title" content={t('TITLE') + " - " + t('BLINDPOOL_DEFINITION_TITLE')}/>
                <meta property="og:description" content={t('BLINDPOOL_DEFINITION_DESCRIPTION')}/>
            </Helmet>
            {/* The insane style correction makes sure there is no horizontal scrollbar and it's centered on mobile */}
            <Grid key="definition" item>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="h2" >
                            {t("BLINDPOOL_DEFINITION_TITLE")}
                        </Typography>
                        <Divider style={{marginTop: '0.5em'}} />
                        <Typography component="p">
                            <br />
                            {t("BLINDPOOL_DEFINITION_DESCRIPTION")}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Link className={classes.firstButton} to="/create">
                            <Button size="medium">{t("CREATE_POOL")}</Button>
                        </Link>
                        <Link to="/howto" style={{textDecoration: 'none'}}>
                            <Button size="medium">{t("HOW_TO_USE_BLINDPOOL_TITLE")}</Button>
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
};

export default Home;