export interface Match {
    startTimestamp: Date,
    competitionName: string,
    currentScore: Score,
    homeTeam: Team
}

export interface Team {
    name: string,
    iconUrl: string
}

export interface Score {
    home: number
    away: number
}