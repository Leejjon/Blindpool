export interface Match {
    id?: string
    startTimestamp: Date,
    competitionName: string,
    currentScore: Score,
    homeTeam: string,
    homeTeamID: string,
    awayTeam: string,
    awayTeamID: string
}

export interface Score {
    home: number
    away: number
}