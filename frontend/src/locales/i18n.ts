import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them)
export const resources = {
    en: {
        translation: {
            "TITLE": "Blindpool",
            "CREATE_POOL": "Create pool",
            "CREATE_POOL_TITLE": "Create a blind pool",
            "CREATE_POOL_DESCRIPTION": "Watching football with friends? Create a blind pool in 30 seconds. Free and no account needed.",
            "HOW_TO_USE_BLINDPOOL_TITLE": "How does it work?",
            "HOW_TO_USE_BLINDPOOL_DESCRIPTION": "Learn how to make a blind pool.",
            "BLINDPOOL_DEFINITION_TITLE": "What is a blind pool?",
            "BLINDPOOL_DEFINITION_DESCRIPTION": "A blind pool is a gambling game where all participants are assigned a random score for a football match. The player with the correct final score wins!",
            "HOST_NAME": "Enter the name of the organizer",
            "POOL_MADE_BY": "{{organizer}}'s blind pool",
            "NEW_VERSION_AVAILABLE": "New version available",
            "UPDATE_NOW": "Update now",
            "ADD_PLAYER": "Add another player",
            "REMOVE_PLAYER_X": "Remove player {{name}}",
            "ILLEGAL_CHARACTER_MESSAGE": "Please only use letters, numbers and spaces",
            "NAME_COLUMN_HEADER": "Name",
            "NAME_COLUMN_SCORE": "Score",
            "DUPLICATE_MESSAGE": "Choose a unique name",
            "EMPTY_MESSAGE": "Please enter a name or remove this field",
            "HOW_DOES_IT_WORK_TITLE": "How does it work?",
            "HOW_DOES_IT_WORK_DESCRIPTION": "Step by step explanation on how to create a blind pool and share it with your friends.",
            "BACK": "Back",
            "NEXT": "Next",
            "COMIC1": "Invite your friends over to watch a football match.",
            "COMIC2": "Everybody places the exact same bet. For example two euros each.",
            "COMIC3": "Enter all names in the app and create the pool.",
            "COMIC4": "Share the link to the pool with all friends so they can view their randomly assigned score.",
            "COMIC5": "Watch the match and pray that your random assigned score will be the final score of the game...",
            "COMIC6": "The person that has the correct final score wins it all!",
            "THANKS_FOR_EXPLANATION": "Let me create a pool now"
        }
    },
    nl: {
        translation: {
            "TITLE": "Blindepool",
            "CREATE_POOL": "Maak een pool",
            "CREATE_POOL_TITLE": "Maak een blindepool",
            "CREATE_POOL_DESCRIPTION": "Voetbal kijken met vrienden? Maak een blindepool in 30 seconden. Gratis en geen account nodig.",
            "HOW_TO_USE_BLINDPOOL_TITLE": "Hoe werkt het?",
            "HOW_TO_USE_BLINDPOOL_DESCRIPTION": "Leer hoe je een blindepool maakt.",
            "BLINDPOOL_DEFINITION_TITLE": "Wat is een blindepool?",
            "BLINDPOOL_DEFINITION_DESCRIPTION": "Een blindepool is een gokspel waar elke deelnemer een willekeurige voetbal uitslag krijgt. De deelnemer met de uitslag van de wedstrijd, wint.",
            "HOST_NAME": "Vul de naam van de organizator in.",
            "POOL_MADE_BY": "{{organizer}}'s Blindepool",
            "NEW_VERSION_AVAILABLE": "Nieuwe versie beschikbaar",
            "UPDATE_NOW": "Update nu",
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
            "COMIC1": "Nodig je vrienden uit om een voetbal wedstrijd te kijken.",
            "COMIC2": "Iedereen zet het zelfde bedrag in. Bijvoorbeeld twee euro per persoon.",
            "COMIC3": "Voer de namen van je vrienden in de app en maak de pool.",
            "COMIC4": "Deel de link naar de pool met je vrienden zodat zij hun willekeurig gegenereerde scores kunnen bekijken.",
            "COMIC5": "Bekijk de wedstrijd en duim ervoor dat de wedstrijd eindigt in jouw willekeurig aangewezen score...",
            "COMIC6": "De persoon met de correcte uitslag wint alles!",
            "THANKS_FOR_EXPLANATION": "Laat me nu een pool maken"
        }
    }
};

const locale = window.location.hostname.endsWith('blindepool.nl') ? 'nl' : 'en';

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: locale,

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });