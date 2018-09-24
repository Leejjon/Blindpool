package net.leejjon.blindpool.storage;

import net.leejjon.blindpool.model.Participant;
import net.leejjon.blindpool.model.Pool;

import java.util.List;
import java.util.Optional;

public interface PoolDataService {
    Pool createPool(List<Participant> participantNames);
    Optional<Pool> getPool(String key);
}
