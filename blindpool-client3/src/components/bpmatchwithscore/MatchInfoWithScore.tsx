import appState from "../../state/AppState";
import {Match} from "../../model/Match";
import {getHostnameWithPortIfLocal} from "../../utils/Network";
import {CircularProgress, makeStyles, Typography} from "@mui/material";
import React from "react";
import {getAwayTeamNameToDisplay, getHomeTeamNameToDisplay} from "../../locales/i18n";

const marginHalfEm = {
    margin: '0.5em', fontSize: 'medium', fontWeight: 'bold'
}

const startTimestampMargin = {
    marginTop: '0', fontSize: 'medium', fontWeight: 'bold'
}

const scoreDiv = {
    margin: '0',
    fontSize: 'xxx-large',
    color: '#333333'
}
const progress = {
    margin: '1em',
}

export interface MatchInfoWithScoreProps {
    fullMatchInfo: Match | undefined
}

const MatchInfoWithScores: React.FC<MatchInfoWithScoreProps> = ({fullMatchInfo}) => {
    const match = appState.poolData!.MATCH as Match;
    const homeTeamName = getHomeTeamNameToDisplay(match);
    const awayTeamName = getAwayTeamNameToDisplay(match);
    const homeTeamIconUrl = `${window.location.protocol}//${getHostnameWithPortIfLocal()}/clubicons/${match.homeTeamID}.svg`;
    const awayTeamIconUrl = `${window.location.protocol}//${getHostnameWithPortIfLocal()}/clubicons/${match.awayTeamID}.svg`;

    // TODO: Move this logic to a util folder.
    let startTimestamp: Date = new Date(match.startTimestamp);

    const minutes: string = '' + startTimestamp.getMinutes();
    const minutesToDisplay: string = minutes.padStart(2, minutes);
    const dateString: string = startTimestamp.toLocaleDateString();

    // TODO: Turn this into a component.
    const scoreView = () => {
        if (fullMatchInfo) {
            let score;

            score = () => {
                return <Typography variant="body1"
                                   sx={scoreDiv}>{fullMatch.score.home} - {fullMatch.score.away}</Typography>;
            }
            let startTimeOrLive: string;
            if (fullMatchInfo?.finished) {
                startTimeOrLive = 'FINISHED';
            } else if (startTimestamp < new Date()) {
                startTimeOrLive = 'LIVE NOW';
            } else {
                startTimeOrLive = `${dateString} ${startTimestamp.getHours()}:${minutesToDisplay}`;
                score = undefined;
            }
            const fullMatch = fullMatchInfo as Match;
            return (
                <div>
                    {score ? score() : undefined}
                    <Typography
                        sx={startTimestampMargin}>{startTimeOrLive}
                    </Typography>
                </div>
            );
        } else {
            return <CircularProgress sx={progress}/>;
        }
    };

    return (
        <div style={{textAlign: "center"}}>
            <div style={{
                display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between',
                width: '100%', marginTop: '1em', marginBottom: '0.6em'
            }}>
                <div style={{width: '7.8em', textAlign: 'center', whiteSpace: 'nowrap'}}>
                    <img style={{
                        width: '5em',
                        height: '5em',
                        display: 'block',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginBottom: '0.5em'
                    }}
                         src={homeTeamIconUrl} alt={match.homeTeamName}/>
                    <Typography
                        sx={marginHalfEm}>{homeTeamName}</Typography>
                </div>
                <div style={{marginTop: '2em', marginBottom: '2em'}}><Typography variant="body1">/</Typography></div>
                <div style={{width: '7.8em', textAlign: 'center', whiteSpace: 'nowrap'}}>
                    <img style={{
                        width: '5em',
                        height: '5em',
                        display: 'block',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginBottom: '0.5em'
                    }}
                         src={awayTeamIconUrl} alt={awayTeamName}/>
                    <Typography sx={marginHalfEm}>{awayTeamName}</Typography>
                </div>
            </div>
            {scoreView()}
        </div>
    );
};

export default MatchInfoWithScores;
