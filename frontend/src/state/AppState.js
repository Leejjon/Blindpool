
class AppState {
    poolData = {};

    setPool(poolData) {
        this.poolData = poolData;
    }
}

let appState = new AppState();
export default appState;