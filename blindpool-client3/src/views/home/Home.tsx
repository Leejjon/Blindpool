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
import {Helmet} from "react-helmet";
import BpUpcomingMatches from "../../components/bpupcomingmatches/BpUpcomingMatches";
import {BpSnackbarMessage} from "../../App";
import "./Home.css";

// const useStyles = makeStyles({
//     root: {
//         flexGrow: 1,
//         textAlign: 'center',
//         marginTop: '1em',
//         marginBottom: '0em',
//         marginRight: "-16px", marginLeft: "-16px", paddingLeft: "15px"
//     },
//     card: {
//         minWidth: "20em",
//         maxWidth: "20em"
//     },
//     firstButton: {
//         flexGrow: 1,
//         textAlign: "left",
//         textDecoration: 'none'
//     },
// });

const Home: React.FC<BpSnackbarMessage> = ({message, setMessage}) => {
    const {t} = useTranslation();

    return (
        <Grid container justifyContent={"center"} spacing={2} className="{classes.root}"
              sx={{flexGrow: 1, textAlign: 'center', marginTop: '0.5em', marginBottom: '0em'}}>
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
                        <Divider style={{marginTop: '0.5em'}}/>
                        <Typography component="p">
                            <br/>
                            {t("BLINDPOOL_DEFINITION_DESCRIPTION")}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Link className="{classes.firstButton}" to="/create">
                            <Button size="medium">{t("CREATE_POOL")}</Button>
                        </Link>
                        <Link to="/howto" style={{textDecoration: 'none'}}>
                            <Button size="medium">{t("HOW_DOES_IT_WORK_TITLE")}</Button>
                        </Link>
                    </CardActions>
                </Card>
            </Grid>
            <Grid key="matchers" item>
                <Card className="card">
                    <CardContent>
                        <Typography variant="h2">{t('UPCOMING_MATCHES')}</Typography>
                        <Divider style={{marginTop: '0.5em'}}/>
                        <Typography component="p" style={{marginBottom: '0.5em'}}><br/>{t('CLICK_ON_MATCH')}
                        </Typography>
                        <BpUpcomingMatches message={message} setMessage={setMessage}/>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Home;
