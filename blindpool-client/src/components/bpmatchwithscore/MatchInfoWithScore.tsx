import appState from "../../state/AppState";
import {Match} from "../../model/Match";
import {getHostnameWithPortIfLocal} from "../../utils/Network";
import {CircularProgress, makeStyles, Typography} from "@material-ui/core";
import React from "react";
import {getAwayTeamNameToDisplay, getHomeTeamNameToDisplay} from "../../locales/i18n";

const useStyles = makeStyles({
    clubIconStyle: {
        width: '5em', height: '5em', display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom: '0.5em'
    },
    containerForClubIcons: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: '1em',
        marginBottom: '0.6em'
    },
    clubIconAndTextDiv: {
        width: '7.8em', textAlign: 'center', whiteSpace: 'nowrap'
    },
    slashIcon: {
        marginTop: '2em', marginBottom: '2em'
    },
    marginHalfEm: {
        margin: '0.5em', fontSize: 'medium', fontWeight: 'bold'
    },
    justCenter: {
        textAlign: 'center'
    },
    startTimestampMargin: {
        marginTop: '0', fontSize: 'medium', fontWeight: 'bold'
    },
    scoreDiv: {
        margin: '0',
        fontSize: 'xxx-large',
        color: '#333333'
    },
    progress: {
        margin: '1em',
    },
});

export interface MatchInfoWithScoreProps {
    fullMatchInfo: Match | undefined
}

const MatchInfoWithScores: React.FC<MatchInfoWithScoreProps> = ({fullMatchInfo}) => {
    const classes = useStyles();
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
                return <Typography variant="body1" className={classes.scoreDiv}>{fullMatch.score.home} - {fullMatch.score.away}</Typography>;
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
                        className={classes.startTimestampMargin}>{startTimeOrLive}
                    </Typography>
                </div>
            );
        } else {
            return <CircularProgress className={classes.progress}/>;
        }
    };

    return (
        <div className={classes.justCenter}>
            <div className={classes.containerForClubIcons}>
                <div className={classes.clubIconAndTextDiv}>
                    <img className={classes.clubIconStyle} src={homeTeamIconUrl}
                         alt={match.homeTeamName}/>
                    <Typography
                        className={classes.marginHalfEm}>{homeTeamName}</Typography>
                </div>
                <div className={classes.slashIcon}><Typography variant="body1">/</Typography></div>
                <div className={classes.clubIconAndTextDiv}>
                    <img className={classes.clubIconStyle} src={awayTeamIconUrl}
                         alt={awayTeamName}/>
                    <Typography
                        className={classes.marginHalfEm}>{awayTeamName}</Typography>
                </div>
            </div>
            {scoreView()}
        </div>
    );
};

export default MatchInfoWithScores;
