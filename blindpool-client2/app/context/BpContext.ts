import { useEffect, useState } from "react";
import { type Match } from "../model/Match";
import { useOutletContext } from "react-router";
import { getCompetitionsFromLocalStorage, updateCompetitionsInLocalStorage } from "../storage/PreferredCompetitions";

export interface BpMatchesProps {
    matches: Array<Match>;
}

export interface BpCompetitionProps {
    competitionsToWatch: Array<number>;
    setCompetitionsToWatch?: (competitions: Array<number>) => void;
}

export interface BpSelectedMatchProps {
    selectedMatchId?: string;
    setSelectedMatchId: (matchId: string | undefined) => void;
}

export interface BpSnackbarProps {
    message?: string;
    setMessage: (message?: string) => void;
}

export type BpOutletContext = BpSnackbarProps & BpCompetitionProps & BpSelectedMatchProps;

export function useNewBlindpoolOutletContext(setMessage: (message?: string) => void, message?: string): BpOutletContext {
    const [competitionsToWatch, setCompetitionsToWatch] = useState<Array<number>>(getCompetitionsFromLocalStorage());
    const [selectedMatchId, setSelectedMatchId] = useState<string>();

    useEffect(() => {
        updateCompetitionsInLocalStorage(competitionsToWatch);
    }, [competitionsToWatch, setCompetitionsToWatch]);

    return {
        message,
        setMessage,
        competitionsToWatch,
        setCompetitionsToWatch,
        selectedMatchId,
        setSelectedMatchId
    };
}

export function useExistingBlindpoolOutletContext(): BpOutletContext {
    return useOutletContext<BpOutletContext>();
}

