import { QueryClient } from "@tanstack/react-query";
import { matchesQuery } from "../queries/MatchesQuery";
import { getCompetitionsFromLocalStorage } from "../storage/PreferredCompetitions";

export async function matchesLoader(queryClient: QueryClient) {
    try {
        return await queryClient.ensureQueryData(matchesQuery(getCompetitionsFromLocalStorage()));
    } catch (e) {
        if (e instanceof Error) {
            console.error(`Could not retrieve matches because of reason: ${e.message}`);
        } else {
            console.error(e);
        }
        return null; // This is needed to avoid the following error: "You defined a loader for route "0-0" but didn't return anything from your `loader` function. Please return a value or `null`."
    }
}