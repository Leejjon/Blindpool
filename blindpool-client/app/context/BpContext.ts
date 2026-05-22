import { useEffect, useState } from "react";
import { type Match } from "~/model/Match";
import { useOutletContext } from "react-router";
import { getCompetitionsFromLocalStorage, updateCompetitionsInLocalStorage } from "~/storage/PreferredCompetitions";

export interface BpMatchesProps {
    matches: Array<Match>;
}

export interface BpCompetitionProps {
    competitionsToWatch: Array<number>;
    setCompetitionsToWatch?: (competitions: Array<number>) => void;
}

export interface BpSnackbarProps {
    message?: string;
    setMessage: (message?: string) => void;
}

export type BpOutletContext = BpSnackbarProps & BpCompetitionProps;

export function useNewBlindpoolOutletContext(setMessage: (message?: string) => void, message?: string): BpOutletContext {
    const [competitionsToWatch, setCompetitionsToWatch] = useState<Array<number>>(getCompetitionsFromLocalStorage());

    useEffect(() => {
        updateCompetitionsInLocalStorage(competitionsToWatch);
    }, [competitionsToWatch, setCompetitionsToWatch]);

    return {
        message,
        setMessage,
        competitionsToWatch,
        setCompetitionsToWatch,
    };
}

export function useExistingBlindpoolOutletContext(): BpOutletContext {
    return useOutletContext<BpOutletContext>();
}

