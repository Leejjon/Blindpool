
export interface PageTitleAndDescription {
    title: string;
    description: string;
}

export interface routeToPageAndDescriptionMapping {
    [path: string]: PageTitleAndDescription;
}

export const englishPageTitlesAndDescriptions: routeToPageAndDescriptionMapping = {
    '/': {title: 'Blindpool', description: 'A blind pool is a gambling game where all participants are assigned a random score for a football match. The player with the correct final score wins!'},
    '/about': {title: 'Blindpool - About Blindpool', description: 'My name is Leon Liefting and I\'m a full stack developer (freelance) from the Netherlands that likes to be involved in all phases of software development.'},
    '/create': {title: 'Blindpool - Create a pool', description: 'Watching football with friends? Create a blind pool in 30 seconds. Free and no account needed.'},
    '/howto': {title: 'Blindpool - How does it work?', description: 'Step by step explanation on how to create a blind pool and share it with your friends.'}
};

export const dutchPageTitlesAndDescriptions: routeToPageAndDescriptionMapping = {
    '/': {title: 'Blindepool', description: 'Een blindepool is een gokspel waar elke deelnemer een willekeurige voetbal uitslag krijgt. De deelnemer met de uitslag van de wedstrijd, wint.'},
    '/about': {title: 'Blindepool - Over Blindepool', description: 'Mijn naam is Leon Liefting en ik ben een full stack developer (freelance) en ik ben graag betrokken in alle fases van software ontwikkeling.'},
    '/create': {title: 'Blindepool - Maak een pool', description: 'Voetbal kijken met vrienden? Maak een blindepool in 30 seconden. Gratis en geen account nodig.'},
    '/howto': {title: 'Blindepool - Hoe werkt het?', description: 'Stap voor stap uitgelegd hoe je een blindepool maakt en deelt met je vrienden.'}
};
