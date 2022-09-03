import Blindpool from "../model/Blindpool";
import {Match} from "../model/Match";

class AppState {
    poolData: undefined | Blindpool = undefined;
    selectedMatch: undefined | string | Match = undefined;

    setPool(poolData: Blindpool) {
        this.poolData = poolData;
    }

    setSelectedMatch(selectedMatch: Match | string| undefined) {
        this.selectedMatch = selectedMatch;
    }
}

let appState = new AppState();

export default appState;
