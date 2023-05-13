
// TODO: Move these competition enums to the common.
export enum CompetitionEnum {
    // WORLD_CUP = 2000,
    EREDIVISIE = 2003,
    PREMIER_LEAGUE = 2021
}

interface Competition {
    name: string,
}

export const competitions: {[key: number]: Competition} = {
    // 2000: {name: "World Cup 2022", icon: "none"},
    // 2002: {name: "Bundesliga", icon: "premierleague.svg"},
    2003: {name: "Eredivisie"},
    2014: {name: "La Liga"},
    // 2015: {name: "Ligue 1", icon: "premierleague.svg"},
    // 2019: {name: "Serie A", icon: "premierleague.svg"},
    2021: {name: "Premier League"}
}

export function getCompetitionsList() {
    let competitionKeys = [];
    for (let key in competitions) {
        competitionKeys.push(Number(key));
    }
    return competitionKeys;
}


