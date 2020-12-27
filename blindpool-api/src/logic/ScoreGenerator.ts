import {ParticipantAndScore, Score, UserType} from "../models/Blindpool";
import deepEqual from "deep-equal";

const wildcard = -1;
const wildcardScore: Score = {home: wildcard, away: wildcard};

const generateScores = (numberOfParticipants: number) => {
    let x: number;
    let y: number;

    const scores: Array<Score> = [wildcardScore];

    for (x = 0; scores.length < numberOfParticipants; x++) {
        for (y = 0; y <= x && scores.length < numberOfParticipants; y++) {
            const xyscore: Score = {home: x, away: y};
            const yxscore: Score = {home: y, away: x};

            scores.push(xyscore); // First combination (ie 1-0)

            if (scores.length < numberOfParticipants && !deepEqual(xyscore, yxscore)) { // Add second combination if it fits (ie 0-1)
                scores.push(yxscore);
            } else {
                break;
            }
        }
    }
    return scores;
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array: Array<any>) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export const assignRandomScores = (participantNames: Array<string>) => {
    let generatedScores: Array<Score> = generateScores(participantNames.length);
    shuffleArray(generatedScores);

    const assignedParticipantsAndScores: Array<ParticipantAndScore> = participantNames.map((name, index) => {
        const participantAndScore: ParticipantAndScore = {
            participant: {name: name.trim(), userType: UserType.ANONYMOUS}, score: generatedScores[index]
        };
        return participantAndScore;
    });

    return assignedParticipantsAndScores;
}