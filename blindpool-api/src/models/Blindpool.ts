import 'reflect-metadata'; // This import is needed for: https://github.com/typestack/class-transformer#working-with-nested-objects

interface Participant {
    name: string,
    userType: number
}

export enum UserType {
    ANONYMOUS,
    FACEBOOK,
    GOOGLE
}

export interface Score {
    home: number,
    away: number
}

export interface ParticipantAndScore {
    participant: Participant,
    score: Score
}

export class Blindpool {
    key?: string; // When creating the pool the key isn't known yet. That's why its optional at first
    PARTICIPANTS_AND_SCORES: Array<ParticipantAndScore>;
    CREATED_TIMESTAMP: Date;
    MATCH?: Match;
    FREE_FORMAT_MATCH?: string;

    constructor(PARTICIPANTS_AND_SCORES: Array<ParticipantAndScore>, CREATED_TIMESTAMP: Date, MATCH?: Match, FREE_FORMAT_MATCH?: string) {
        this.PARTICIPANTS_AND_SCORES = PARTICIPANTS_AND_SCORES;
        this.CREATED_TIMESTAMP = CREATED_TIMESTAMP;
        this.MATCH = MATCH;
        this.FREE_FORMAT_MATCH = FREE_FORMAT_MATCH;
    }
}

export interface Match {
    id: string;

    homeTeamID: number;

    awayTeamID: number;

    competitionName: string;

    homeTeamName: string;

    awayTeamName: string;

    startTimestamp: Date;
}
