import { Datastore } from '@google-cloud/datastore';
import { Blindpool } from '../models/Blindpool'

// Switch to import to get code completion...
// import Hashids from 'hashids'
const Hashids = require('hashids/cjs');

const hashids = new Hashids();
const datastore = new Datastore();

export const find = async (key: string): Promise<Blindpool> => {
    const keyAsNumber = hashids.decode(key)[0] as number;
    const query = datastore
        .createQuery('pool')
        .filter('__key__', '=', datastore.key(['pool', keyAsNumber]));
    const [entities] = await datastore.runQuery(query);
    const poolEntity = entities[0];

    // Obtaining the key is weird https://github.com/googleapis/google-cloud-node/issues/1768#issuecomment-258173627
    const poolKey = poolEntity[datastore.KEY].id as string;
    const participantsAndScores = JSON.parse(poolEntity.PARTICIPANTS_AND_SCORES);
    const createdTimestamp = poolEntity.CREATED_TIMESTAMP;
    const pool: Blindpool = {key: poolKey, participantsAndScores: participantsAndScores, createdTimestamp: createdTimestamp};
    if (keyAsNumber === parseInt(poolKey)) {
        return pool;
    }
    throw new Error("No record found");
};

const getPools = () => {
    const query = datastore
        .createQuery('pool')
        .order('CREATED_TIMESTAMP', {descending: true})
        .limit(10);
    return datastore.runQuery(query);
};