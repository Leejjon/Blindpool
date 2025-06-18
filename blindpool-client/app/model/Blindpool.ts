import {type Match} from "./Match";
import {type Score} from "./Score";

interface Participant {
    name: string,
    userType: number
}

export interface ParticipantAndScore {
    participant: Participant,
    score: Score
}

export interface Blindpool {
    key: string,
    PARTICIPANTS_AND_SCORES: Array<ParticipantAndScore>,
    CREATED_TIMESTAMP: Date,
    MATCH?: Match,
    FREE_FORMAT_MATCH?: string
}