import {Api, getHost} from "../utils/Network";
import {type Blindpool} from "../model/Blindpool";

export async function getPoolData(pool: string | Blindpool) {
    if ((pool as Blindpool).key) {
        // TODO: Figure out a better way to determine type.
        return pool as Blindpool;
    } else {
        const poolKey = pool as string;
        const response = await fetch(`${getHost(Api.pool)}/api/v2/pool/${poolKey}`);
        if (response.status === 200) {
            const poolJson: Blindpool = await response.json();
            // TODO: Validation
            return poolJson;
        } else if (response.status === 404) {
            throw Error('POOL_NOT_FOUND');
        } else {
            throw Error('BACKEND_OFFLINE');
        }
    }
}
