import {Api, getHost} from "../utils/Network";
import Blindpool from "../model/Blindpool";


export async function getPoolData(key: string) {
    const response = await fetch(`${getHost(Api.pool)}/api/v2/pool/${key}`);
    const poolJson: Blindpool = await response.json();
    // TODO: Validation
    return poolJson;
}
