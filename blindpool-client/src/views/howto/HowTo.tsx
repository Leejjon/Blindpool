import React from "react";
import {useTranslation} from "react-i18next";
import {Button, Card, CardActions, CardContent, Divider, Grid, makeStyles, Typography} from "@material-ui/core";
import {Helmet} from "react-helmet";
import {Link} from "react-router-dom";
import BpComicStepper from "../../components/bpcomicstepper/BpComicStepper";

const useStyles = makeStyles({
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
        textAlign: "right",
        textDecoration: 'none'
    },
});

const HowTo: React.FC = () => {
    const classes = useStyles();
    const {t} = useTranslation();
    return (
        <Grid container justify="center" spacing={2} className={classes.root}
              style={{marginRight: "-16px", marginLeft: "-16px", paddingLeft: "15px"}}>
            <Helmet>
                <title>{t('TITLE')} - {t('HOW_DOES_IT_WORK_TITLE')}</title>
                <meta name="description" content={t('BLINDPOOL_DEFINITION_DESCRIPTION')}/>
                <meta property="og:title" content={t('TITLE') + " - " + t('HOW_DOES_IT_WORK_TITLE')}/>
                <meta property="og:description" content={t('BLINDPOOL_DEFINITION_DESCRIPTION')}/>
            </Helmet>
            <Grid key="definition" item>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="h2" >
                            {t("HOW_DOES_IT_WORK_TITLE")}
                        </Typography>
                        <Divider style={{margin: '0.5em'}} />
                        <BpComicStepper />
                    </CardContent>
                    <CardActions>
                        <Link className={classes.firstButton} to="/create">
                            <Button size="medium">{t("CREATE_POOL")}</Button>
                        </Link>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
};

export default HowTo;