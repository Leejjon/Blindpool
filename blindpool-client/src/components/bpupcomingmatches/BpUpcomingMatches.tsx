import React, {useEffect, useState} from "react";
import {
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
        border: '1px',
        borderColor: '444444'
    },
    clubIconTableCell: {
        // backgroundColor: 'RED',
        width: '50%',
        textAlign: 'center'
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

                            const startTimestamp: Date = new Date(match.startTimestamp);
                            return (
                                <div>
                                    <TableRow key={`matchListItem${match.id}`}>
                                        <TableCell className={classes.clubIconTableCell}>
                                            <img style={clubIconStyle} src={homeTeamIconUrl} alt={match.homeTeam} />
                                            <p>{match.homeTeam}</p>
                                        </TableCell>
                                        <TableCell><div>/</div></TableCell>
                                        <TableCell className={classes.clubIconTableCell}>
                                            <img style={clubIconStyle} src={awayTeamIconUrl} alt={match.awayTeam} />
                                            <p>{match.awayTeam}</p>
                                        </TableCell>
                                    </TableRow>
                                </div>
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