import {getUpcomingMatches} from "../api/GetUpcomingMatches";

export const matchesQuery = (setMessage: (message: string | undefined) => void, competitionsToWatch: Array<number>) => (
    {
        queryKey: ["matches", competitionsToWatch.toString()],
        queryFn: async () => { return await getUpcomingMatches(setMessage, competitionsToWatch)},
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        cacheTime: 5000,
        staleTime: 4000,
        retry: false,
    }
);
