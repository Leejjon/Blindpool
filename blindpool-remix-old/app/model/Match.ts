import {Score} from "./Score";

export interface Match {
    id: string
    startTimestamp: Date,
    competitionName: string,
    homeTeamName: string,
    homeTeamID: string,
    awayTeamName: string,
    awayTeamID: string,
    finished: boolean,
    score: Score
}

export function doesMatchExistIn(matchId: string, matches: Match[]): string | undefined {
    for (const match of matches) {
        if (match.id === matchId) {
            return matchId;
        }
    }
    return undefined;
}
