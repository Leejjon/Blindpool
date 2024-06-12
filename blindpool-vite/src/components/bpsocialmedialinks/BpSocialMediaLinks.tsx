import {Grid, Typography} from "@mui/material";
import React from "react";
import {useTranslation} from "react-i18next";

const BpSocialMediaLinks = () => {
    const {t} = useTranslation();
    const fb = t('BLINDPOOL_ON_FB');
    const ig = t('BLINDPOOL_ON_IG');
    return (
        <Grid key="footer" item xs={12} sx={{marginTop: 0, paddingTop: 0, paddingBottom: '0.5em'}}>
            <Typography variant="body1" component="p">{t('FOLLOW_US')}</Typography>
            <a className="linkWithoutDecoration" href="https://www.facebook.com/Blindepool" target="new"><img alt={fb} src="/icons/icons8-facebook-48.png"/></a>
            <a className="linkWithoutDecoration" href="https://www.instagram.com/blindepool.nl/" target="new"><img alt={ig} src="/icons/icons8-instagram-48.png"/></a>
        </Grid>
    );
}

export default BpSocialMediaLinks;
