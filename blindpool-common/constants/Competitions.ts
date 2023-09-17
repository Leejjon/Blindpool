

export enum CompetitionEnum {
    EREDIVISIE = "Eredivisie",
    PREMIER_LEAGUE = "Premier League",
    LA_LIGA = "La Liga",
    SERIE_A = "Serie A",
    CHAMPIONS_LEAGUE = "Champions League",
    // WORLD_CUP = "World cup"
}

interface Competition {
    competition: CompetitionEnum
    // In the future we maybe get picture information etc here.
    teams: {[key: number]: string}
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
            65: 'Man City',
            108: "Inter Milan"
        }
    },
    // 2002: {name: "Bundesliga"},
    2003: {
        competition: CompetitionEnum.EREDIVISIE,
        teams: {
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
    },
    2014: {
        competition: CompetitionEnum.LA_LIGA,
        teams: {
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
    },
    // 2015: {name: "Ligue 1"},
    2019: {
        competition: CompetitionEnum.SERIE_A,
        teams: {
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
    },
    2021: {
        competition: CompetitionEnum.PREMIER_LEAGUE,
        teams: {
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

