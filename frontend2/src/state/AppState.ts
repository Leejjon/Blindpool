import Blindpool from "../model/Blindpool";

class AppState {
    poolData: undefined | Blindpool = undefined;

    setPool(poolData: Blindpool) {
        this.poolData = poolData;
    }
}

let appState = new AppState();

export default appState;