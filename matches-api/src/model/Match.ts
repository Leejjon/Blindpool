export interface Match {
    sourceId: number;
    startTimestamp: Date,
    // TODO: make this competition ID in the future?
    competitionName: string,
    homeTeam: Score,
    awayTeam: Score,
};

export interface Score {
    name: string,
    score: number,
};