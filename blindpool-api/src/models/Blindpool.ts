import 'reflect-metadata'; // This import is needed for: https://github.com/typestack/class-transformer#working-with-nested-objects
import {
    IsNumber,
    IsOptional,
    IsString,
    Matches, ValidateNested,
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
    homeClubScore: string,
    awayClubScore: string
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

    constructor(PARTICIPANTS_AND_SCORES: Array<ParticipantAndScore>, CREATED_TIMESTAMP: Date, MATCH?: Match) {
        this.PARTICIPANTS_AND_SCORES = PARTICIPANTS_AND_SCORES;
        this.CREATED_TIMESTAMP = CREATED_TIMESTAMP;
        this.MATCH = MATCH;
    }
}

export class CreateBlindpoolRequest {
    @IsString({each: true})
    @Matches(/^([a-zA-Z0-9 _]{1,20})$/, {each: true})
    participants: string[];

    @ValidateNested()
    @Type(() => Match) // See https://github.com/typestack/class-transformer#working-with-nested-objects
    selectedMatch: Match

    constructor(participants: string[], selectedMatch: Match) {
        this.participants = participants;
        this.selectedMatch = selectedMatch;
    }
}

export class Match {
    @IsOptional() @IsNumber()
    id?: string | undefined;

    @IsOptional() @IsNumber()
    homeTeamID?: number | undefined;

    @IsOptional() @IsNumber()
    awayTeamID?: number | undefined;

    @IsString() @Matches(/^[a-zA-Z0-9 ]{2,25}$/)
    homeTeamName: string;

    @IsString() @Matches(/^[a-zA-Z0-9 ]{2,25}$/)
    awayTeamName: string;

    constructor(id: string | undefined, homeTeamID: number | undefined, awayTeamID: number | undefined, homeTeamName: string, awayTeamName: string) {
        this.id = id;
        this.homeTeamID = homeTeamID;
        this.awayTeamID = awayTeamID;
        this.homeTeamName = homeTeamName;
        this.awayTeamName= awayTeamName;
    }
}