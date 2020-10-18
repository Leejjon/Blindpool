import React, {useEffect, useState} from "react";
import {
    Button,
    CardActions,
    CircularProgress,
    List,
    ListItem,
    makeStyles,
    Snackbar,
    Table,
    TableBody, TableCell,
    TableRow,
    Typography
} from "@material-ui/core";
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
    },
    table: {
        width: '100%',
        overflowX: 'auto',
    },
    tableRowContainer: {
        display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'center', backgroundColor: 'pink'
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
                <Table className={classes.table}>
                    <TableBody>
                        {appState.upcomingMatches?.map((match: Match) => {
                            const homeTeamIconUrl = `https://crests.football-data.org/${match.homeTeamID}.svg`;
                            const awayTeamIconUrl = `https://crests.football-data.org/${match.awayTeamID}.svg`;

                            const clubIconStyle = {
                                width: '3em', height: '3em', display: 'block', marginLeft: 'auto', marginRight: 'auto'
                            };

                            // TODO: Move this logic to a util folder.
                            const startTimestamp: Date = new Date(match.startTimestamp);
                            const minutes: string = '' + startTimestamp.getMinutes();
                            const minutesToDisplay: string = minutes.padStart(2, minutes);
                            const dateString: string = startTimestamp.toLocaleDateString();
                            return (
                                <TableRow key={`matchListItem${match.id}`}>
                                    <TableCell>
                                        <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'center'}}>
                                            <div style={{width: '10em', textAlign: 'center'}} >
                                                <img style={clubIconStyle} src={homeTeamIconUrl} alt={match.homeTeam} />
                                                <p>{match.homeTeam}</p>
                                            </div>
                                            <div><p>/</p></div>
                                            <div style={{width: '10em', textAlign: 'center'}}>
                                                <img style={clubIconStyle} src={awayTeamIconUrl} alt={match.awayTeam} />
                                                <p>{match.awayTeam}</p>
                                            </div>
                                        </div>
                                        <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-evenly'}}>
                                            <div style={{}}><p>{startTimestamp.getHours()}:{minutesToDisplay} {dateString}</p></div>
                                            {/*<div style={{textDecoration: 'none'}}><Button style={{marginTop: '0.3em'}} size="medium">Create pool</Button></div>*/}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
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