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
import {BpCompetitionProps, BpMatchesProps} from "../../App";
import BpCompetitions from "../../components/bpcompetitions/BpCompetitions";

const Home: React.FC<BpMatchesProps & BpCompetitionProps> = ({matches, competitionsToWatch, setCompetitionsToWatch}) => {
    const {t} = useTranslation();

    return (
        <Grid container justifyContent={"center"} spacing={2}
              sx={{flexGrow: 1, textAlign: 'center', marginTop: '0.5em', marginBottom: '1em'}}>
            <Helmet>
                <title>{t('TITLE')} - {t('BLINDPOOL_DEFINITION_TITLE')}</title>
                <meta name="description" content={t('BLINDPOOL_DEFINITION_DESCRIPTION')}/>
                <meta property="og:title" content={t('TITLE') + " - " + t('BLINDPOOL_DEFINITION_TITLE')}/>
                <meta property="og:description" content={t('BLINDPOOL_DEFINITION_DESCRIPTION')}/>
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
            <Grid key="matchers" item>
                <Card className="card">
                    <CardContent>
                        <Typography variant="h2">{t('UPCOMING_MATCHES')}</Typography>
                        <Divider />
                        <Typography component="p" style={{marginBottom: '0.5em'}}><br/>{matches.length > 0 ? t('CLICK_ON_MATCH') : t('NO_MATCHES')}</Typography>
                        <BpUpcomingMatches matches={matches}/>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Home;
