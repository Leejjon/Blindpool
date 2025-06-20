import {Button, Card, CardActions, CardContent, Divider, Grid, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import BpSocialMediaLinks from "../components/bpsocialmedialinks/BpSocialMediaLinks";
import { getLocale, getPageTitle, resources } from "~/locales/translations";
import type {Route} from "../../.react-router/types/app/routes/+types/_layout.about";

const pagestyle = {
    flexGrow: 1, textAlign: "center", marginTop: "0.5em", marginBottom: "1em"
};

export function meta({ }: Route.MetaArgs) {
    return [
      { title: `${getPageTitle(resources[getLocale()].translation.ABOUT_BLINDPOOL_TITLE)}` },
      { name: "description", content: resources[getLocale()].translation.ABOUT_BLINDPOOL_DESCRIPTION },
      { tagName: "link", rel: "canonical", href: window.location.hostname.endsWith('blindepool.nl') ? "https://blindepool.nl/about" : "https://www.blindpool.com/about"}
    ];
  };

export default function About() {
    const { t } = useTranslation();
    return (
        <Grid container justifyContent={"center"} spacing={2}
            sx={pagestyle}>
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
                        <img alt="Leon Liefting" style={{width: '100%', height: "auto"}} src="/leon.jpg"/>
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
                        <a className="firstButton" href="https://leejjon.medium.com/" target="new" style={{textDecoration: 'none', width: "100%", paddingLeft: '2em', paddingBottom: '0.5em'}}>
                            <Button size="large" sx={{color: "rgba(0, 0, 0, 0.87)", width: "100%", fontSize: "medium"}}>Medium</Button>
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
}
