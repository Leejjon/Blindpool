import { QueryClient } from "@tanstack/react-query";
import { matchesQuery } from "../queries/MatchesQuery";
import { getCompetitionsFromLocalStorage } from "../storage/PreferredCompetitions";

export async function matchesLoader(queryClient: QueryClient) {
    const dummySetMessage = (message: string | undefined) => {};
    return await queryClient.ensureQueryData(matchesQuery(dummySetMessage, getCompetitionsFromLocalStorage()));
}