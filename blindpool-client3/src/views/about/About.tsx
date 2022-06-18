import {Button, Card, CardActions, CardContent, Divider, Grid, Typography} from "@mui/material";
import React from "react";
import {useTranslation} from "react-i18next";
import {Helmet} from "react-helmet-async";

const About: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Grid container justifyContent={"center"} spacing={2}
            sx={{flexGrow: 1, textAlign: "center", marginTop: "0.5em", marginBottom: "1em"}}>
            <Helmet>
                <title>{t('TITLE')} - {t('ABOUT_BLINDPOOL_TITLE')}</title>
                <meta name="description" content={t('ABOUT_BLINDPOOL_DESCRIPTION')}/>
                <meta property="og:title" content={t('TITLE') + " - " + t('ABOUT_BLINDPOOL_TITLE')}/>
                <meta property="og:description" content={t('ABOUT_BLINDPOOL_DESCRIPTION')}/>
            </Helmet>
            <Grid key="aboutme" item>
                <Card className="card">
                    <CardContent>
                        <Typography variant="h2">
                            {t("BEHIND_BLINDPOOL")}
                        </Typography>
                        <Divider />
                        <Typography component="p">
                            <br/>{t('ABOUT_BLINDPOOL_DESCRIPTION')}
                        </Typography>
                        <br/>
                        <img alt="Leon Liefting" style={{width: '100%', height: "auto"}} src="/leon.png"/>
                        <Typography component="p">
                            <br/>
                            {t('REACH_OUT')}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <a href="https://www.linkedin.com/in/leon-liefting-4b511a29/" target="new">
                            <Button size="medium" sx={{color: "rgba(0, 0, 0, 0.87)"}}>LinkedIN</Button>
                        </a>
                        <a href="https://github.com/Leejjon" target="new" style={{textDecoration: 'none'}}>
                            <Button size="medium" sx={{color: "rgba(0, 0, 0, 0.87)"}}>GitHub</Button>
                        </a>
                        <a href="https://dutchcodersnetwork.nl" target="new"
                           style={{textDecoration: 'none', padding: '0.5em'}}>
                            <Button size="medium" sx={{color: "rgba(0, 0, 0, 0.87)"}}>DCN</Button>
                        </a>
                        <a href="https://twitter.com/Leejjon_net" target="new" style={{textDecoration: 'none'}}>
                            <Button size="medium" sx={{color: "rgba(0, 0, 0, 0.87)"}}>Twitter</Button>
                        </a>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
};

export default About;
