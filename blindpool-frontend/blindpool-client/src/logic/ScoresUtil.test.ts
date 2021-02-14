import {canThisScoreStillWin} from "./ScoresUtil";
import {ParticipantAndScore} from "../model/Blindpool";

describe('Test scoresThatCanStillWin function', () => {
    test('Inge has the score 0-2 and wins', () => {
        const participantAndScores: Array<ParticipantAndScore> = [
                {"score":{"away":1,"home":0},"participant":{"name":"Leon","userType":0}},
                {"score":{"away":-1,"home":-1},"participant":{"name":"Sylvia","userType":0}},
                {"score":{"away":2,"home":0},"participant":{"name":"Inge","userType":0}},
                {"score":{"away":0,"home":0},"participant":{"name":"Peter","userType":0}},
                {"score":{"away":1,"home":1},"participant":{"name":"Simone","userType":0}},
                {"score":{"away":0,"home":1},"participant":{"name":"Yvette","userType":0}},
                {"score":{"away":0,"home":2},"participant":{"name":"Yde","userType":0}}
            ];

        expect(canThisScoreStillWin({home: 0, away: 2}, participantAndScores, {home: 0, away: 2}, true)).toBe(true);
        expect(canThisScoreStillWin({home: -1, away: -1}, participantAndScores, {home: 0, away: 2}, true)).toBe(false);
    });
    test('Yde wins with wildcard score', () => {
        const participantAndScores: Array<ParticipantAndScore> = [
            {"score":{"away":0,"home":1},"participant":{"name":"Leon","userType":0}},
            {"score":{"away":1,"home":1},"participant":{"name":"Sylvia","userType":0}},
            {"score":{"away":2,"home":0},"participant":{"name":"Inge","userType":0}},
            {"score":{"away":0,"home":2},"participant":{"name":"Peter","userType":0}},
            {"score":{"away":0,"home":0},"participant":{"name":"Simone","userType":0}},
            {"score":{"away":1,"home":0},"participant":{"name":"Yvette","userType":0}},
            {"score":{"away":-1,"home":-1},"participant":{"name":"Yde","userType":0}}
        ];

        expect(canThisScoreStillWin({home: -1, away: -1}, participantAndScores, {home: 2, away: 2}, true)).toBe(true);
    });
});
