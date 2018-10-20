package net.leejjon.blindpool.api;

import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.gson.Gson;
import net.leejjon.blindpool.logic.ScoreGenerator;
import net.leejjon.blindpool.model.Participant;
import net.leejjon.blindpool.model.ParticipantScore;
import net.leejjon.blindpool.model.Pool;
import net.leejjon.blindpool.model.Score;
import net.leejjon.blindpool.storage.PoolDataServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.ws.rs.core.Response;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PoolApiTest {

    private PoolApi poolApi;

    @Mock
    private PoolDataServiceImpl poolDataService;

    @Test
    public void testCreatePool_success() {
        Pool poolToReturn = getPoolFourParticipants();
        when(poolDataService.createPool(any())).thenReturn(poolToReturn);

        poolApi = new PoolApi(poolDataService);
        Response poolResponse = poolApi.createPool(Arrays.asList("Leon", "Dirk", "Robert", "Jaimy"));
        assertEquals(200, poolResponse.getStatus());

        String jsonString = new Gson().toJson(poolResponse.getEntity());
        Pool poolFromJsonString = new Gson().fromJson(jsonString, Pool.class);
        assertEquals(poolToReturn, poolFromJsonString);
    }

    @Test
    public void testGetPool_success() throws EntityNotFoundException {
        Pool poolToReturn = getPoolFourParticipants();
        when(poolDataService.getPool(any())).thenReturn(poolToReturn);

        poolApi = new PoolApi(poolDataService);
        Response poolResponse = poolApi.getPool("anyPool");
        assertEquals(200, poolResponse.getStatus());
    }

    private Pool getPoolFourParticipants() {
        Participant participant1 = new Participant("Leon");
        Participant participant2 = new Participant("Dirk");
        Participant participant3 = new Participant("Robert");
        Participant participant4 = new Participant("Jaimy");

        Score score1 = new Score(ScoreGenerator.WILDCARD_CHARACTER, ScoreGenerator.WILDCARD_CHARACTER);
        Score score2 = new Score('0', '0');
        Score score3 = new Score('1', '0');
        Score score4 = new Score('0', '1');

        List<ParticipantScore> participantScoreList = Arrays.asList(
                new ParticipantScore(participant1, score1),
                new ParticipantScore(participant2, score2),
                new ParticipantScore(participant3, score3),
                new ParticipantScore(participant4, score4));

        return Pool.builder().key("1").participantsAndScores(participantScoreList).createdTimestamp(System.currentTimeMillis()).build();
    }
}