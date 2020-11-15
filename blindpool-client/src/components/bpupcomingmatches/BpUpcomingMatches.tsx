import React, {useEffect, useState} from "react";
import {
    Button,
    CircularProgress,
    makeStyles,
    Snackbar,
    Table,
    TableBody, TableCell,
    TableRow,
    Typography
} from "@material-ui/core";
import appState, {Match} from "../../state/AppState";
import {Api, getHost, getHostnameWithPortIfLocal} from "../../utils/Network";
import MuiAlert from "@material-ui/lab/Alert";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

const useStyles = makeStyles({
    margin1em: {
        margin: '0.5em',
    },
    errorMessage: {
        color: 'white'
    },
    table: {
        width: '100%',
        overflowX: 'auto',
    },
    tableRowContainerForClubIcons: {
        display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between', width: '100%'
    },
    clubIconStyle: {
        width: '5em', height: '5em', display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom: '0.5em'
    },
    clubIconAndTextDiv: {
        width: '10em', textAlign: 'center', whiteSpace: 'nowrap'
    },
    slashIcon: {
        marginTop: '2em', marginBottom: '2em'
    },
    width100percent: {
        width: '100%'
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
        } else {
            setLoading(false);
        }
    }, []);

    const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setMessage(undefined);
    };

    if (loading) {
        return <CircularProgress className={classes.margin1em}/>
    } else {
        if (appState.upcomingMatches) {
            return (
                <Table className={classes.table}>
                    <TableBody>
                        {appState.upcomingMatches?.map((match: Match) => {
                            const homeTeamIconUrl = `${window.location.protocol}//${getHostnameWithPortIfLocal()}/clubicons/${match.homeTeamID}.png`;
                            const awayTeamIconUrl = `${window.location.protocol}//${getHostnameWithPortIfLocal()}/clubicons/${match.awayTeamID}.png`;

                            // TODO: Move this logic to a util folder.
                            const startTimestamp: Date = new Date(match.startTimestamp);
                            const minutes: string = '' + startTimestamp.getMinutes();
                            const minutesToDisplay: string = minutes.padStart(2, minutes);
                            const dateString: string = startTimestamp.toLocaleDateString();
                            return (
                                <TableRow key={`matchListItem${match.id}`}>
                                    <TableCell style={{paddingLeft: '0px', paddingTop: '1em', paddingBottom: '0.5em', margin: '0px'}}>
                                        <Link to="/create" style={{textDecoration: 'none'}} >
                                            <Button size="medium" className={classes.width100percent}>
                                                <div className={classes.width100percent}>
                                                    <div className={classes.tableRowContainerForClubIcons}>
                                                        <div className={classes.clubIconAndTextDiv}>
                                                            <img className={classes.clubIconStyle} src={homeTeamIconUrl} alt={match.homeTeamName} />
                                                            <Typography variant="body1" style={{marginBottom: '0px'}}>{match.homeTeamName}</Typography>
                                                        </div>
                                                        <div className={classes.slashIcon}><Typography variant="body1">/</Typography></div>
                                                        <div className={classes.clubIconAndTextDiv}>
                                                            <img className={classes.clubIconStyle} src={awayTeamIconUrl} alt={match.awayTeamName} />
                                                            <Typography variant="body1">{match.awayTeamName}</Typography>
                                                        </div>
                                                    </div>
                                                    <Typography variant="body1" className={classes.margin1em}>{dateString} {startTimestamp.getHours()}:{minutesToDisplay}</Typography>
                                                </div>
                                            </Button>
                                        </Link>
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