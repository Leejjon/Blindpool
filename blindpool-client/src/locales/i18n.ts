import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import {Match} from "../model/Match";
import {CompetitionEnum, getCompetitionKey} from "blindpool-common/constants/Competitions";

// the translations
// (tip move them in a JSON file and import them)
export const resources = {
    en: {
        translation: {
            "ABOUT_BLINDPOOL_TITLE": "About Blindpool",
            "ABOUT_BLINDPOOL_DESCRIPTION": "My name is Leon Liefting and I'm a full stack developer (freelance) from the Netherlands that likes to be involved in all phases of software development.",
            "TITLE": "Blindpool",
            "CREATE_POOL": "Create pool",
            "CREATE_POOL_TITLE": "Create a blind pool",
            "CREATE_POOL_DESCRIPTION": "Watching football with friends? Create a blind pool in 30 seconds. Free and no account needed.",
            "BLINDPOOL_DEFINITION_TITLE": "What is a blind pool?",
            "BLINDPOOL_DEFINITION_DESCRIPTION": "A blind pool is a gambling game where all participants are assigned a random score for a football match. The player with the correct final score wins!",
            "BLINDPOOL_VIEW_TITLE": "{{organizer}}'s blindpool",
            "BLINDPOOL_VIEW_DESCRIPTION": "This blindpool is created by {{organizer}} for free.",
            "HOST_NAME": "Enter the name of the organizer",
            "POOL_MADE_BY": "{{organizer}}'s blind pool",
            "ADD_PLAYER": "Add another player",
            "REMOVE_PLAYER_X": "Remove player {{index}}",
            "ILLEGAL_CHARACTER_MESSAGE": "Please only use letters, numbers and spaces",
            "NAME_COLUMN_HEADER": "Name",
            "NAME_COLUMN_SCORE": "Score",
            "DUPLICATE_MESSAGE": "Choose a unique name",
            "EMPTY_MESSAGE": "Please enter a name or remove this field",
            "HOW_DOES_IT_WORK_TITLE": "How does it work?",
            "HOW_DOES_IT_WORK_DESCRIPTION": "Step by step explanation on how to create a blind pool and share it with your friends.",
            "BACK": "Back",
            "NEXT": "Next",
            "NO_MATCHES": "Could not find any upcoming matches.",
            "COMIC1": "Invite your friends over to watch a football match.",
            "COMIC2": "Everybody places the exact same bet. For example two euros each.",
            "COMIC3": "Enter all names in the app and create the pool.",
            "COMIC4": "Share the link to the pool with all friends so they can view their randomly assigned score.",
            "COMIC5": "Watch the match and pray that your random assigned score will be the final score of the game...",
            "COMIC6": "The person that has the correct final score wins it all!",
            "THANKS_FOR_EXPLANATION": "Let me create a pool now",
            "BACKEND_UNREACHABLE": "Could not reach the server. Check your internet connection.",
            "BACKEND_OFFLINE": "Our server is not responding as it should. Sorry for the inconvenience.",
            "BEHIND_BLINDPOOL": "Behind Blindpool",
            "REACH_OUT": "If you like how Blindpool works and need a freelance developer to help build your next cool app or website, reach out via one of the platforms below.",
            "OTHER_APPS": "Other Apps",
            "UPCOMING_MATCHES": "Upcoming matches",
            "UPCOMING_MATCHES_FAILURE": "No matches found. Did you select a league?",
            "CLICK_ON_MATCH": "Click on a match below to start a pool",
            "SELECT_MATCH": "Select match (optional)",
            "MATCH_ALREADY_STARTED": "Warning: This match has already started.",
            "FREE_FORMAT_MATCH_PREFIX": "Match: ",
            "SHARE_THIS_POOL": "Share this pool ",
            "WILDCARD_EXPLANATION": "The X - X (wildcard) score wins if none of the scores assigned to the other participants are correct at the end of the match.",
            "COPY": "Copy",
            "COMPETITIONS_TITLE": "What do you watch?",
            "FOLLOW_US": "Follow blindpool on:",
            "BLINDPOOL_ON_FB": "Blindpool on Facebook",
            "BLINDPOOL_ON_IG": "Blindpool on Instagram"
        }
    },
    nl: {
        translation: {
            "ABOUT_BLINDPOOL_TITLE": "Over Blindpool",
            "ABOUT_BLINDPOOL_DESCRIPTION": "Mijn naam is Leon Liefting en ik ben een full stack developer (freelance). Ik ben graag betrokken in alle fases van software ontwikkeling.",
            "TITLE": "Blindepool",
            "CREATE_POOL": "Maak een pool",
            "CREATE_POOL_TITLE": "Maak een blindepool",
            "CREATE_POOL_DESCRIPTION": "Voetbal kijken met vrienden? Maak een blindepool in 30 seconden. Gratis en geen account nodig.",
            "BLINDPOOL_DEFINITION_TITLE": "Wat is een blindepool?",
            "BLINDPOOL_DEFINITION_DESCRIPTION": "Een blindepool is een gokspel waar elke deelnemer een willekeurige voetbal uitslag krijgt. De deelnemer met de uitslag van de wedstrijd, wint.",
            "BLINDPOOL_VIEW_TITLE": "Blindepool van {{organizer}}",
            "BLINDPOOL_VIEW_DESCRIPTION": "Deze blindepool is gratis gemaakt door {{organizer}}",
            "HOST_NAME": "Vul de naam van de organizator in.",
            "POOL_MADE_BY": "{{organizer}}'s Blindepool",
            "ADD_PLAYER": "Nog een speler toevoegen",
            "REMOVE_PLAYER_X": "Verwijder speler {{name}}",
            "ILLEGAL_CHARACTER_MESSAGE": "Gebruik alleen letters, nummers en spaties",
            "NAME_COLUMN_HEADER": "Naam",
            "NAME_COLUMN_SCORE": "Score",
            "DUPLICATE_MESSAGE": "Kies een unieke naam",
            "EMPTY_MESSAGE": "Vul een geldige naam in of verwijder dit veld",
            "HOW_DOES_IT_WORK_TITLE": "Hoe werkt het?",
            "HOW_DOES_IT_WORK_DESCRIPTION": "Stap voor stap uitgelegd hoe je een blindepool maakt en deelt met je vrienden.",
            "BACK": "Terug",
            "NEXT": "Volgende",
            "NO_MATCHES": "Geen wedstrijden gevonden.",
            "COMIC1": "Nodig je vrienden uit om een voetbal wedstrijd te kijken.",
            "COMIC2": "Iedereen zet het zelfde bedrag in. Bijvoorbeeld twee euro per persoon.",
            "COMIC3": "Voer de namen van je vrienden in de app en maak de pool.",
            "COMIC4": "Deel de link naar de pool met je vrienden zodat zij hun willekeurig gegenereerde scores kunnen bekijken.",
            "COMIC5": "Bekijk de wedstrijd en duim ervoor dat de wedstrijd eindigt in jouw willekeurig aangewezen score...",
            "COMIC6": "De persoon met de correcte uitslag wint alles!",
            "THANKS_FOR_EXPLANATION": "Laat me nu een pool maken",
            "BACKEND_UNREACHABLE": "Kon de server niet bereiken. Controleer je internet verbinding.",
            "BACKEND_OFFLINE": "Onze server reageert niet zoals het hoort, excuses voor het ongemak.",
            "BEHIND_BLINDPOOL": "Achter Blindpool",
            "REACH_OUT": "Als je Blindpool een toffe app vindt en een freelance developer nodig hebt om jouw volgende app of website te bouwen, neem dan contact met me op.",
            "OTHER_APPS": "Andere Apps",
            "UPCOMING_MATCHES": "Aankomende wedstrijden",
            "UPCOMING_MATCHES_FAILURE": "Geen wedstrijden gevonden. Heb jij een competitie geselecteerd?",
            "CLICK_ON_MATCH": "Klik op een wedstrijd om er een blindepool voor te maken",
            "SELECT_MATCH": "Selecteer wedstrijd (optioneel)",
            "MATCH_ALREADY_STARTED": "Waarschuwing: Deze wedstrijd is al begonnen.",
            "FREE_FORMAT_MATCH_PREFIX": "Wedstrijd: ",
            "SHARE_THIS_POOL": "Deel deze pool ",
            "WILDCARD_EXPLANATION": "De X - X (wildcard) score wint als geen van de uitslagen van de andere deelnemers overeenkomt met de einduitslag van de wedstrijd.",
            "COPY": "Kopieer",
            "COMPETITIONS_TITLE": "Wat kijk jij?",
            "FOLLOW_US": "Volg Blindepool op:",
            "BLINDPOOL_ON_FB": "Blindepool op Facebook",
            "BLINDPOOL_ON_IG": "Blindepool op Instagram"
        }
    }
};

const locale = window.location.hostname.endsWith('blindepool.nl') ? 'nl' : 'en';

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: locale,
        returnNull: false,
        keySeparator: false, // we do not use keys in form messages.welcome
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export const defaultCompetitions: Array<number> = window.location.hostname.endsWith('blindepool.nl') ? [
    getCompetitionKey(CompetitionEnum.EREDIVISIE), getCompetitionKey(CompetitionEnum.CHAMPIONS_LEAGUE)
] : [getCompetitionKey(CompetitionEnum.PREMIER_LEAGUE), getCompetitionKey(CompetitionEnum.CHAMPIONS_LEAGUE)];

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
