export interface Match {
    id?: string
    startTimestamp: Date,
    currentScore?: Score,
    homeTeamName: string,
    homeTeamID: string,
    awayTeamName: string,
    awayTeamID: string
}

export interface Score {
    home: number
    away: number
}