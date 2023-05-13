
export const API_FOOTBAL_DATA_URL = "http://api.football-data.org/v2";
export const EREDIVISIE_CODE = "2003";
export const EREDIVISIE_NAME = "Eredivisie";
export const WORLDCUP2022_CODE = "2000";
export const WORLDCUP2022_NAME = "World Cup 2022"
export const PREMIER_LEAGUE_CODE = "2021";
export const PREMIER_LEAGUE_NAME = "Premier League";
export const LA_LIGA_CODE = "2014";
export const LA_LIGA_NAME = "La Liga";

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

const worldCup2022Teams: {[key: number]: string} = {
    758: 'Uruguay',
    759: 'Germany',
    760: 'Spain',
    762: 'Argentina',
    763: 'Ghana',
    764: 'Brazil',
    765: 'Portugal',
    766: 'Japan',
    769: 'Mexico',
    770: 'Engeland',
    771: 'Verenigde Staten',
    772: 'Zuid Korea',
    773: 'France',
    779: 'Australia',
    780: 'Serbia',
    781: 'Cameroon',
    782: 'Denmark',
    784: 'Italy',
    788: 'Switzerland',
    791: 'Ecuador',
    793: 'Costa Rica',
    794: 'Poland',
    799: 'Croatia',
    801: 'Saudi Arabia',
    802: 'Tunisia',
    804: 'Senegal',
    805: 'Belgium',
    815: 'Morocco',
    828: 'Canada',
    833: 'Wales',
    840: 'Iran',
    8030: 'Qatar',
    8601: 'Netherlands',
};

const premierLeagueTeams : {[key: number]: string} = {
    57: 'Arsenal',
    58: 'Aston Villa',
    61: 'Chelsea',
    62: 'Everton',
    63: 'Fulham',
    64: 'Liverpool',
    65: 'Man City',
    66: 'Man United',
    67: 'Newcastle',
    68: 'Norwhich City',
    73: 'Tottenham',
    76: 'Wolverhampton',
    328: 'Burnley',
    338: 'Leicester City',
    340: 'Southhampton',
    341: 'Leeds United',
    346: 'Watford',
    351: 'Nottingham',
    354: 'Crystal Palace',
    397: 'Brighton Hove',
    402: 'Bretford',
    563: 'West Ham',
    1044: 'Bournemouth'
}

const laLigaTeams : {[key: number]: string} = {
    77: "Atletic Club",
    78: "Atlético",
    79: "CA Osasuna",
    80: "Espanyol",
    81: "FC Barcalona",
    82: "Getafe CF",
    86: "Real Madrid",
    87: "Rayo Vallecano",
    89: "RCD Mallorca",
    90: "Real Betis",
    92: "Real Sociedad",
    94: "Villareal CF",
    95: "Valencia CF",
    250: "Valladolid",
    264: "Cádiz CF",
    267: "UD Almería",
    285: "Elche CF",
    298: "Girona FC",
    558: "RC Celta de Vigo",
    559: "Sevilla FC"
}

export const getTeamName = (teamId: number, competitionId: string): string => {
    let teamName;

    if (competitionId === EREDIVISIE_CODE) {
       teamName = eredivisieTeams[teamId];
    }

    if (competitionId === WORLDCUP2022_CODE) {
        teamName = worldCup2022Teams[teamId];
    }

    if (competitionId === PREMIER_LEAGUE_CODE) {
        teamName = premierLeagueTeams[teamId];
    }

    if (competitionId === LA_LIGA_CODE) {
        teamName = laLigaTeams[teamId];
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
    const teamExistsInLaLiga: boolean = !!laLigaTeams[homeTeamId];
    if (teamExistsInLaLiga) {
        return LA_LIGA_CODE;
    }
    const teamExistsInWorldCup2022: boolean = !! worldCup2022Teams[homeTeamId];
    if (teamExistsInWorldCup2022) {
        return WORLDCUP2022_CODE;
    } else {
        console.log(`error ${homeTeamId}`);
        throw Error('Invalid team id');
    }
}
