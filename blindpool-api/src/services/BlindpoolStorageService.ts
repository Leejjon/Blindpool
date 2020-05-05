import {Blindpool} from '../models/Blindpool';
import {ok, err, Result} from 'neverthrow';
import {Transaction} from "@google-cloud/datastore/build/src";
import {getDatastoreInstance} from "./DatastoreService";

export enum Kinds {
    POOL_KIND = 'pool',
    COUNT_KIND = 'poolCounter'
}

const NUMBER_OF_SHARDS = 10;

export enum ErrorScenarios {
    NOT_FOUND,
    INTERNAL_ERROR
}

export const findBlindpoolByKey = async (key: number): Promise<Result<Blindpool, ErrorScenarios>> => {
    try {
        const datastore = getDatastoreInstance();
        const blindPoolKey = datastore.key([Kinds.POOL_KIND, key]);
        const [poolEntity] = await datastore.get(blindPoolKey);

        if (poolEntity === undefined) {
            return err(ErrorScenarios.NOT_FOUND);
        }

        // Obtaining the key is weird https://github.com/googleapis/google-cloud-node/issues/1768#issuecomment-258173627
        const participantsAndScores = JSON.parse(poolEntity.PARTICIPANTS_AND_SCORES);
        const createdTimestamp = poolEntity.CREATED_TIMESTAMP;
        const pool: Blindpool = {
            key: blindPoolKey.id as string,
            participantsAndScores: participantsAndScores,
            createdTimestamp: createdTimestamp
        };

        return ok(pool);
    } catch (e) {
        console.error(e.toString());
        return err(ErrorScenarios.INTERNAL_ERROR);
    }
};

export const insertNewBlindpool = async (participants: String[]): Promise<Result<Blindpool, ErrorScenarios>> => {
    return err(ErrorScenarios.INTERNAL_ERROR);
}

export const calculateBlindpoolCount = async (): Promise<Result<Number, ErrorScenarios>> => {
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

const incrementBlindpoolCount = async () => {
    // Pick a random shard id (possibilities are 0-9)
    const shardNumber = Math.floor(Math.random() * NUMBER_OF_SHARDS);
    let transaction: Transaction | undefined = undefined;
    try {
        const datastore = getDatastoreInstance();
        const key = datastore.key([Kinds.COUNT_KIND, shardNumber.toString()]);
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

            console.warn(`Could not find shard. Was the shard size increased? Created new shard for shardnumber: ${shardNumber}`);
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

