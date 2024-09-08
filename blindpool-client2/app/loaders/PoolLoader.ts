import { QueryClient } from "@tanstack/react-query";
import { poolQuery } from "../queries/PoolQuery";


export async function poolLoader(queryClient: QueryClient, key: string) {
    try {
        return await queryClient.ensureQueryData({...poolQuery(key)});
    } catch (e) {
        if (e instanceof Error) {
            console.error(`Could not retrieve pool because of reason: ${e.message}`);
        } else {
            console.error(e);
        }
        return null; // This is needed to avoid the following error: "You defined a loader for route "0-0" but didn't return anything from your `loader` function. Please return a value or `null`."
    }
}