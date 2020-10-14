import React, {useEffect, useState} from "react";
import {CircularProgress, makeStyles, Snackbar, Typography} from "@material-ui/core";
import appState, {Match} from "../../state/AppState";
import {getHost} from "../../utils/Network";
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
            fetch(`${getHost()}/api/v2/matches/upcoming`)
                .then(async upcomingMatchesResponse => {
                    let upcomingMatches = await upcomingMatchesResponse.json();
                    appState.setUpcomingMatches(upcomingMatches);
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
                <div>
                    <h1>title</h1>
                    {appState.upcomingMatches?.map((match) => {
                        return (
                            <div>{match.homeTeam}-{match.awayTeam}</div>
                        );
                    })}
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
        } else {
            return (
                <div><br/>Something went wrong with loading the matches</div>
            );
        }
    }
}

export default BpUpcomingMatches;