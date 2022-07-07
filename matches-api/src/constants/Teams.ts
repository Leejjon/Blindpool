import {EREDIVISIE_CODE, EURO2020_CODE, PREMIER_LEAGUE_CODE} from "../services/footballdata-api/constants";

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
    670: 'Excelsior',
    718: 'Go Ahead Eagles',
    1909: 'SC Cambuur',
    1914: 'FC Emmen',
    1915: 'NEC Nijmegen',
    1919: 'FC Volendam',
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

const premierLeagueTeams : {[key: number]: string} = {
    57: 'Arsenal',
    58: 'Aston Villa',
    61: 'Chelsea',
    62: 'Everton',
    64: 'Liverpool',
    65: 'Manchester City',
    66: 'Manchester United',
    67: 'Newcastle United',
    68: 'Norwhich City',
    73: 'Tottenham Hotspur',
    76: 'Wolverhampton',
    328: 'Burnley',
    338: 'Leicester City',
    340: 'Southhampton',
    341: 'Leeds United',
    346: 'Watford',
    354: 'Crystal Palace',
    397: 'Brighton Hove',
    402: 'Bretford',
    563: 'West Ham'
}

export const getTeamName = (teamId: number, competitionId: string): string => {
    let teamName;

    if (competitionId === EREDIVISIE_CODE) {
       teamName = eredivisieTeams[teamId];
    }

    if (competitionId === EURO2020_CODE) {
        teamName = euro2020Teams[teamId];
    }

    if (competitionId === PREMIER_LEAGUE_CODE) {
        teamName = premierLeagueTeams[teamId];
    }
    return teamName ? teamName : 'Unknown team';
};

export const getCompetitionByTeam = (homeTeamId: number | null, awayTeamId: number | null): string => {
    if (homeTeamId === null || awayTeamId === null) {
        throw Error('This match is a placeholder, we ignore it.');
    }
    const teamExistsInEredivisie: boolean = !!eredivisieTeams[homeTeamId];
    if (teamExistsInEredivisie) {
        return EREDIVISIE_CODE;
    }
    const teamExistsInPremierLeague: boolean = !!premierLeagueTeams[homeTeamId];
    if (teamExistsInPremierLeague) {
        return PREMIER_LEAGUE_CODE;
    }
    const teamExistsInEuro2020: boolean = !! euro2020Teams[homeTeamId];
    if (teamExistsInEuro2020) {
        return EURO2020_CODE;
    } else {
        console.log(`error ${homeTeamId}`);
        throw Error('Invalid team id');
    }
}
