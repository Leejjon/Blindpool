import React from "react";
import {useTranslation} from "react-i18next";
import {Button, Card, CardActions, CardContent, Divider, Grid, Typography} from "@mui/material";
import {Helmet} from "react-helmet-async";
import {Link} from "react-router-dom";
import BpComicStepper from "../../components/bpcomicstepper/BpComicStepper";
import BpSocialMediaLinks from "../../components/bpsocialmedialinks/BpSocialMediaLinks";

const HowTo: React.FC = () => {
    const { t } = useTranslation();
    const howDoesItWorkDescription = t('HOW_DOES_IT_WORK_DESCRIPTION');
    return (
        <Grid container justifyContent={"center"}  spacing={2}
              sx={{flexGrow: 1, textAlign: "center", marginTop: "0.5em", marginBottom: "1em"}}>
            <Helmet>
                <title>{t('TITLE')} - {t('HOW_DOES_IT_WORK_TITLE')}</title>
                <meta name="description" content={howDoesItWorkDescription}/>
                <meta property="og:title" content={t('TITLE') + " - " + t('HOW_DOES_IT_WORK_TITLE')}/>
                <meta property="og:description" content={howDoesItWorkDescription}/>
            </Helmet>
            <Grid key="definition" item>
                <Card className="card">
                    <CardContent>
                        <Typography variant="h2" >
                            {t("HOW_DOES_IT_WORK_TITLE")}
                        </Typography>
                        <Divider style={{margin: '0.5em'}} />
                        <BpComicStepper />
                    </CardContent>
                    <CardActions>
                        <Link className="lastButton" to="/create">
                            <Button size="large" sx={{color: "rgba(0, 0, 0, 0.87)", fontSize: "medium"}}>{t("CREATE_POOL")}</Button>
                        </Link>
                    </CardActions>
                </Card>
            </Grid>
            <BpSocialMediaLinks/>
        </Grid>
    );
}

export default HowTo;
