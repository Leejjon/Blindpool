import {Blindpool, ParticipantAndScore, Match} from '../models/Blindpool';
import {ok, err, Result} from 'neverthrow';
import {Transaction} from "@google-cloud/datastore/build/src";
import {getDatastoreInstance} from "./DatastoreService";
import {ErrorScenarios} from "../models/ErrorScenarios";
// Switch to import to get code completion... The import version crashes on runtime though.
// import Hashids from 'hashids'
const Hashids = require('hashids/cjs');

const hashids = new Hashids();

export enum Kinds {
    POOL_KIND = 'pool',
    COUNT_KIND = 'poolCounter',
    MATCH_KIND = 'match'
}

const NUMBER_OF_SHARDS = 10;

export const findBlindpoolByKey = async (key: number): Promise<Result<Blindpool, ErrorScenarios>> => {
    try {
        const datastore = getDatastoreInstance();
        const blindpoolKey = datastore.key([Kinds.POOL_KIND, key]);
        const [poolEntity] = await datastore.get(blindpoolKey);

        if (poolEntity === undefined) {
            return err(ErrorScenarios.NOT_FOUND);
        }

        // Obtaining the key is weird https://github.com/googleapis/google-cloud-node/issues/1768#issuecomment-258173627
        const participantsAndScores = poolEntity.PARTICIPANTS_AND_SCORES;
        const createdTimestamp = poolEntity.CREATED_TIMESTAMP;
        const match = poolEntity.MATCH;

        let blindpool: Blindpool = {
            key: blindpoolKey.id as string,
            PARTICIPANTS_AND_SCORES: participantsAndScores,
            CREATED_TIMESTAMP: createdTimestamp
        };

        if (match) {
            blindpool.MATCH = match;
        }

        return ok(blindpool);
    } catch (e) {
        console.error(e.toString());
        return err(ErrorScenarios.INTERNAL_ERROR);
    }
};

export const insertNewBlindpool = async (participantsAndScores: Array<ParticipantAndScore>, match?: Match): Promise<Result<Blindpool, ErrorScenarios>> => {
    try {
        const datastore = getDatastoreInstance();
        const blindpoolKeyToInsert = datastore.key(Kinds.POOL_KIND);
        const createdTimestamp = new Date();
        let blindpoolToInsert: Blindpool = {
            PARTICIPANTS_AND_SCORES: participantsAndScores,
            CREATED_TIMESTAMP: createdTimestamp
        };

        if (match) {
            blindpoolToInsert.MATCH = match;
        }

        const entityToInsert = {
            key: blindpoolKeyToInsert,
            data: blindpoolToInsert,
        };

        const result = await datastore.upsert(entityToInsert);

        // This is how to get the id (not pretty):
        // https://stackoverflow.com/questions/46535582/datastore-get-last-inserted-id-with-node
        const poolId: string = result[0]?.mutationResults?.[0]?.key?.path?.[0]?.id as unknown as string;

        // Don't await for this, if it fails it will log something.
        incrementBlindpoolCount();

        let blindpoolToReturn: Blindpool = {
            key: hashids.encode(poolId),
            PARTICIPANTS_AND_SCORES: participantsAndScores,
            CREATED_TIMESTAMP: createdTimestamp
        }

        if (match) {
            blindpoolToReturn.MATCH = match;
        }

        return ok(blindpoolToReturn);
    } catch (e) {
        console.error(`Failed to insert pool: ${e.toString()}`);
        return err(ErrorScenarios.INTERNAL_ERROR);
    }
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
        console.error(e);
        if (transaction) {
            const rollbackResponses = await transaction.rollback();
            console.warn('Rolled back transaction: ' + rollbackResponses);
        }
    }
};

