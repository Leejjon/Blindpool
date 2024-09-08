import {getUpcomingMatches} from "../api/GetUpcomingMatches";

export const matchesQuery = (competitionsToWatch: Array<number>) => (
    {
        queryKey: ["matches", competitionsToWatch.toString()],
        queryFn: async () => { 
            return await getUpcomingMatches(competitionsToWatch)
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        cacheTime: 5000,
        staleTime: 60000,
        retry: false,
    }
);
