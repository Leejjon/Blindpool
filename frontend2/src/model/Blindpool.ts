
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
    participantsAndScores: Array<ParticipantAndScore>,
    createdTimestamp: bigint
}

export default Blindpool;