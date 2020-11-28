import Blindpool from "../model/Blindpool";

class AppState {
    poolData: undefined | Blindpool = undefined;
    upcomingMatches: undefined | Match[] = undefined;
    selectedMatch: undefined | string | Match = undefined;

    setPool(poolData: Blindpool) {
        this.poolData = poolData;
    }

    setUpcomingMatches(upcomingMatches: Match[]) {
        this.upcomingMatches = upcomingMatches;
    }

    setSelectedMatch(selectedMatch: Match) {
        this.selectedMatch = selectedMatch;
    }
}

let appState = new AppState();

export interface Match {
    id?: string
    startTimestamp: Date,
    competitionName: string,
    currentScore: Score,
    homeTeamName: string,
    homeTeamID: string,
    awayTeamName: string,
    awayTeamID: string
}

export interface Score {
    home: number
    away: number
}

export default appState;