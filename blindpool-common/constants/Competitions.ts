

export enum CompetitionEnum {
    EREDIVISIE = "Eredivisie",
    PREMIER_LEAGUE = "Premier League",
    LA_LIGA = "La Liga"
}

interface Competition {
    competition: CompetitionEnum
    // In the future we maybe get picture information etc here.
}

export const competitions: {[key: number]: Competition} = {
    // 2000: {name: "World Cup 2022"},
    // 2002: {name: "Bundesliga"},
    2003: {competition: CompetitionEnum.EREDIVISIE},
    2014: {competition: CompetitionEnum.LA_LIGA},
    // 2015: {name: "Ligue 1"},
    // 2019: {name: "Serie A"},
    2021: {competition: CompetitionEnum.PREMIER_LEAGUE}
}

export function getCompetitionsList() {
    let competitionKeys = [];
    for (let key in competitions) {
        competitionKeys.push(Number(key));
    }
    return competitionKeys;
}

export function getCompetitionKey(competition: CompetitionEnum) {
    for (let key in competitions) {
        const c = competitions[key];
        if (c.competition === competition) {
            return parseInt(key);
        }
    }
    throw Error("Competition does not exist.");
}
