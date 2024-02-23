
import { Match } from "../model/Match";
import { CompetitionEnum, getCompetitionKey } from "../shared/Competitions";


export enum TranslationKey {
    ABOUT_BLINDPOOL_TITLE = "ABOUT_BLINDPOOL_TITLE",
    ABOUT_BLINDPOOL_DESCRIPTION = "ABOUT_BLINDPOOL_DESCRIPTION",
    TITLE = "TITLE",
    CREATE_POOL = "CREATE_POOL",
    CREATE_POOL_TITLE = "CREATE_POOL_TITLE",
    CREATE_POOL_DESCRIPTION = "CREATE_POOL_DESCRIPTION",
    BLINDPOOL_DEFINITION_TITLE = "BLINDPOOL_DEFINITION_TITLE",
    BLINDPOOL_DEFINITION_DESCRIPTION = "BLINDPOOL_DEFINITION_DESCRIPTION",
    BLINDPOOL_VIEW_TITLE = "BLINDPOOL_VIEW_TITLE",
    BLINDPOOL_VIEW_DESCRIPTION = "BLINDPOOL_VIEW_DESCRIPTION",
    HOST_NAME = "HOST_NAME",
    POOL_MADE_BY = "POOL_MADE_BY",
    ADD_PLAYER = "ADD_PLAYER",
    REMOVE_PLAYER_X = "REMOVE_PLAYER_X",
    ILLEGAL_CHARACTER_MESSAGE = "ILLEGAL_CHARACTER_MESSAGE",
    NAME_COLUMN_HEADER = "NAME_COLUMN_HEADER",
    NAME_COLUMN_SCORE = "NAME_COLUMN_SCORE",
    DUPLICATE_MESSAGE = "DUPLICATE_MESSAGE",
    EMPTY_MESSAGE = "EMPTY_MESSAGE",
    HOW_DOES_IT_WORK_TITLE = "HOW_DOES_IT_WORK_TITLE",
    HOW_DOES_IT_WORK_DESCRIPTION = "HOW_DOES_IT_WORK_DESCRIPTION",
    BACK = "BACK",
    NEXT = "NEXT",
    NO_MATCHES = "NO_MATCHES",
    COMIC1 = "COMIC1",
    COMIC2 = "COMIC2",
    COMIC3 = "COMIC3",
    COMIC4 = "COMIC4",
    COMIC5 = "COMIC5",
    COMIC6 = "COMIC6",
    THANKS_FOR_EXPLANATION = "THANKS_FOR_EXPLANATION",
    BACKEND_UNREACHABLE = "BACKEND_UNREACHABLE",
    BACKEND_OFFLINE = "BACKEND_OFFLINE",
    BEHIND_BLINDPOOL = "BEHIND_BLINDPOOL",
    REACH_OUT = "REACH_OUT",
    OTHER_APPS = "OTHER_APPS",
    UPCOMING_MATCHES = "UPCOMING_MATCHES",
    UPCOMING_MATCHES_FAILURE = "UPCOMING_MATCHES_FAILURE",
    CLICK_ON_MATCH = "CLICK_ON_MATCH",
    SELECT_MATCH = "SELECT_MATCH",
    MATCH_ALREADY_STARTED = "MATCH_ALREADY_STARTED",
    FREE_FORMAT_MATCH_PREFIX = "FREE_FORMAT_MATCH_PREFIX",
    SHARE_THIS_POOL = "SHARE_THIS_POOL",
    WILDCARD_EXPLANATION = "WILDCARD_EXPLANATION",
    COPY = "COPY",
    COMPETITIONS_TITLE = "COMPETITIONS_TITLE",
    FOLLOW_US = "FOLLOW_US",
    BLINDPOOL_ON_FB = "BLINDPOOL_ON_FB",
    BLINDPOOL_ON_IG = "BLINDPOOL_ON_IG"
}

type TranslationPairs = {[key in TranslationKey]: string};

export const resources: { [language: string]: { translation: TranslationPairs } } = {
    en: {
        translation: {
            [TranslationKey.ABOUT_BLINDPOOL_TITLE]: "About Blindpool",
            [TranslationKey.ABOUT_BLINDPOOL_DESCRIPTION]: "My name is Leon Liefting and I'm a full stack developer (freelance) from the Netherlands that likes to be involved in all phases of software development.",
            [TranslationKey.TITLE]: "Blindpool",
            [TranslationKey.CREATE_POOL]: "Create pool",
            [TranslationKey.CREATE_POOL_TITLE]: "Create a blind pool",
            [TranslationKey.CREATE_POOL_DESCRIPTION]: "Watching football with friends? Create a blind pool in 30 seconds. Free and no account needed.",
            [TranslationKey.BLINDPOOL_DEFINITION_TITLE]: "What is a blind pool?",
            [TranslationKey.BLINDPOOL_DEFINITION_DESCRIPTION]: "A blind pool is a gambling game where all participants are assigned a random score for a football match. The player with the correct final score wins!",
            [TranslationKey.BLINDPOOL_VIEW_TITLE]: "{{organizer}}'s blindpool",
            [TranslationKey.BLINDPOOL_VIEW_DESCRIPTION]: "This blindpool is created by {{organizer}} for free.",
            [TranslationKey.HOST_NAME]: "Enter the name of the organizer",
            [TranslationKey.POOL_MADE_BY]: "{{organizer}}'s blind pool",
            [TranslationKey.ADD_PLAYER]: "Add another player",
            [TranslationKey.REMOVE_PLAYER_X]: "Remove player {{index}}",
            [TranslationKey.ILLEGAL_CHARACTER_MESSAGE]: "Please only use letters, numbers and spaces",
            [TranslationKey.NAME_COLUMN_HEADER]: "Name",
            [TranslationKey.NAME_COLUMN_SCORE]: "Score",
            [TranslationKey.DUPLICATE_MESSAGE]: "Choose a unique name",
            [TranslationKey.EMPTY_MESSAGE]: "Please enter a name or remove this field",
            [TranslationKey.HOW_DOES_IT_WORK_TITLE]: "How does it work?",
            [TranslationKey.HOW_DOES_IT_WORK_DESCRIPTION]: "Step by step explanation on how to create a blind pool and share it with your friends.",
            [TranslationKey.BACK]: "Back",
            [TranslationKey.NEXT]: "Next",
            [TranslationKey.NO_MATCHES]: "Could not find any upcoming matches.",
            [TranslationKey.COMIC1]: "Invite your friends over to watch a football match.",
            [TranslationKey.COMIC2]: "Everybody places the exact same bet. For example two euros each.",
            [TranslationKey.COMIC3]: "Enter all names in the app and create the pool.",
            [TranslationKey.COMIC4]: "Share the link to the pool with all friends so they can view their randomly assigned score.",
            [TranslationKey.COMIC5]: "Watch the match and pray that your random assigned score will be the final score of the game...",
            [TranslationKey.COMIC6]: "The person that has the correct final score wins it all!",
            [TranslationKey.THANKS_FOR_EXPLANATION]: "Let me create a pool now",
            [TranslationKey.BACKEND_UNREACHABLE]: "Could not reach the server. Check your internet connection.",
            [TranslationKey.BACKEND_OFFLINE]: "Our server is not responding as it should. Sorry for the inconvenience.",
            [TranslationKey.BEHIND_BLINDPOOL]: "Behind Blindpool",
            [TranslationKey.REACH_OUT]: "If you like how Blindpool works and need a freelance developer to help build your next cool app or website, reach out via one of the platforms below.",
            [TranslationKey.OTHER_APPS]: "Other Apps",
            [TranslationKey.UPCOMING_MATCHES]: "Upcoming matches",
            [TranslationKey.UPCOMING_MATCHES_FAILURE]: "No matches found. Did you select a league?",
            [TranslationKey.CLICK_ON_MATCH]: "Click on a match below to start a pool",
            [TranslationKey.SELECT_MATCH]: "Select match (optional)",
            [TranslationKey.MATCH_ALREADY_STARTED]: "Warning: This match has already started.",
            [TranslationKey.FREE_FORMAT_MATCH_PREFIX]: "Match: ",
            [TranslationKey.SHARE_THIS_POOL]: "Share this pool ",
            [TranslationKey.WILDCARD_EXPLANATION]: "The X - X (wildcard) score wins if none of the scores assigned to the other participants are correct at the end of the match.",
            [TranslationKey.COPY]: "Copy",
            [TranslationKey.COMPETITIONS_TITLE]: "What do you watch?",
            [TranslationKey.FOLLOW_US]: "Follow blindpool on:",
            [TranslationKey.BLINDPOOL_ON_FB]: "Blindpool on Facebook",
            [TranslationKey.BLINDPOOL_ON_IG]: "Blindpool on Instagram"
        }
    },
    nl: {
        translation: {
            [TranslationKey.ABOUT_BLINDPOOL_TITLE]: "Over Blindpool",
            [TranslationKey.ABOUT_BLINDPOOL_DESCRIPTION]: "Mijn naam is Leon Liefting en ik ben een full stack developer (freelance). Ik ben graag betrokken in alle fases van software ontwikkeling.",
            [TranslationKey.TITLE]: "Blindepool",
            [TranslationKey.CREATE_POOL]: "Maak een pool",
            [TranslationKey.CREATE_POOL_TITLE]: "Maak een blindepool",
            [TranslationKey.CREATE_POOL_DESCRIPTION]: "Voetbal kijken met vrienden? Maak een blindepool in 30 seconden. Gratis en geen account nodig.",
            [TranslationKey.BLINDPOOL_DEFINITION_TITLE]: "Wat is een blindepool?",
            [TranslationKey.BLINDPOOL_DEFINITION_DESCRIPTION]: "Een blindepool is een gokspel waar elke deelnemer een willekeurige voetbal uitslag krijgt. De deelnemer met de uitslag van de wedstrijd, wint.",
            [TranslationKey.BLINDPOOL_VIEW_TITLE]: "Blindepool van {{organizer}}",
            [TranslationKey.BLINDPOOL_VIEW_DESCRIPTION]: "Deze blindepool is gratis gemaakt door {{organizer}}",
            [TranslationKey.HOST_NAME]: "Vul de naam van de organizator in.",
            [TranslationKey.POOL_MADE_BY]: "{{organizer}}'s Blindepool",
            [TranslationKey.ADD_PLAYER]: "Nog een speler toevoegen",
            [TranslationKey.REMOVE_PLAYER_X]: "Verwijder speler {{name}}",
            [TranslationKey.ILLEGAL_CHARACTER_MESSAGE]: "Gebruik alleen letters, nummers en spaties",
            [TranslationKey.NAME_COLUMN_HEADER]: "Naam",
            [TranslationKey.NAME_COLUMN_SCORE]: "Score",
            [TranslationKey.DUPLICATE_MESSAGE]: "Kies een unieke naam",
            [TranslationKey.EMPTY_MESSAGE]: "Vul een geldige naam in of verwijder dit veld",
            [TranslationKey.HOW_DOES_IT_WORK_TITLE]: "Hoe werkt het?",
            [TranslationKey.HOW_DOES_IT_WORK_DESCRIPTION]: "Stap voor stap uitgelegd hoe je een blindepool maakt en deelt met je vrienden.",
            [TranslationKey.BACK]: "Terug",
            [TranslationKey.NEXT]: "Volgende",
            [TranslationKey.NO_MATCHES]: "Geen wedstrijden gevonden.",
            [TranslationKey.COMIC1]: "Nodig je vrienden uit om een voetbal wedstrijd te kijken.",
            [TranslationKey.COMIC2]: "Iedereen zet het zelfde bedrag in. Bijvoorbeeld twee euro per persoon.",
            [TranslationKey.COMIC3]: "Voer de namen van je vrienden in de app en maak de pool.",
            [TranslationKey.COMIC4]: "Deel de link naar de pool met je vrienden zodat zij hun willekeurig gegenereerde scores kunnen bekijken.",
            [TranslationKey.COMIC5]: "Bekijk de wedstrijd en duim ervoor dat de wedstrijd eindigt in jouw willekeurig aangewezen score...",
            [TranslationKey.COMIC6]: "De persoon met de correcte uitslag wint alles!",
            [TranslationKey.THANKS_FOR_EXPLANATION]: "Laat me nu een pool maken",
            [TranslationKey.BACKEND_UNREACHABLE]: "Kon de server niet bereiken. Controleer je internet verbinding.",
            [TranslationKey.BACKEND_OFFLINE]: "Onze server reageert niet zoals het hoort, excuses voor het ongemak.",
            [TranslationKey.BEHIND_BLINDPOOL]: "Achter Blindpool",
            [TranslationKey.REACH_OUT]: "Als je Blindpool een toffe app vindt en een freelance developer nodig hebt om jouw volgende app of website te bouwen, neem dan contact met me op.",
            [TranslationKey.OTHER_APPS]: "Andere Apps",
            [TranslationKey.UPCOMING_MATCHES]: "Aankomende wedstrijden",
            [TranslationKey.UPCOMING_MATCHES_FAILURE]: "Geen wedstrijden gevonden. Heb jij een competitie geselecteerd?",
            [TranslationKey.CLICK_ON_MATCH]: "Klik op een wedstrijd om er een blindepool voor te maken",
            [TranslationKey.SELECT_MATCH]: "Selecteer wedstrijd (optioneel)",
            [TranslationKey.MATCH_ALREADY_STARTED]: "Waarschuwing: Deze wedstrijd is al begonnen.",
            [TranslationKey.FREE_FORMAT_MATCH_PREFIX]: "Wedstrijd: ",
            [TranslationKey.SHARE_THIS_POOL]: "Deel deze pool ",
            [TranslationKey.WILDCARD_EXPLANATION]: "De X - X (wildcard) score wint als geen van de uitslagen van de andere deelnemers overeenkomt met de einduitslag van de wedstrijd.",
            [TranslationKey.COPY]: "Kopieer",
            [TranslationKey.COMPETITIONS_TITLE]: "Wat kijk jij?",
            [TranslationKey.FOLLOW_US]: "Volg Blindepool op:",
            [TranslationKey.BLINDPOOL_ON_FB]: "Blindepool op Facebook",
            [TranslationKey.BLINDPOOL_ON_IG]: "Blindepool op Instagram"
        }
    }
};

export function getCountryCode(request: Request) {
    const host = request.headers.get("Host");
    return host && host.endsWith("mysite.nl") ? "nl" : "en";
}

function translate(countryCode: string, key: TranslationKey) {
    for (const country in resources) {
        if (country === countryCode) {
            const translations = resources[countryCode].translation;
            for (const translationKey in translations) {
                if (translationKey == key.toString()) {
                    return translations[key];
                }
            }
            return `Translation key ${key} is missing.`
        }
    }
    return `${countryCode} is not a supported language.`;
}

export function getTranslator(countryCode: string) {
    return (key: TranslationKey) => translate(countryCode, key);
}

// export function getDefaultCompetitions(hostname: string): Array<number> {
//     return hostname.endsWith('blindepool.nl') ? [
//         getCompetitionKey(CompetitionEnum.EREDIVISIE), getCompetitionKey(CompetitionEnum.CHAMPIONS_LEAGUE)
//     ] : [getCompetitionKey(CompetitionEnum.PREMIER_LEAGUE), getCompetitionKey(CompetitionEnum.CHAMPIONS_LEAGUE)];
// }

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
    769: 'Mexico',
    770: 'Engeland',
    771: 'Verenigde Staten',
    772: 'Zuid Korea',
    773: 'Frankrijk',
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
    815: 'Marokko',
    816: 'Oostenrijk',
    827: 'Hongarije',
    828: 'Canada',
    833: 'Wales',
    840: 'Iran',
    1976: 'Finland',
    1977: 'Noord-Macedonië',
    8030: 'Qatar',
    8601: 'Nederland',
    8873: 'Schotland'
};

const getDutchCountryName = (teamId: number) => {
    return dutchCountryNames[teamId] || 'Unknown country';
}

export const getHomeTeamNameToDisplay = (match: Match) => {
    if (match.competitionName === 'World Cup 2022' && window.location.hostname.endsWith('blindepool.nl')) {
        return getDutchCountryName(parseInt(match.homeTeamID));
    } else {
        return match.homeTeamName;
    }
}

export const getAwayTeamNameToDisplay = (match: Match) => {
    if (match.competitionName === 'World Cup 2022' && window.location.hostname.endsWith('blindepool.nl')) {
        return getDutchCountryName(parseInt(match.awayTeamID));
    } else {
        return match.awayTeamName;
    }
}
