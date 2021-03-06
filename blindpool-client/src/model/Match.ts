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