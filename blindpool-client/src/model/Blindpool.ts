
interface Participant {
    name: string,
    userType: number
}

interface Score {
    homeClubScore: string,
    awayClubScore: string
}

interface ParticipantAndScore {
    participant: Participant,
    score: Score
}

interface Blindpool {
    key: string,
    PARTICIPANTS_AND_SCORES: Array<ParticipantAndScore>,
    CREATED_TIMESTAMP: Date
}

export default Blindpool;