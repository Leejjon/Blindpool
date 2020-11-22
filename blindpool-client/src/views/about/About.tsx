import {Button, Card, CardActions, CardContent, Divider, Grid, makeStyles, Typography} from "@material-ui/core";
import React from "react";
import {useTranslation} from "react-i18next";

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

const About: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <Grid container justify="center" spacing={2} className={classes.root}>
            <Grid key="aboutme" item>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="h2">
                            {t("BEHIND_BLINDPOOL")}
                        </Typography>
                        <Divider style={{marginTop: '0.5em'}}/>
                        <Typography component="p">
                            <br/>{t('MY_DESCRIPTION')}
                        </Typography>
                        <br/>
                        <img alt="Leon Liefting" style={{width: '100%', height: "auto"}} src="/leon.png"/>
                        <Typography component="p">
                            <br/>
                            {t('REACH_OUT')}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <a href="https://www.linkedin.com/in/leon-liefting-4b511a29/" target="new"
                           className={classes.firstButton}>
                            <Button size="medium">LinkedIN</Button>
                        </a>
                        <a href="https://github.com/Leejjon" target="new" style={{textDecoration: 'none'}}>
                            <Button size="medium">GitHub</Button>
                        </a>
                        <a href="https://dutchcodersnetwork.nl" target="new"
                           style={{textDecoration: 'none', padding: '0.5em'}}>
                            <Button size="medium">DCN</Button>
                        </a>
                        <a href="https://twitter.com/Leejjon_net" target="new" style={{textDecoration: 'none'}}>
                            <Button size="medium">Twitter</Button>
                        </a>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
};

export default About;