import { Blindpool } from '../models/Blindpool';
import { ok, err, Result } from 'neverthrow';
import {Datastore, Query} from "@google-cloud/datastore/build/src";
import {getDatastoreInstance} from "./DatastoreService";

export enum ErrorScenarios {
    NOT_FOUND,
    INTERNAL_ERROR
}

export const find = async (key: number): Promise<Result<Blindpool, ErrorScenarios>> => {
    try {
        const datastore = getDatastoreInstance();
        const query: Query = datastore.createQuery('pool')
            .filter('__key__', '=', datastore.key(['pool', key]));
        const [entities] = await datastore.runQuery(query);
        const poolEntity = entities[0];

        if (poolEntity === undefined) {
            return err(ErrorScenarios.NOT_FOUND);
        }
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
    const datastore = getDatastoreInstance();
    return ok(5);
};

// const getPools = () => {
//     const query = datastore
//         .createQuery('pool')
//         .order('CREATED_TIMESTAMP', {descending: true})
//         .limit(10);
//     return datastore.runQuery(query);
// };