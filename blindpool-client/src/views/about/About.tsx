import {Button, Card, CardActions, CardContent, Divider, Grid, Typography} from "@mui/material";
import React from "react";
import {useTranslation} from "react-i18next";
import {Helmet} from "react-helmet-async";
import BpSocialMediaLinks from "../../components/bpsocialmedialinks/BpSocialMediaLinks";

const pagestyle = {
    flexGrow: 1, textAlign: "center", marginTop: "0.5em", marginBottom: "1em"
};

const About: React.FC = () => {
    const { t } = useTranslation();
    const aboutBlindpoolDescription = t('ABOUT_BLINDPOOL_DESCRIPTION');
    return (
        <Grid container justifyContent={"center"} spacing={2}
            sx={pagestyle}>
            <Helmet>
                <title>{t('TITLE')} - {t('ABOUT_BLINDPOOL_TITLE')}</title>
                <meta name="description" content={aboutBlindpoolDescription}/>
                <meta property="og:title" content={t('TITLE') + " - " + t('ABOUT_BLINDPOOL_TITLE')}/>
                <meta property="og:description" content={aboutBlindpoolDescription}/>
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
                        <a className="firstButton" href="https://www.linkedin.com/in/leon-liefting-4b511a29/" style={{textDecoration: 'none', width: "100%", paddingLeft: '2em'}} target="new">
                            <Button size="large" sx={{color: "rgba(0, 0, 0, 0.87)", width: "100%", fontSize: "medium"}}>LinkedIN</Button>
                        </a>
                        <a href="https://github.com/Leejjon" target="new" style={{textDecoration: 'none', width: "100%", paddingRight: '2em'}}>
                            <Button size="large" sx={{color: "rgba(0, 0, 0, 0.87)", width: "100%", fontSize: "medium"}}>GitHub</Button>
                        </a>
                    </CardActions>
                    <CardActions>
                        <a className="firstButton" href="https://dutchcodersnetwork.nl" target="new" style={{textDecoration: 'none', width: "100%", paddingLeft: '2em', paddingBottom: '0.5em'}}>
                            <Button size="large" sx={{color: "rgba(0, 0, 0, 0.87)", width: "100%", fontSize: "medium"}}>DCN</Button>
                        </a>
                        <a href="https://twitter.com/Leejjon_net" target="new" style={{textDecoration: 'none', width: "100%", paddingRight: '2em', paddingBottom: '0.5em'}}>
                            <Button size="large" sx={{color: "rgba(0, 0, 0, 0.87)", width: "100%", fontSize: "medium"}}>X</Button>
                        </a>
                    </CardActions>
                </Card>
            </Grid>
            <BpSocialMediaLinks/>
        </Grid>
    );
};

export default About;
