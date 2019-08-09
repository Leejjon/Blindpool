
class AppState {
    poolData = {};

    setPool(poolData) {
        console.log("en hier2");
        this.poolData = poolData;
    }
}

let appState = new AppState();
export default appState;