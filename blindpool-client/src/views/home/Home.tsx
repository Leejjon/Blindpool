import React from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Grid,
    Typography
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import BpUpcomingMatches from "../../components/bpupcomingmatches/BpUpcomingMatches";
import {BpCompetitionProps, BpSelectedMatchProps} from "../../App";
import BpCompetitions from "../../components/bpcompetitions/BpCompetitions";
import BpSocialMediaLinks from "../../components/bpsocialmedialinks/BpSocialMediaLinks";
import {useQuery} from "@tanstack/react-query";
import {Match} from "../../model/Match";
import { matchesQuery } from "../../queries/MatchesQuery";
import { BpSnackbarMessageProps } from "../../components/bpsnackbar/BpSnackbar";

const Home: React.FC<BpCompetitionProps & BpSnackbarMessageProps & BpSelectedMatchProps> = ({competitionsToWatch, setCompetitionsToWatch, setMessage, setSelectedMatchId}) => {
    const {t} = useTranslation();
    const {data} = useQuery({
        ...matchesQuery(setMessage, competitionsToWatch)
    });
    const matches: Array<Match> = data ?? [];

    const blindpoolDefinitionDescription = t('BLINDPOOL_DEFINITION_DESCRIPTION');
    return (
        <Grid container justifyContent={"center"} spacing={2}
              sx={{flexGrow: 1, textAlign: 'center', marginTop: '0.5em'}}>
            <Helmet>
                <title>{t('TITLE')} - {t('BLINDPOOL_DEFINITION_TITLE')}</title>
                <meta name="description" content={blindpoolDefinitionDescription}/>
                <meta property="og:title" content={t('TITLE') + " - " + t('BLINDPOOL_DEFINITION_TITLE')}/>
                <meta property="og:description" content={blindpoolDefinitionDescription}/>
            </Helmet>
            {/* The insane style correction makes sure there is no horizontal scrollbar and it's centered on mobile */}
            <Grid key="definition" item>
                <Card className="card">
                    <CardContent>
                        <Typography variant="h2">
                            {t("BLINDPOOL_DEFINITION_TITLE")}
                        </Typography>
                        <Divider />
                        <Typography component="p">
                            <br/>
                            {t("BLINDPOOL_DEFINITION_DESCRIPTION")}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Link className="firstButton" to="/create">
                            <Button size="large" sx={{color: "rgba(0, 0, 0, 0.87)", fontSize: "medium"}}>{t("CREATE_POOL")}</Button>
                        </Link>
                        <Link to="/howto" style={{textDecoration: 'none'}}>
                            <Button size="large"
                                    sx={{color: "rgba(0, 0, 0, 0.87)", fontSize: "medium"}}>{t("HOW_DOES_IT_WORK_TITLE")}</Button>
                        </Link>
                    </CardActions>
                </Card>
                <Card className="card" sx={{marginTop: "1.5em"}}>
                    <CardContent>
                        <Typography variant="h2">
                            {t("COMPETITIONS_TITLE")}
                        </Typography>
                        <Divider />
                        <BpCompetitions competitionsToWatch={competitionsToWatch} setCompetitionsToWatch={setCompetitionsToWatch}/>
                    </CardContent>
                </Card>
            </Grid>
            <Grid key="matchers" item sx={{marginBottom: "0.3em"}}>
                <Card className="card">
                    <CardContent>
                        <Typography variant="h2">{t('UPCOMING_MATCHES')}</Typography>
                        <Divider />
                        {/* Try to avoid passing these properties and use composition here. */}
                        <Typography component="p" style={{marginBottom: '0.5em'}}><br/>{matches.length > 0 ? t('CLICK_ON_MATCH') : ""}</Typography>
                        <BpUpcomingMatches matches={matches} setSelectedMatchId={setSelectedMatchId}/>
                    </CardContent>
                </Card>
            </Grid>
            <BpSocialMediaLinks/>
        </Grid>
    );
};

export default Home;
