export declare enum CompetitionEnum {
    EREDIVISIE = "Eredivisie",
    PREMIER_LEAGUE = "Premier League",
    LA_LIGA = "La Liga"
}
interface Competition {
    competition: CompetitionEnum;
}
export declare const competitions: {
    [key: number]: Competition;
};
export declare function getCompetitionsList(): any[];
export declare function getCompetitionKey(competition: CompetitionEnum): number;
export {};
