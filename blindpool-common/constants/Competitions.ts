

export enum CompetitionEnum {
    BUNDESLIGA = "Bundesliga",
    EREDIVISIE = "Eredivisie",
    PREMIER_LEAGUE = "Premier League",
    PREMEIRA_LIGA = "Primeira Liga",
    LA_LIGA = "La Liga",
    LIGUE_1 = "Ligue 1",
    SERIE_A = "Serie A",
    CHAMPIONS_LEAGUE = "Champions League",
    // WORLD_CUP = "World cup"
    // EUROPEAN_CUP = "European Cup"
}

interface Competition {
    competition: CompetitionEnum
    // In the future we maybe get picture information etc here.
    teams: {[key: number]: string}
}

const bundesLigaTeams: {[key: number]: string} = {
    1: 'FC Köln',
    2: 'Hoffenheim',
    3: 'Leverkusen',
    4: 'Dortmund',
    5: 'Bayern',
    10: 'VfL Stuttgart',
    11: 'VfL Wolfsburg',
    12: 'Werder Bremen',
    15: 'FSV Mainz',
    16: 'FC Augsburg',
    17: 'SC Freiburg',
    18: "M'gladbach",
    19: "Frankfurt",
    28: "Union Berlin",
    36: 'VfL Bochum',
    44: 'Heidenheim',
    55: 'SV Darmstadt',
    721: 'RB Leipzig'
}

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
    1911: 'Almere City',
    1914: 'FC Emmen',
    1915: 'NEC Nijmegen',
    1919: 'FC Volendam',
    1920: 'Fortuna Sittard',
    6806: 'Sparta'
}

const laLigaTeams: {[key: number]: string} = {
    77: "Atletic Club",
    78: "Atlético",
    79: "CA Osasuna",
    80: "Espanyol",
    81: "FC Barcalona",
    82: "Getafe CF",
    83: "Granada",
    86: "Real Madrid",
    87: "Rayo Vallecano",
    89: "RCD Mallorca",
    90: "Real Betis",
    92: "Real Sociedad",
    94: "Villareal CF",
    95: "Valencia CF",
    250: "Valladolid",
    263: "Alavés",
    264: "Cádiz CF",
    267: "UD Almería",
    275: "Las Palmas",
    285: "Elche CF",
    298: "Girona FC",
    558: "RC Celta de Vigo",
    559: "Sevilla FC"
}

const ligue1Teams: {[key: number]: string} = {
    511: "Toulouse FC",
    512: "Stade Brestois",
    516: "Marseille",
    518: "Montpellier",
    521: 'Lille OSC',
    522: 'OGC Nice',
    523: 'Olympique Lyon',
    524: 'PSG',
    525: 'FC Lorient',
    529: 'Stade Rennais',
    533: 'Le Havre AC',
    541: 'Clermont Foot',
    543: 'FC Nantes',
    545: 'FC Metz',
    546: 'RC Lens',
    547: 'Stade de Reims',
    548: 'AS Monaco FC',
    576: 'Strasbourg'
}

const premeiraLigaTeams: {[key: number]: string} = {
    496: 'Rio Ave FC',
    498: 'Sporting CP',
    503: 'FC Porto',
    582: 'Estoril Praia',
    583: 'Moreirense FC',
    712: 'FC Arouca',
    810: 'Boavista FC',
    1103: 'GD Chaves',
    1903: 'SL Benfica',
    5531: 'FC Famalicão',
    5533: 'Gil Vicente',
    5543: 'Vitória SC',
    5589: 'FC Vizela',
    5601: 'Portimonese',
    5602: 'SC Farense',
    5613: 'Braga',
    6618: 'Casa Pia AC',
    9136: 'Amadora'
}

const serieATeams: {[key: number]: string} = {
    98: "AC Milan",
    99: "Fiorentina",
    100: "AS Roma",
    102: "Atalanta",
    103: "Bologna",
    104: "Cagliari",
    107: "Genoa",
    108: "Inter Milan",
    109: "Juventus",
    110: "Lazio",
    113: "Napoli",
    115: "Udinese",
    445: "Empoli",
    450: "Verona",
    455: "Salernitana",
    470: "Frosinone",
    471: "Sassuolo",
    586: "Torino",
    5890: "US Lecce",
    5911: "AC Monza"
}

const premierLeagueTeams: {[key: number]: string} = {
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
    356: 'Sheffield',
    389: 'Luton Town',
    397: 'Brighton Hove',
    402: 'Brentford',
    563: 'West Ham',
    1044: 'Bournemouth'
}

export const competitions: {[key: number]: Competition} = {
    // 2000: {
    //     competition: CompetitionEnum.WORLD_CUP,
    //     teams: {
    //         758: 'Uruguay',
    //         759: 'Germany',
    //         760: 'Spain',
    //         762: 'Argentina',
    //         763: 'Ghana',
    //         764: 'Brazil',
    //         765: 'Portugal',
    //         766: 'Japan',
    //         769: 'Mexico',
    //         770: 'Engeland',
    //         771: 'Verenigde Staten',
    //         772: 'Zuid Korea',
    //         773: 'France',
    //         779: 'Australia',
    //         780: 'Serbia',
    //         781: 'Cameroon',
    //         782: 'Denmark',
    //         784: 'Italy',
    //         788: 'Switzerland',
    //         791: 'Ecuador',
    //         793: 'Costa Rica',
    //         794: 'Poland',
    //         799: 'Croatia',
    //         801: 'Saudi Arabia',
    //         802: 'Tunisia',
    //         804: 'Senegal',
    //         805: 'Belgium',
    //         815: 'Morocco',
    //         828: 'Canada',
    //         833: 'Wales',
    //         840: 'Iran',
    //         8030: 'Qatar',
    //         8601: 'Netherlands',
    //     }
    // },
    2001: {
        competition: CompetitionEnum.CHAMPIONS_LEAGUE,
        teams: {
            ...bundesLigaTeams,
            ...eredivisieTeams,
            ...serieATeams,
            ...laLigaTeams,
            ...ligue1Teams,
            ...premierLeagueTeams,
            ...premeiraLigaTeams,
            610: "Galatasaray",
            732: "Celtic",
            1864: "Antwerp FC",
            1876: "FC København",
            1877: "RB Salzburg",
            1887: "Shaktar",
            1871: "Young Boys",
            7283: "Crvena Zvedza"
        }
    },
    2002: {
        competition: CompetitionEnum.BUNDESLIGA,
        teams: bundesLigaTeams
    },
    2003: {
        competition: CompetitionEnum.EREDIVISIE,
        teams: eredivisieTeams
    },
    2014: {
        competition: CompetitionEnum.LA_LIGA,
        teams: laLigaTeams
    },
    2015: {
        competition: CompetitionEnum.LIGUE_1,
        teams: ligue1Teams
    },
    2017: {
        competition: CompetitionEnum.PREMEIRA_LIGA,
        teams: premeiraLigaTeams
    },
    // 2018: {
    //     competition: CompetitionEnum.EUROPEAN_CUP,
    //     teams: {
    //         759: 'Germany',
    //         760: 'Spain',
    //         765: 'Portugal',
    //         768: 'Slovakia',
    //         770: 'England',
    //         773: 'France',
    //         777: 'Slovenia',
    //         780: 'Serbia',
    //         782: 'Denmark',
    //         784: 'Italy',
    //         788: 'Switzerland',
    //         790: 'Ukraine',
    //         794: 'Poland',
    //         798: 'Czech Republic',
    //         799: 'Croatia',
    //         803: 'Turkey',
    //         805: 'Belgium',
    //         811: 'Romania',
    //         816: 'Austria',
    //         827: 'Hungary',
    //         1065: 'Albania',
    //         1978: 'Georgia',
    //         8601: 'Netherlands',
    //         8873: 'Scotland'
    //     }
    // },
    2021: {
        competition: CompetitionEnum.PREMIER_LEAGUE,
        teams: premierLeagueTeams
    },
    2019: {
        competition: CompetitionEnum.SERIE_A,
        teams: serieATeams
    }
}

export function getCompetitionsList(): Array<number> {
    let competitionKeys: number[] = [];
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

export function getCompetitionByStringName(competitionString: String): CompetitionEnum {
    for(const existingCompetition of Object.values(CompetitionEnum)) {
        if (existingCompetition == competitionString) {
            return existingCompetition;
        }
    }
    throw Error("Competition does not exist.");
}

