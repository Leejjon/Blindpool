import React, {useEffect, useState} from "react";
import {
    Button,
    CircularProgress,
    makeStyles,
    Table,
    TableBody, TableCell,
    TableRow,
    Typography
} from "@mui/material";
import appState from "../../state/AppState";
import {Api, getHost, getHostnameWithPortIfLocal} from "../../utils/Network";
import {useNavigate} from "react-router-dom";
import {BpSnackbarMessage} from "../../App";
import {Match} from "../../model/Match";
import {getAwayTeamNameToDisplay, getHomeTeamNameToDisplay} from "../../locales/i18n";

// const useStyles = makeStyles({
//     margin1em: {
//         margin: '0.5em',
//     },
//     errorMessage: {
//         color: 'white'
//     },
//     table: {
//         width: '100%',
//         overflowX: 'auto',
//     },
//     tableRowContainerForClubIcons: {
//         display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between', width: '100%'
//     },
//     clubIconStyle: {
//         width: '5em', height: '5em', display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom: '0.5em'
//     },
//     clubIconAndTextDiv: {
//         width: '10em', textAlign: 'center', whiteSpace: 'nowrap'
//     },
//     slashIcon: {
//         marginTop: '2em', marginBottom: '2em'
//     },
//     width100percent: {
//         width: '100%'
//     }
// });

const BpUpcomingMatches: React.FC<BpSnackbarMessage> = ({message, setMessage}) => {
    const [loading, setLoading] = useState(true);
    let navigate = useNavigate();

    useEffect(() => {
        if (!appState.upcomingMatches && loading) {
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
    }, [loading, setMessage]);

    function createPoolForMatch (match: Match) {
        appState.setSelectedMatch(match);
        navigate('/create');
    }

    if (loading) {
        return <CircularProgress style={{margin: "0.5em"}} />
    } else {
        if (appState.upcomingMatches) {
            return (
                <Table style={{width: "100%", overflowX: "auto"}}>
                    <TableBody>
                        {appState.upcomingMatches?.map((match: Match) => {
                            const homeTeamName = getHomeTeamNameToDisplay(match);
                            const awayTeamName = getAwayTeamNameToDisplay(match);
                            const homeTeamIconUrl = `${window.location.protocol}//${getHostnameWithPortIfLocal()}/clubicons/${match.homeTeamID}.svg`;
                            const awayTeamIconUrl = `${window.location.protocol}//${getHostnameWithPortIfLocal()}/clubicons/${match.awayTeamID}.svg`;

                            // TODO: Move this logic to a util folder.
                            const startTimestamp: Date = new Date(match.startTimestamp);
                            const minutes: string = '' + startTimestamp.getMinutes();
                            const minutesToDisplay: string = minutes.padStart(2, minutes);
                            const dateString: string = startTimestamp.toLocaleDateString();
                            return (
                                <TableRow key={`matchListItem${match.id}`}>
                                    <TableCell align="center" style={{paddingLeft: '0px', paddingTop: '1em', paddingRight: "0px", paddingBottom: '0.5em', margin: '0px'}}>
                                        <Button size="medium" style={{width: "100%", margin: "0"}} onClick={(event) => createPoolForMatch(match)}>
                                            <div style={{width: "100%"}}>
                                                <div style={{display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-between"}}>
                                                    <div style={{width: '10em', textAlign: 'center', whiteSpace: 'nowrap'}}>
                                                        <img style={{width: '5em', height: '5em', display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom: '0.5em'}}
                                                             src={homeTeamIconUrl} alt={homeTeamName} />
                                                        <Typography variant="body1" style={{marginBottom: '0px'}}>{homeTeamName}</Typography>
                                                    </div>
                                                    <div style={{marginTop: '2em', marginBottom: '2em'}}><Typography variant="body1">/</Typography></div>
                                                    <div style={{width: '10em', textAlign: 'center', whiteSpace: 'nowrap'}}>
                                                        <img style={{width: '5em', height: '5em', display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom: '0.5em'}}
                                                             src={awayTeamIconUrl} alt={awayTeamName} />
                                                        <Typography variant="body1">{awayTeamName}</Typography>
                                                    </div>
                                                </div>
                                                <Typography variant="body1" sx={{margin: "0.5em"}}>{dateString} {startTimestamp.getHours()}:{minutesToDisplay}</Typography>
                                            </div>
                                        </Button>
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
                </div>
            );
        }
    }
}

export default BpUpcomingMatches;
