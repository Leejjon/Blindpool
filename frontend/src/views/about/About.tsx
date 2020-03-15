import React from "react";
import {useTranslation} from "react-i18next";
import {Card, CardContent, Divider, Grid, makeStyles, Typography} from "@material-ui/core";

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
});

const About: React.FC = () => {
    const classes = useStyles();
    const {t} = useTranslation();

    return (
        <Grid container justify="center" spacing={2} className={classes.root}>
            <Grid key="definition" item>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="h2" >
                            {t("ABOUT_BLINDPOOL_TITLE")}
                        </Typography>
                        <Divider style={{marginTop: '0.5em'}} />
                        <Typography component="p">
                            <br />
                            {t("BLINDPOOL_DEFINITION_DESCRIPTION")}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default About;