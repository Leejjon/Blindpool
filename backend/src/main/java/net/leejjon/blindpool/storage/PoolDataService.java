package net.leejjon.blindpool.storage;

import com.google.appengine.api.datastore.EntityNotFoundException;
import net.leejjon.blindpool.model.Participant;
import net.leejjon.blindpool.model.Pool;

import java.util.List;

public interface PoolDataService {
    Pool createPool(List<Participant> participantNames);
    Pool getPool(String key) throws EntityNotFoundException;
    long getPoolCount();
}
