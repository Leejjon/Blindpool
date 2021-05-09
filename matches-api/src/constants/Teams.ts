import {EREDIVISIE_CODE, EREDIVISIE_NAME, EURO2020_CODE} from "../services/footballdata-api/constants";

const eredivisieTeams: {[key: number]: string} = {
    666: 'FC Twente',
    668: 'VVV Venlo',
    671: 'Heracles',
    672: 'Willem II',
    673: 'SC Heerenveen',
    674: 'PSV',
    675: 'Feyenoord',
    676: 'FC Utrecht',
    677: 'FC Groningen',
    678: 'Ajax',
    679: 'Vitesse',
    680: 'ADO Den Haag',
    682: 'AZ',
    683: 'RKC Waalwijk',
    684: 'PEC Zwolle',
    1914: 'FC Emmen',
    1920: 'Fortuna Sittard',
    6806: 'Sparta'
}

const euro2020Teams : {[key: number]: string} = {
    759: 'Germany',
    760: 'Spain',
    765: 'Portugal',
    768: 'Slovakia',
    770: 'England',
    773: 'France',
    782: 'Denmark',
    784: 'Italy',
    788: 'Switzerland',
    790: 'Ukraine',
    792: 'Sweden',
    794: 'Poland',
    798: 'Czech Republic',
    799: 'Croatia',
    803: 'Turkey',
    805: 'Belgium',
    808: 'Russia',
    816: 'Austria',
    827: 'Hungary',
    833: 'Wales',
    1976: 'Finland',
    1977: 'North Macedonia',
    8601: 'Netherlands',
    8873: 'Scotland'
};

export const getTeamName = (teamId: number, competitionId: number): string => {
    let teamName;

    if (competitionId === EREDIVISIE_CODE) {
       teamName = eredivisieTeams[teamId];
    }

    if (competitionId === EURO2020_CODE) {
        teamName = euro2020Teams[teamId];
    }
    return teamName ? teamName : 'Unknown team';
};

export const getCompetitionByTeam = (teamId: number): number => {
    const teamExistsInEredivisie: boolean = !!eredivisieTeams[teamId];
    if (teamExistsInEredivisie) {
        return EREDIVISIE_CODE;
    }
    const teamExistsInEuro2020: boolean = !! euro2020Teams[teamId];
    if (teamExistsInEuro2020) {
        return EURO2020_CODE;
    } else {
        console.log(teamId);
        throw Error('Invalid team id');
    }
}
