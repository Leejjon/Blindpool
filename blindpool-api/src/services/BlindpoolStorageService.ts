import { Datastore } from '@google-cloud/datastore';
import { Blindpool } from '../models/Blindpool'
import {RunQueryResponse} from "@google-cloud/datastore/build/src/query";

// Instantiate a datastore client
const datastore = new Datastore();

const pool: Blindpool = {
    key: '123',
    participantsAndScores: [{participant: {name: 'Hoi', userType: 1}, score: {homeClubScore: '1', awayClubScore: '0'}}],
    // createdTimestamp: BigInt(101)
};

export const find = async (key: string): Promise<Blindpool> => {
    console.log(`Requesting blindpool with key: ${key}`);

    const [entities]: RunQueryResponse = await getPools();

    console.log(`${entities.length}`);

    if (key === pool.key) {
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