import React, {useEffect, useState} from "react";
import {
    Button,
    CardActions,
    CircularProgress, Icon,
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
        // backgroundColor: 'pink',
    },
    tableRowContainerForClubIcons: {
        display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'center'
    },
    clubIconStyle: {
        width: '5em', height: '5em', display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom: '0.5em'
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

                            // TODO: Move this logic to a util folder.
                            const startTimestamp: Date = new Date(match.startTimestamp);
                            const minutes: string = '' + startTimestamp.getMinutes();
                            const minutesToDisplay: string = minutes.padStart(2, minutes);
                            const dateString: string = startTimestamp.toLocaleDateString();
                            return (
                                <TableRow key={`matchListItem${match.id}`}>
                                    <TableCell style={{paddingLeft: '0px', paddingTop: '1em', paddingBottom: '0.5em'}}>
                                        <div className={classes.tableRowContainerForClubIcons}>
                                            <Button size="medium">
                                                <div style={{width: '10em', textAlign: 'center'}} >
                                                    <img className={classes.clubIconStyle} src={homeTeamIconUrl} alt={match.homeTeam} />
                                                    <Typography variant="body1" style={{marginBottom: '0px'}}>{match.homeTeam}</Typography>
                                                </div>
                                                <div><Typography variant="body1">/</Typography></div>
                                                <div style={{width: '10em', textAlign: 'center'}}>
                                                    <img className={classes.clubIconStyle} src={awayTeamIconUrl} alt={match.awayTeam} />
                                                    <Typography variant="body1" style={{marginBottom: '0px'}}>{match.awayTeam}</Typography>
                                                </div>
                                                <div style={{textAlign: 'right', height: '100%', verticalAlign: 'middle'}}>
                                                    <Icon fontSize="large">
                                                        navigate_next
                                                    </Icon>
                                                </div><br/>
                                            </Button>
                                        </div>
                                        <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap',
                                            justifyContent: 'space-evenly', margin: '0.5em', paddingRight: '3em'}}>
                                            <Typography variant="body1">{dateString} {startTimestamp.getHours()}:{minutesToDisplay}</Typography>
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