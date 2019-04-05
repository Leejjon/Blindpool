package net.leejjon.blindpool.storage;

import net.leejjon.blindpool.storage.persistence.Kind;
import com.google.cloud.datastore.*;

import java.util.Random;
import java.util.logging.Logger;

/**
 * This initial implementation simply counts all instances of the
 * CounterShard kind in the datastore. The only way to increment the
 * number of shards is to add another shard by creating another entity in the
 * datastore.
 */
public class ShardedCounter {
    private static final Datastore DS = DatastoreOptions.getDefaultInstance().getService();

    private static final String COUNT_ATTRIBUTE = "count";

    /**
     * Default number of shards.
     */
    private static final int NUM_SHARDS = 10;

    /**
     * A random number generator, for distributing writes across shards.
     */
    private final Random generator = new Random();

    /**
     * A logger object.
     */
    private static final Logger LOG = Logger.getLogger(ShardedCounter.class
            .getName());

    /**
     * Retrieve the value of this sharded counter.
     *
     * @return Summed total of all shards' counts
     */
    public final long count() {
        Query<Entity> getAllShardsQuery = Query.newEntityQueryBuilder()
                .setKind(Kind.POOL_COUNTER_SHARD.toString())
                .build();

        QueryResults<Entity> allShardsResult = DS.run(getAllShardsQuery);

        long counter = 0;
        while (allShardsResult.hasNext()) {
            Entity shard = allShardsResult.next();
            counter += shard.getLong(COUNT_ATTRIBUTE);
        }

        return counter;
    }

    /**
     * Increment the value of this sharded counter.
     */
    final void increment() {
        int shardNum = generator.nextInt(NUM_SHARDS);

        Key shardKey = DS.newKeyFactory()
                .setKind(Kind.POOL_COUNTER_SHARD.toString())
                .newKey(Integer.toString(shardNum));

        Transaction tx = DS.newTransaction();
        Entity currentShard = tx.get(shardKey);

        final long count;
        final Entity incrementedShard;
        if (currentShard != null) {
            count = currentShard.getLong("count");
            incrementedShard = Entity.newBuilder(currentShard).set(COUNT_ATTRIBUTE, count + 1L).build();
        } else {
            incrementedShard = Entity.newBuilder(shardKey).set(COUNT_ATTRIBUTE, 1L).build();
        }

        tx.update(incrementedShard);
        tx.commit();
    }
}
