import {getPoolData} from "../api/GetPoolData";
import Blindpool from "../model/Blindpool";

export function getPoolId(pool: string | Blindpool) {
    if ((pool as Blindpool).key) {
        return (pool as Blindpool).key;
    } else {
        return pool as string;
    }
}

export const poolQuery = (pool: string | Blindpool) => (
    {
        queryKey: ["pool", getPoolId(pool)],
        queryFn: async () => { return await getPoolData(pool) },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        cacheTime: 5000,
        staleTime: 4000,
        retry: false,
    }
);
