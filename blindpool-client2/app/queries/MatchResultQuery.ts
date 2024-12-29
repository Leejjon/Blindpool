import {getMatchResultData} from "../api2/GetMatchResultData";

export const matchInfoQuery = (matchId: string | undefined, /*setMessage: (message: string | undefined) => void*/) => (
    {
        queryKey: ["matchInfo", matchId],
        queryFn: async () => { return await getMatchResultData(matchId)},
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        cacheTime: 5000,
        staleTime: 4000,
        retry: false,
    }
);
