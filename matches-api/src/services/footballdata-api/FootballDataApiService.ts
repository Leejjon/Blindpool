import {ok, err, Result} from "neverthrow";
import {fetchSecret} from "../SecretService";
import {ErrorScenarios} from "../../model/ErrorScenarios";
import {
    API_FOOTBAL_DATA_URL,
} from "./constants/Teams";
import {CompetitionEnum, getCompetitionKey} from "blindpool-common/constants/Competitions";

// Make all fields we don't use optional
export interface FootballDataApiMatch {
    id: number,
    season?: FootballDataApiSeason,
    utcDate: string,
    status: string,
    matchday: number,
    stage: string,
    group: string | null,
    lastUpdated: string
    score: FootballDataApiScoreInfo,
    homeTeam: FootballDataApiTeam,
    awayTeam: FootballDataApiTeam,
    odds: any,
    referees: Array<any>
    // Referees
}

export interface MatchWithCompetitionIncluded extends FootballDataApiMatch {
    competitionId: number;
}

interface FootballDataApiSeason {
    id: number,
    startDate: string,
    endDate: string,
    currentMatchday: number,
}

export interface FootballDataApiScoreInfo {
    winner: null | string,
    duration: string,
    fullTime: FootballDataApiScore,
    halfTime: FootballDataApiScore,
    extraTime?: FootballDataApiScore,
    penalties?: FootballDataApiScore
}

export interface FootballDataApiScore {
    home: number | null,
    away: number | null
}

export interface FootballDataApiTeam {
    id: number | null,
    name: string | null
}

interface FootballDataApiMatches {
    matches: Array<FootballDataApiMatch>
    competition: FootballDataApiCompetition
}

interface FootballDataApiCompetition {
    id: number;
}

export const getMatchesFromFootballDataApi = async (competitions: Array<CompetitionEnum>): Promise<Result<Array<MatchWithCompetitionIncluded>, ErrorScenarios>> => {
    let responses: Response[] = [];
    try {
        const secret = await fetchSecret();

        let competitionPromises: Array<Promise<Response>> = [];

        for (const competition of competitions) {
            console.log("Updating competition: " + competition.toString());
            const key = getCompetitionKey(competition);
            const competitionPromise = fetch(
                `${API_FOOTBAL_DATA_URL}/competitions/${key}/matches/`,
                {headers: {"X-Auth-Token": secret}}
            );
            competitionPromises.push(competitionPromise);
        }

        responses = await Promise.all(competitionPromises);
        const matchesPromises = responses
            .filter(response => {
                if (response.status === 200) {
                    return true;
                } else {
                    console.log(`Couldn't get matches from ${response.url}. Status: ${response.status}`);
                    return false;
                }
            })
            .map(async response => {
                const matches: FootballDataApiMatches = await response.json() as unknown as FootballDataApiMatches;
                const competitionId = matches.competition.id;
                return matches.matches.map((matchWithoutCompetition) => {
                    return {...matchWithoutCompetition, competitionId: competitionId} as MatchWithCompetitionIncluded
                });
            });

        const matches = await Promise.all(matchesPromises);
        // This is an unsafe cast.
        return ok(([] as Array<MatchWithCompetitionIncluded>).concat(...matches));
    } catch (error) {
        console.error(`Something went wrong with retrieving ${responses.length > 0 ? JSON.stringify(responses.map(r => ({url: r.url, status: r.status}))) : "<promises not initialized>"} or . Error: ${error}`);
        return err(ErrorScenarios.INTERNAL_ERROR);
    }
}
