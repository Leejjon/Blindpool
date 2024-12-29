import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { matchesQuery } from "./MatchesQuery";


export function useUpcomingMatches(competitionsToWatch: Array<number>, setMessage: (message?: string) => void) {
    const {data, isError, error} = useQuery({
        ...matchesQuery(competitionsToWatch)
    });
    useEffect(() => {
        if (isError) {
            setMessage(error.message);
        }
    }, [setMessage, isError, error]);
    return data;
}