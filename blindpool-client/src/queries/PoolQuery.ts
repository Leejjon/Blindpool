import {getPoolData} from "../api/GetPoolData";

export const poolQuery = (key: string) => (
    {
        queryKey: ["pool", key],
        queryFn: async () => { return await getPoolData(key)},
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        cacheTime: 5000,
        staleTime: 4000,
        retry: false,
    }
);
