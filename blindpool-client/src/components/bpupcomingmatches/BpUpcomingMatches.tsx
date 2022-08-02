import React, {useEffect, useState} from "react";
import {
    Button,
    CircularProgress,
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
import {useTranslation} from "react-i18next";
import "./BpUpcomingMatches.css";
import {getUpcomingMatches} from "../../api/GetUpcomingMatches";

const upcomingMatchTable = {
    width: "100%", overflowX: "auto"
};

const upcomingMatchTableCell = {
    paddingLeft: '0px', paddingTop: '1em', paddingRight: "0px", paddingBottom: '0.5em', margin: '0px'
};

const upcomingMatchButton = {
    width: "100%", margin: "0"
}


const BpUpcomingMatches: React.FC<BpSnackbarMessage> = ({setMessage}) => {
    const [loading, setLoading] = useState(true);
    let navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (!appState.upcomingMatches && loading) {
            getUpcomingMatches(setMessage, setLoading);
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
                <Table sx={upcomingMatchTable}>
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
                                    <TableCell align="center" sx={upcomingMatchTableCell}>
                                        <Button size="medium" sx={upcomingMatchButton} onClick={(event) => createPoolForMatch(match)}>
                                            <div style={{width: "100%"}}>
                                                <div className="tableRowContainerForClubIcons">
                                                    <div className="clubIconAndTextDiv">
                                                        <img className="clubIconStyle"
                                                             src={homeTeamIconUrl} alt={homeTeamName} />
                                                        <Typography variant="body1" style={{marginBottom: '0px'}}>{homeTeamName}</Typography>
                                                    </div>
                                                    <div className="slashIcon"><Typography variant="body1">/</Typography></div>
                                                    <div className="clubIconAndTextDiv">
                                                        <img className="clubIconStyle"
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
                    <br/><p>{t("UPCOMING_MATCHES_FAILURE")}</p>
                </div>
            );
        }
    }
}

export default BpUpcomingMatches;
