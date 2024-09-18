import { getDefaultCompetitions } from "../locales/i18n";

const localStorageName = "competitions";

export function updateCompetitionsInLocalStorage(competitions: Array<number>) {
    const localCompetitions = localStorage.getItem("competitions");
    const competitionsStringified = JSON.stringify(competitions);
    if (JSON.stringify(competitions) === JSON.stringify(getDefaultCompetitions())) {
        localStorage.removeItem(localStorageName)
    } else if (localCompetitions !== competitionsStringified) {
        localStorage.setItem(localStorageName, competitionsStringified);
    }
}

export function getCompetitionsFromLocalStorage(): Array<number> {
    const localCompetitions = localStorage.getItem(localStorageName);
    if (localCompetitions) {
        const localCompetitionsObject: Array<number> = JSON.parse(localCompetitions);
        return localCompetitionsObject.sort(function(a, b) {
            return a - b;
        });
    } else {
        return getDefaultCompetitions();
    }
}
