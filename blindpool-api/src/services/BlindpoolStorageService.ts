/**
 * Data Model Interfaces
 */
import { Blindpool } from '../models/Blindpool'

const pool: Blindpool = {
    key: '123',
    participantsAndScores: [{participant: {name: 'Hoi', userType: 1}, score: {homeClubScore: '1', awayClubScore: '0'}}],
    // createdTimestamp: BigInt(101)
};

export const find = async (key: string): Promise<Blindpool> => {
    console.log(`Requesting blindpool with key: ${key}`);
    if (key === pool.key) {
        return pool;
    }
    throw new Error("No record found");
};