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

export interface Blindpool {
    key?: string, // When creating the pool the key isn't known yet. That's why its optional at first
    participantsAndScores: Array<ParticipantAndScore>,
    createdTimestamp: number,
}