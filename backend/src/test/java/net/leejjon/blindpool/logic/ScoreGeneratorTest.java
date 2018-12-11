package net.leejjon.blindpool.logic;

import com.google.gson.Gson;
import net.leejjon.blindpool.model.Participant;
import net.leejjon.blindpool.model.ParticipantScore;
import net.leejjon.blindpool.model.UserType;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;

class ScoreGeneratorTest {
    @Test
    void testGeneratingScores_fiveUsers_Succeed() {
        String[] participantNames = {"Leon", "Niels", "Dirk", "Jaimy", "Robert"};

        List<Participant> participantList = Arrays.stream(participantNames).map(participantName -> new Participant(participantName, UserType.ANONYMOUS)).collect(Collectors.toList());
        List<ParticipantScore> participantScores = ScoreGenerator.assignRandomScores(participantList);
        assertEquals(participantNames.length, participantScores.size());
    }

    @Test
    void testGeneratingScores_oneUser_fail() {
        String[] participantNames = {"Leon"};

        List<Participant> participantList = Arrays.stream(participantNames).map(participantName -> new Participant(participantName, UserType.ANONYMOUS)).collect(Collectors.toList());
        List<ParticipantScore> participantScores = ScoreGenerator.assignRandomScores(participantList);
        assertEquals(participantNames.length, participantScores.size());
    }

    @Test
    void testGeneratingScores_oneTwoUsers_fail() {
        String[] participantNames = {"Leon", "Blabla"};

        List<Participant> participantList = Arrays.stream(participantNames).map(participantName -> new Participant(participantName, UserType.ANONYMOUS)).collect(Collectors.toList());
        List<ParticipantScore> participantScores = ScoreGenerator.assignRandomScores(participantList);
        assertEquals(participantNames.length, participantScores.size());
    }

    @Test
    void testGeneratingScores_sevenUsers_Succeed() {
        String[] participantNames = {"Peter", "Leon", "Simone", "Inge", "Yvette", "Yde", "Baby"};

        List<Participant> participantList = Arrays.stream(participantNames).map(participantName -> new Participant(participantName, UserType.ANONYMOUS)).collect(Collectors.toList());

        for (int i = 0 ; i < 1000; i++) {
            List<ParticipantScore> participantScores = ScoreGenerator.assignRandomScores(participantList);
            assertEquals(participantNames.length, participantScores.size());
            boolean containsXX = false;
            for (ParticipantScore ps : participantScores) {
                if (ps.getScore().getAwayClubScore() == 'X') {
                    containsXX = true;
                }
            }
            if (!containsXX) {
                System.out.println(new Gson().toJson(participantScores));
                fail("No wildcard.");
            } else {
                assertEquals(participantNames.length, participantScores.size());
            }
        }
    }
}
