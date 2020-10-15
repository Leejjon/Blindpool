import React, {useEffect, useState} from "react";
import {CircularProgress, List, ListItem, makeStyles, Snackbar, Typography} from "@material-ui/core";
import appState, {Match} from "../../state/AppState";
import {Api, getHost} from "../../utils/Network";
import MuiAlert from "@material-ui/lab/Alert";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles({
    progress: {
        margin: '1em',
    },
    errorMessage: {
        color: 'white'
    }
});

const BpUpcomingMatches: React.FC = () => {
    const classes = useStyles();
    const {t} = useTranslation();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!appState.upcomingMatches) {
            fetch(`${getHost(Api.matches)}/api/v2/matches/upcoming`)
                .then(async upcomingMatchesResponse => {
                    if (upcomingMatchesResponse.status === 200) {
                        let upcomingMatches = await upcomingMatchesResponse.json();
                        appState.setUpcomingMatches(upcomingMatches);
                    } else {
                        setMessage('BACKEND_OFFLINE');
                    }
                    setLoading(false);
                })
                .catch(result => {
                    console.log(`Something went wrong with fetching upcoming matches ${result}`);
                    setLoading(false);
                    setMessage('BACKEND_UNREACHABLE');
                });
        }
    }, []);

    const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setMessage(undefined);
    };

    if (loading) {
        return <CircularProgress className={classes.progress}/>
    } else {
        if (appState.upcomingMatches) {
            return (
                <List component="ul">
                    <br/>
                    {appState.upcomingMatches?.map((match: Match) => {
                        const homeTeamIconUrl = `https://crests.football-data.org/${match.homeTeamID}.svg`;
                        const awayTeamIconUrl = `https://crests.football-data.org/${match.awayTeamID}.svg`;

                        const clubIconStyle = {
                            width: '3em', height: '3em', marginLeft: '1em', marginRight: '1em'
                        };

                        const startTimestamp: Date = new Date(match.startTimestamp);
                        return (
                            <ListItem key={`matchListItem${match.id}`}>
                                <div><img  style={clubIconStyle} src={homeTeamIconUrl} alt={match.homeTeam} /></div>
                                /
                                <div><img style={clubIconStyle} src={awayTeamIconUrl} alt={match.awayTeam} /></div>
                                hallo
                            </ListItem>
                        );
                    })}
                </List>
            );
        } else {
            return (
                <div>
                    <br/><p>Something went wrong with loading the matches</p>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        open={message !== undefined}
                        autoHideDuration={6000}
                        onClose={handleClose}
                        message={message}>
                        <MuiAlert elevation={1} variant="filled" severity="warning" className="warningAlert">
                            <Typography variant="body1" component="p" className={classes.errorMessage}>{message !== undefined ? t(message) : null}</Typography>
                        </MuiAlert>
                    </Snackbar>
                </div>
            );
        }
    }
}

export default BpUpcomingMatches;