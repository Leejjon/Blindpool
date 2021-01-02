import {ParticipantAndScore} from "../../../blindpool-api/src/models/Blindpool";
import {Score} from "../model/Score";
import {Match} from "../model/Match";

export const isWinner = (score: Score, participantScores: Array<ParticipantAndScore>, fullMatchInfo: Match): boolean => {
    if (fullMatchInfo.finished) {
        const scores = scoresThatCanStillWin(participantScores, fullMatchInfo.score);

        if (scores.length === 1 && score.home === -1 && score.away === -1) {
            return true;
        } else {
            return score.home === fullMatchInfo.score.home && score.away === fullMatchInfo.score.away;
        }
    } else {
        return false;
    }
};

export const scoresThatCanStillWin = (participantScores: Array<ParticipantAndScore>, score: Score): Array<Score> => {
    let scoresThatCanStillWin: Array<Score> = [];
    for (const participantAndScore of participantScores) {
        if (isWildCard(participantAndScore.score)) {
            scoresThatCanStillWin.push(participantAndScore.score);
        } else if (score.home <= participantAndScore.score.home  && score.away <= participantAndScore.score.away) {
            scoresThatCanStillWin.push(participantAndScore.score);
        }
    }
    return scoresThatCanStillWin;
};

export const isWildCard = (participantScore: Score): boolean => {
    return participantScore.home === -1 || participantScore.away === -1;
};