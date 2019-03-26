package net.leejjon.blindpool.storage;

import com.google.cloud.Timestamp;
import com.google.cloud.datastore.*;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.hashids.Hashids;

import net.leejjon.blindpool.logic.ScoreGenerator;
import net.leejjon.blindpool.model.Participant;
import net.leejjon.blindpool.model.ParticipantScore;
import net.leejjon.blindpool.model.Pool;
import net.leejjon.blindpool.storage.persistence.Kind;
import net.leejjon.blindpool.storage.persistence.PoolProperties;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Simple class to do stuff with the pools in the datastore.
 *
 * @author Leejjon
 */
public class PoolDataServiceImpl implements PoolDataService {
    private final static Logger log = Logger.getLogger(PoolDataServiceImpl.class.getName());

    private final Datastore datastore;
    private final KeyFactory keyFactory;

    public PoolDataServiceImpl(Datastore datastore) {
        this.datastore = datastore;
        this.keyFactory = datastore.newKeyFactory().setKind(Kind.POOL.toString());
    }

    @Override
    public Pool createPool(List<Participant> participantNames) {
        // Create the entity of the pool.
        List<ParticipantScore> participantScores = ScoreGenerator.assignRandomScores(participantNames);

        KeyFactory keyFactory = datastore.newKeyFactory().setKind(Kind.POOL.toString());
        IncompleteKey key = keyFactory.newKey();

        Timestamp timestamp = Timestamp.now();
        FullEntity<IncompleteKey> newPoolEntity = Entity.newBuilder(key)  // Create the Entity
                .set(PoolProperties.PARTICIPANTS_AND_SCORES.name(), new Gson().toJson(participantScores))
                .set(PoolProperties.CREATED_TIMESTAMP.name(), timestamp)
                .build();

        // Store the new pool entity and return the key.
        Entity poolEntity = datastore.add(newPoolEntity); // Save the Entity
        long id = poolEntity.getKey().getId();
        log.info("Key is: " + id);
        // TODO: Do the increment action and the save in one transaction maybe?

        try {
            new ShardedCounter().increment();
        } catch (Exception e) {
            log.log(Level.WARNING, "Something went wrong when incrementing the pool count. We caught the " +
                    "exception to make sure the pool was still saved. This means the pool count might be off.", e);
        }

        String youtubeIshPoolId = new Hashids().encode(id);
        return new Pool(youtubeIshPoolId, participantScores, timestamp.toDate().getTime());
    }

    @Override
    public Optional<Pool> getPool(String key) {
        // Hopefully this will always contain one.
        long[] keys = new Hashids().decode(key);

        if (keys.length == 0) {
            throw new IllegalArgumentException("Length of key is invalid.");
        } else {
            long decodedKey = keys[0];

            Entity entity = datastore.get(keyFactory.newKey(decodedKey));

            if (entity == null) {
                return Optional.empty();
            } else {
                String jsonizedParticipantsAndScores = entity.getString(PoolProperties.PARTICIPANTS_AND_SCORES.name());
                Timestamp timestamp = entity.getTimestamp(PoolProperties.CREATED_TIMESTAMP.name());

                Type listType = new TypeToken<ArrayList<ParticipantScore>>() {}.getType();
                ArrayList<ParticipantScore> participantScores = new Gson().fromJson(jsonizedParticipantsAndScores, listType);

                String youtubeIshId = new Hashids().encode(entity.getKey().getId());
                return Optional.of(
                        new Pool(
                                youtubeIshId,
                                participantScores,
                                timestamp.toDate().getTime()
                        )
                );
            }
        }
    }

    @Override
    public long getPoolCount() {
        return new ShardedCounter().count();
    }
}
