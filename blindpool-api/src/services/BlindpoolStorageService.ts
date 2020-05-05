import {Blindpool} from '../models/Blindpool';
import {ok, err, Result} from 'neverthrow';
import {Datastore, Query, Transaction} from "@google-cloud/datastore/build/src";
import {getDatastoreInstance} from "./DatastoreService";
import {google} from "@google-cloud/datastore/build/proto/datastore";
import Entity = google.datastore.v1.Entity;

enum Kinds {
    POOL_KIND = 'pool',
    COUNT_KIND = 'poolCounter'
}

const NUMBER_OF_SHARDS = 10;

export enum ErrorScenarios {
    NOT_FOUND,
    INTERNAL_ERROR
}

export const find = async (key: number): Promise<Result<Blindpool, ErrorScenarios>> => {
    try {
        const datastore = getDatastoreInstance();
        const query: Query = datastore.createQuery(Kinds.POOL_KIND)
            .filter('__key__', '=', datastore.key([Kinds.POOL_KIND, key]));
        const [entities] = await datastore.runQuery(query);
        const poolEntity = entities[0];

        if (poolEntity === undefined) {
            return err(ErrorScenarios.NOT_FOUND);
        }

        console.log(poolEntity[Datastore.KEY].path);

        // Obtaining the key is weird https://github.com/googleapis/google-cloud-node/issues/1768#issuecomment-258173627
        const poolKey = poolEntity[Datastore.KEY].id as string;
        const participantsAndScores = JSON.parse(poolEntity.PARTICIPANTS_AND_SCORES);
        const createdTimestamp = poolEntity.CREATED_TIMESTAMP;
        const pool: Blindpool = {
            key: poolKey,
            participantsAndScores: participantsAndScores,
            createdTimestamp: createdTimestamp
        };

        if (key === parseInt(poolKey)) {
            return ok(pool);
        } else {
            console.warn(`Expected the retrieved pool id ${parseInt(poolKey)} to match the key parameter ${key}`);
            return err(ErrorScenarios.INTERNAL_ERROR);
        }
    } catch (e) {
        console.error(e.toString());
        return err(ErrorScenarios.INTERNAL_ERROR);
    }
};

export const count = async (): Promise<Result<Number, ErrorScenarios>> => {
    try {
        const datastore = getDatastoreInstance();

        const query = datastore.createQuery(Kinds.COUNT_KIND);
        const [shards] = await datastore.runQuery(query);

        let totalNumberOfPools = 0;
        for (let shard of shards) {
            totalNumberOfPools += shard.count;
        }

        return ok(totalNumberOfPools);
    } catch (e) {
        console.error(e.toString());
        return err(ErrorScenarios.INTERNAL_ERROR);
    }
};

const increment = async () => {
    // Pick a random shard id (possibilities are 0-9)
    const shardNumber = Math.floor(Math.random() * 10);
    let transaction: Transaction | undefined = undefined;
    try {
        const datastore = getDatastoreInstance();
        const key = datastore.key(['poolCounter', shardNumber.toString()]);
        transaction = datastore.transaction();
        await transaction.run();

        const shards = await transaction.get(key);
        const retrievedShard = shards[0];

        if (retrievedShard) { // If shard exists, update the count.
            retrievedShard.count += 1;
            transaction.save([{
                key: key, data: retrievedShard
            }]);
        } else { // If shard doesn't exist, create shard with count=1.
            transaction.save([{
                key: key, data: {count: 1},
            }]);

            console.warn(
                `Somehow could not find shard. Was the shard size increased? 
                Created new shard for shardnumber: ${shardNumber}`
            );
        }
        await transaction.commit();
    } catch (e) {
        console.error(e.toString());
        if (transaction) {
            const rollbackResponses = await transaction.rollback();
            console.warn(rollbackResponses);
        }
    }
};

