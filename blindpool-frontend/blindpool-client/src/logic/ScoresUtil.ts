import {ParticipantAndScore} from "../../../../blindpool-api/src/models/Blindpool";
import {Score} from "../model/Score";

const compareScore = (score1: Score, score2: Score): boolean => {
    return score1.home === score2.home && score1.away === score2.away;
}

export const canThisScoreStillWin = (scoreThatCouldWin: Score, participantScores: Array<ParticipantAndScore>, actualScore: Score, finished: boolean): boolean => {
    if (finished) {
        if (compareScore(scoreThatCouldWin, actualScore)) {
            return true;
        } else {
            if (isWildCard(scoreThatCouldWin)) {
                const matchingScores = participantScores.filter((participantScore) => compareScore(participantScore.score, actualScore));
                if (matchingScores.length === 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    } else {
        if (isWildCard(scoreThatCouldWin) || (actualScore.home <= scoreThatCouldWin.home && actualScore.away <= scoreThatCouldWin.away)) {
            return true;
        } else {
            return false;
        }
    }
};

export const isWildCard = (participantScore: Score): boolean => {
    return participantScore.home === -1 || participantScore.away === -1;
};
