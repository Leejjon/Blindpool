import {type Match} from "../../model/Match";
import {getHostnameWithPortIfLocal} from "../../utils/Network";
import {CircularProgress, Typography} from "@mui/material";
import React from "react";
import {getAwayTeamNameToDisplay, getHomeTeamNameToDisplay} from "../../locales/i18n";
import "./MatchInfoWithScore.css";

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
    matchInfo: Match;
    fullMatchInfo: Match | undefined;
}

const MatchInfoWithScores: React.FC<MatchInfoWithScoreProps> = ({matchInfo, fullMatchInfo}) => {
    const homeTeamName = getHomeTeamNameToDisplay(matchInfo);
    const awayTeamName = getAwayTeamNameToDisplay(matchInfo);
    const homeTeamIconUrl = `${window.location.protocol}//${getHostnameWithPortIfLocal()}/clubicons/${matchInfo.homeTeamID}.svg`;
    const awayTeamIconUrl = `${window.location.protocol}//${getHostnameWithPortIfLocal()}/clubicons/${matchInfo.awayTeamID}.svg`;

    let startTimestamp: Date = new Date(matchInfo.startTimestamp);

    const minutes: string = '' + startTimestamp.getMinutes();
    const minutesToDisplay: string = minutes.padStart(2, minutes);
    const dateString: string = startTimestamp.toLocaleDateString();

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
            <div className="containerForClubIcons">
                <div className="clubIconAndTextDiv">
                    <img className="clubIconStyle" src={homeTeamIconUrl} alt={homeTeamName}/>
                    <Typography
                        sx={marginHalfEm}>{homeTeamName}</Typography>
                </div>
                <div className="slashIcon"><Typography variant="body1">/</Typography></div>
                <div className="clubIconAndTextDiv">
                    <img className="clubIconStyle" src={awayTeamIconUrl} alt={awayTeamName}/>
                    <Typography sx={marginHalfEm}>{awayTeamName}</Typography>
                </div>
            </div>
            {scoreView()}
        </div>
    );
};

export default MatchInfoWithScores;
