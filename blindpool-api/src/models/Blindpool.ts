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
    key: string,
    participantsAndScores: Array<ParticipantAndScore>,
    createdTimestamp: bigint
}