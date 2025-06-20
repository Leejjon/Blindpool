import { CompetitionEnum, getCompetitionKey } from "blindpool-common/constants/Competitions";
import { type Match } from "../model/Match";

export function getDefaultCompetitions(): Array<number> {
    return window.location.hostname.endsWith('blindepool.nl') ? [
        getCompetitionKey(CompetitionEnum.EREDIVISIE), getCompetitionKey(CompetitionEnum.CHAMPIONS_LEAGUE)
    ] : [getCompetitionKey(CompetitionEnum.PREMIER_LEAGUE), getCompetitionKey(CompetitionEnum.CHAMPIONS_LEAGUE)];
}

export interface dutchCountryNameMapping {
    [teamID: number]: string;
}

const dutchCountryNames: dutchCountryNameMapping = {
    758: 'Uruguay',
    759: 'Duitsland',
    760: 'Spanje',
    762: 'Argentinië',
    763: 'Ghana',
    764: 'Brazilië',
    765: 'Portugal',
    766: "Japan",
    768: 'Slowakije',
    769: 'Mexico',
    770: 'Engeland',
    771: 'Verenigde Staten',
    772: 'Zuid Korea',
    773: 'Frankrijk',
    777: 'Slovenië',
    779: 'Australië',
    780: 'Servië',
    781: 'Kameroen',
    791: 'Ecuador',
    782: 'Denemarken',
    784: 'Italië',
    788: 'Zwitserland',
    790: 'Oekraïne',
    792: 'Zweden',
    793: 'Costa Rica',
    794: 'Polen',
    798: 'Tsjechië',
    799: 'Kroatië',
    801: 'Saoedi-Arabië',
    802: 'Tunesië',
    803: 'Turkije',
    804: 'Senegal',
    805: 'België',
    808: 'Rusland',
    811: 'Roemenië',
    815: 'Marokko',
    816: 'Oostenrijk',
    827: 'Hongarije',
    828: 'Canada',
    833: 'Wales',
    840: 'Iran',
    1065: 'Albanië',
    1976: 'Finland',
    1977: 'Noord-Macedonië',
    1978: 'Georgië',
    8030: 'Qatar',
    8601: 'Nederland',
    8873: 'Schotland'
};

const getDutchCountryName = (teamId: number) => {
    return dutchCountryNames[teamId] || 'Unknown country';
}

export const getHomeTeamNameToDisplay = (match: Match) => {
    if (match.competitionName === 'European Cup' && window.location.hostname.endsWith('blindepool.nl')) {
        return getDutchCountryName(parseInt(match.homeTeamID));
    } else {
        return match.homeTeamName;
    }
}

export const getAwayTeamNameToDisplay = (match: Match) => {
    if (match.competitionName === 'European Cup' && window.location.hostname.endsWith('blindepool.nl')) {
        return getDutchCountryName(parseInt(match.awayTeamID));
    } else {
        return match.awayTeamName;
    }
}
