import {
    IsNumber,
    IsOptional,
    IsString,
    Matches,
} from "class-validator";

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

    constructor(PARTICIPANTS_AND_SCORES: Array<ParticipantAndScore>, CREATED_TIMESTAMP: Date) {
        this.PARTICIPANTS_AND_SCORES = PARTICIPANTS_AND_SCORES;
        this.CREATED_TIMESTAMP = CREATED_TIMESTAMP;
    }
}

export class CreateBlindpoolRequest {
    @IsString({each: true})
    @Matches(/^([a-zA-Z0-9 _]{1,20})$/, {each: true})
    participants: string[];

    selectedMatch?: SelectedMatch

    constructor(participants: string[], selectedMatch?: SelectedMatch) {
        this.participants = participants;
        this.selectedMatch = selectedMatch;
    }
}

export class SelectedMatch {
    @IsOptional() @IsNumber()
    id?: number | undefined;

    @IsOptional() @IsNumber()
    homeTeamID?: number | undefined;

    @IsOptional() @IsNumber()
    awayTeamID?: number | undefined;

    @IsString() @Matches(/^[a-zA-Z0-9 ]{2,25}$/)
    homeTeamName: string;

    @IsString() @Matches(/^[a-zA-Z0-9 ]{2,25}$/)
    awayTeamName: string;

    constructor(id: number, homeTeamID: number, awayTeamID: number, homeTeamName: string, awayTeamName: string) {
        this.id = id;
        this.homeTeamID = homeTeamID;
        this.awayTeamID = awayTeamID;
        this.homeTeamName = homeTeamName;
        this.awayTeamName= awayTeamName;
    }
}