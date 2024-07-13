import { useEffect, useState } from "react";
import { Match } from "../model/Match";
import { defaultCompetitions } from "../locales/i18n";
import { useOutletContext } from "react-router-dom";

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

export type BlindpoolOutletContext = BpSnackbarProps & BpCompetitionProps & BpSelectedMatchProps;

export function useNewBlindpoolOutletContext(setMessage: (message?: string) => void, message?: string): BlindpoolOutletContext {
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

export function useExistingBlindpoolOutletContext(): BlindpoolOutletContext {
    return useOutletContext<BlindpoolOutletContext>();
}

const localStorageName = "competitions";

function updateCompetitionsInLocalStorage(competitions: Array<number>) {
    const localCompetitions = localStorage.getItem("competitions");
    const competitionsStringified = JSON.stringify(competitions);
    if (JSON.stringify(competitions) === JSON.stringify(defaultCompetitions)) {
        localStorage.removeItem(localStorageName)
    } else if (localCompetitions !== competitionsStringified) {
        localStorage.setItem(localStorageName, competitionsStringified);
    }
}

function getCompetitionsFromLocalStorage(): Array<number> {
    // const localCompetitions = localStorage.getItem(localStorageName);
    // if (localCompetitions) {
    //     const localCompetitionsObject: Array<number> = JSON.parse(localCompetitions);
    //     if (localCompetitionsObject.includes(2018)) {
    //         return localCompetitionsObject;
    //     } else {
    //         localCompetitionsObject.push(2018);
    //         return localCompetitionsObject.sort(function(a, b) {
    //             return a - b;
    //         });
    //     }
    // } else {
    //     return defaultCompetitions;
    // }
    return [2018];
}