import 'mocha';
import {assignRandomScores} from "./ScoreGenerator";
import {expect} from 'chai';

describe('Testing the score generator', () => {
    it('Generating Five Scores - SUCCESS', () => {
        const participantAndScores = assignRandomScores(['Leon', 'Niels', 'Dirk', 'Jaimy', 'Robert']);
        expect(participantAndScores.length).equal(5);

        // Easy function to print the scores.
        // participantAndScores.forEach((participantAndScore) => {
        //     console.log(`Name: ${participantAndScore.participant.name} Score: ${participantAndScore.score.homeClubScore}-${participantAndScore.score.awayClubScore}`);
        // });
    });
});