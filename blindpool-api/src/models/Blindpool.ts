import 'reflect-metadata'; // This import is needed for: https://github.com/typestack/class-transformer#working-with-nested-objects
import {
    IsDate,
    IsNumber,
    IsOptional,
    IsString,
    Matches, MaxLength, ValidateNested,
} from "class-validator";
import {Type} from "class-transformer";

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

export class CreateBlindpoolRequest {
    @IsString({each: true})
    @Matches(/^([a-zA-Z0-9 _]{1,20})$/, {each: true})
    participants: string[];

    @IsOptional()
    @IsString()
    selectedMatchID?: string

    @IsOptional()
    @IsString()
    @Matches(/^([a-zA-Z0-9 ]{5,50})$/)
    freeFormatMatch?: string;

    constructor(participants: string[], selectedMatch?: string, freeFormatMatch?: string) {
        this.participants = participants;
        this.selectedMatchID = selectedMatch;
        this.freeFormatMatch = freeFormatMatch
    }
}

export class Match {
    @IsString()
    id: string;

    @IsNumber()
    homeTeamID: number;

    @IsNumber()
    awayTeamID: number;

    @IsString() @Matches(/^[a-zA-Z0-9 ]{2,25}$/)
    homeTeamName: string;

    @IsString() @Matches(/^[a-zA-Z0-9 ]{2,25}$/)
    awayTeamName: string;

    @IsDate()
    startTimestamp: Date;

    constructor(id: string, homeTeamID: number, awayTeamID: number, homeTeamName: string, awayTeamName: string, startTimestamp: Date) {
        this.id = id;
        this.homeTeamID = homeTeamID;
        this.awayTeamID = awayTeamID;
        this.homeTeamName = homeTeamName;
        this.awayTeamName= awayTeamName;
        this.startTimestamp = startTimestamp;
    }
}