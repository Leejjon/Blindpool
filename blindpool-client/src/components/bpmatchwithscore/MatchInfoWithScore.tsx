import appState from "../../state/AppState";
import {Match} from "../../model/Match";
import {getHostnameWithPortIfLocal} from "../../utils/Network";
import {CircularProgress, makeStyles, Typography} from "@material-ui/core";
import React from "react";

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
        marginTop: '1em'
    },
    clubIconAndTextDiv: {
        width: '7.8em', textAlign: 'center', whiteSpace: 'nowrap'
    },
    slashIcon: {
        marginTop: '2em', marginBottom: '2em'
    },
    marginHalfEm: {
        margin: '0.5em', fontSize: 'small', fontWeight: 'bold'
    },
    justCenter: {
        textAlign: 'center'
    },
    startTimestampMargin: {
        marginTop: '0', fontSize: 'small', fontWeight: 'bold'
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
    const homeTeamIconUrl = `${window.location.protocol}//${getHostnameWithPortIfLocal()}/clubicons/${match.homeTeamID}.svg`;
    const awayTeamIconUrl = `${window.location.protocol}//${getHostnameWithPortIfLocal()}/clubicons/${match.awayTeamID}.svg`;

    // TODO: Move this logic to a util folder.
    let startTimestamp: Date = new Date(match.startTimestamp);

    let oldDateString = '1968-11-16T00:00:00';
    startTimestamp = new Date(oldDateString);

    const minutes: string = '' + startTimestamp.getMinutes();
    const minutesToDisplay: string = minutes.padStart(2, minutes);
    const dateString: string = startTimestamp.toLocaleDateString();

    // TODO: Turn this into a component.
    let startTimeOrLive: string;
    if (startTimestamp < new Date()) {
        startTimeOrLive = 'LIVE NOW';
    } else {
        startTimeOrLive = `${dateString} ${startTimestamp.getHours()}:${minutesToDisplay}`;
    }

    const scoreView = () => {
        if (fullMatchInfo && startTimestamp < new Date()) {
            const fullMatch = fullMatchInfo as Match;
            console.log(`${JSON.stringify(fullMatch)}`);
            return (
                <div>
                    <Typography variant="body1" className={classes.scoreDiv}>{fullMatch.score.home} - {fullMatch.score.away}</Typography>
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
                        className={classes.marginHalfEm}>{match.homeTeamName}</Typography>
                </div>
                <div className={classes.slashIcon}><Typography variant="body1">/</Typography></div>
                <div className={classes.clubIconAndTextDiv}>
                    <img className={classes.clubIconStyle} src={awayTeamIconUrl}
                         alt={match.awayTeamName}/>
                    <Typography
                        className={classes.marginHalfEm}>{match.awayTeamName}</Typography>
                </div>
            </div>
            {scoreView()}
        </div>
    );
};

export default MatchInfoWithScores;