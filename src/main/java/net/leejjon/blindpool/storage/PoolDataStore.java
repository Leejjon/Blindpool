package net.leejjon.blindpool.storage;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Query;
import net.leejjon.blindpool.model.Pool;

import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Simple class to do stuff with the pools in the datastore. Could not be
 * bothered to create an entire DAO layer.
 *
 * @author Leejjon
 */
public class PoolDataStore {

    private final static Logger log = Logger.getLogger(PoolDataStore.class.getName());

    private final DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

    public void createPool() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public Pool getPool(String key) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void deletePool() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public long countPools() {
        Query countPools = new Query(Kind.POOL.toString());

        /* TODO: If my app ever has more than 1000 pools I'll have to fix this.
         * Read:
         * https://cloud.google.com/appengine/articles/sharding_counters
         * Use something like this:
         * https://github.com/instacount/appengine-counter
         */
        FetchOptions fo = FetchOptions.Builder.withLimit(1000);
        int entities = datastore.prepare(countPools).countEntities(fo);
        log.log(Level.INFO, "Retrieved pool count: " + entities);
        return entities;
    }
    
    /**
     * 
     * @return The number of pools from the database.
     */
    public static long getPoolCount() {
        return new PoolDataStore().countPools();
    }
}
