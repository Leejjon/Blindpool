package net.leejjon.blindpool.logic;

import net.leejjon.blindpool.model.Participant;
import net.leejjon.blindpool.model.ParticipantScore;
import net.leejjon.blindpool.model.Score;

import java.util.*;

public class ScoreGenerator {
    public static final char WILDCARD_CHARACTER = 'X';

    public static List<ParticipantScore> assignRandomScores(List<Participant> participants) {
//        Preconditions.checkArgument();
        List<Score> randomScoresList = new ArrayList<>();
        randomScoresList.addAll(generateScores(participants.size()));

        // Pray this is random enough.
        Collections.shuffle(randomScoresList);

        List<ParticipantScore> participantScores = new ArrayList<>();
        for (int i = 0; i < participants.size(); i++) {
            participantScores.add(new ParticipantScore(participants.get(i), randomScoresList.get(i)));
        }

        return participantScores;
    }

    private static Set<Score> generateScores(int participantNameSize) {
        Set<Score> possibleScores = new HashSet<>();

        // Add the wildcard score.
        possibleScores.add(new Score(WILDCARD_CHARACTER, WILDCARD_CHARACTER));

        final int numberOfScoresThatWeNeedToGenerated = participantNameSize - 1;

        int x;
        int y;
        final int radix = 10;
        for (x = 0; possibleScores.size() < participantNameSize; x++) {
            for (y = 0; y <= x && possibleScores.size() < participantNameSize; y++) {
                char xChar = Character.forDigit(x, radix);
                char yChar = Character.forDigit(y, radix);

                // Add both combinations, if both are the same (ie when WILDCARD_CHARACTER and y are both 0) the item will be overridden.
                possibleScores.add(new Score(xChar, yChar));

                // Because we're trying to add two at once, check if we should.
                if (possibleScores.size() < participantNameSize) {
                    possibleScores.add(new Score(yChar, xChar));
                } else {
                    break;
                }
            }
        }
        return possibleScores;
    }


}
