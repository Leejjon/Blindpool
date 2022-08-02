import Blindpool from "../model/Blindpool";
import {Match} from "../model/Match";
import {defaultCompetitions} from "../locales/i18n";

// So this is exactly
class AppState {
    leaguePreferences: Array<number>;
    constructor() {
        this.leaguePreferences = defaultCompetitions; // TODO: Retrieving logic from cookies / local storage
    }

    poolData: undefined | Blindpool = undefined;
    upcomingMatches: undefined | Match[] = undefined;
    selectedMatch: undefined | string | Match = undefined;

    setLeaguePreferences(leaguePreferences: Array<number>) {
        if (JSON.stringify(leaguePreferences.sort()) === JSON.stringify(defaultCompetitions.sort())) {
            // TODO: Delete cookies / local storage
        } else if (JSON.stringify(leaguePreferences.sort()) !== JSON.stringify(this.leaguePreferences.sort())) {
            this.leaguePreferences = leaguePreferences;
        } // Else do nothing.
    }

    setPool(poolData: Blindpool) {
        this.poolData = poolData;
    }

    setUpcomingMatches(upcomingMatches: Match[]) {
        this.upcomingMatches = upcomingMatches;
    }

    setSelectedMatch(selectedMatch: Match | string| undefined) {
        this.selectedMatch = selectedMatch;
    }
}

let appState = new AppState();

export default appState;
