package net.leejjon.blindpool.logic;

import net.leejjon.blindpool.model.Participant;
import net.leejjon.blindpool.model.ParticipantScore;
import net.leejjon.blindpool.model.UserType;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;

public class ScoreGeneratorTest {
    @Test
    public void testGeneratingScores_fiveUsers_Succeed() {
        String[] participantNames = {"Leon", "Niels", "Dirk", "Jaimy", "Robert"};

        List<Participant> participantList = Arrays.stream(participantNames).map(participantName -> new Participant(participantName, UserType.ANONYMOUS)).collect(Collectors.toList());
        List<ParticipantScore> participantScores = ScoreGenerator.assignRandomScores(participantList);
        assertEquals(participantNames.length, participantScores.size());
    }

    @Test
    public void testGeneratingScores_oneUser_fail() {
        String[] participantNames = {"Leon"};

        List<Participant> participantList = Arrays.stream(participantNames).map(participantName -> new Participant(participantName, UserType.ANONYMOUS)).collect(Collectors.toList());
        List<ParticipantScore> participantScores = ScoreGenerator.assignRandomScores(participantList);
        assertEquals(participantNames.length, participantScores.size());
    }

    @Test
    public void testGeneratingScores_oneTwoUsers_fail() {
        String[] participantNames = {"Leon", "Blabla"};

        List<Participant> participantList = Arrays.stream(participantNames).map(participantName -> new Participant(participantName, UserType.ANONYMOUS)).collect(Collectors.toList());
        List<ParticipantScore> participantScores = ScoreGenerator.assignRandomScores(participantList);
        assertEquals(participantNames.length, participantScores.size());
    }
}
