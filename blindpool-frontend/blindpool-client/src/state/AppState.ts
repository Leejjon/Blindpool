import Blindpool from "../model/Blindpool";
import {Match} from "../model/Match";

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

    setSelectedMatch(selectedMatch: Match | string| undefined) {
        this.selectedMatch = selectedMatch;
    }
}

let appState = new AppState();

export default appState;