package net.leejjon.blindpool.storage;

import com.google.appengine.api.datastore.*;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import net.leejjon.blindpool.logic.ScoreGenerator;
import net.leejjon.blindpool.model.Participant;
import net.leejjon.blindpool.model.ParticipantScore;
import net.leejjon.blindpool.model.Pool;
import net.leejjon.blindpool.storage.persistence.KindType;
import net.leejjon.blindpool.storage.persistence.PoolProperties;
import org.hashids.Hashids;

import java.lang.reflect.Type;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Simple class to do stuff with the pools in the datastore.
 *
 * @author Leejjon
 */
public class PoolDataServiceImpl implements PoolDataService {
    private final static Logger log = Logger.getLogger(PoolDataServiceImpl.class.getName());

    @Override
    public Pool createPool(List<Participant> participantNames) {
        // Create the entity of the pool.
        List<ParticipantScore> participantScores = ScoreGenerator.assignRandomScores(participantNames);


        Entity poolEntity = new Entity(KindType.POOL.toString());
        poolEntity.setProperty(PoolProperties.PARTICIPANTS_AND_SCORES.name(), new Gson().toJson(participantScores));

        // I think I should only be using Java 8 time libraries, however Google Datastore has java.util.Date
        // as the recommended way to store a timestamp.
        // https://cloud.google.com/appengine/docs/standard/java/datastore/entities#Java_Properties_and_value_types
        OffsetDateTime utc = OffsetDateTime.now(ZoneOffset.UTC);
        Date timestamp = Date.from(utc.toInstant());
        poolEntity.setProperty(PoolProperties.CREATED_TIMESTAMP.name(), timestamp);

        // Store the new pool entity and return the key.
        Key key = DatastoreServiceFactory.getDatastoreService().put(poolEntity);
        log.info("Key is: " + key.toString());
        // TODO: Do the increment action and the save in one transaction maybe?

        try {
            new ShardedCounter().increment();
        } catch (Exception e) {
            log.log(Level.WARNING, "Something went wrong when incrementing the pool count. We caught the " +
                    "exception to make sure the pool was still saved. This means the pool count might be off.", e);
        }

        String youtubeIshId = new Hashids().encode(key.getId());
        return new Pool(youtubeIshId, participantScores, null, null, null, timestamp.getTime());
    }

    @Override
    public Pool getPool(String key) throws EntityNotFoundException {
        // Hopefully this will always contain one.
        long[] keys = new Hashids().decode(key);

        if (keys.length == 0) {
            throw new IllegalArgumentException("Length of key is invalid.");
        } else {
            long decodedKey = keys[0];

            Entity entity = DatastoreServiceFactory.getDatastoreService().get(KeyFactory.stringToKey(KeyFactory.createKeyString(KindType.POOL.toString(), decodedKey)));

            String jsonizedParticipantsAndScores = entity.getProperty(PoolProperties.PARTICIPANTS_AND_SCORES.name()).toString();
            Date createdTimestamp = (Date) entity.getProperty(PoolProperties.CREATED_TIMESTAMP.name());

            Type listType = new TypeToken<ArrayList<ParticipantScore>>(){}.getType();
            ArrayList<ParticipantScore> participantScores = new Gson().fromJson(jsonizedParticipantsAndScores, listType);

            String youtubeIshId = new Hashids().encode(entity.getKey().getId());
            return new Pool(youtubeIshId, participantScores, null, null, null, createdTimestamp.getTime());
        }
    }

    @Override
    public long getPoolCount() {
        return new ShardedCounter().count();
    }
}
