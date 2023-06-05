import {ok, err, Result} from "neverthrow";
import axios, {AxiosResponse} from "axios";
import {fetchSecret} from "../SecretService";
import {ErrorScenarios} from "../../model/ErrorScenarios";
import {
    API_FOOTBAL_DATA_URL,
} from "./constants/Teams";
import {competitions} from "blindpool-common/constants/Competitions";

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
    extraTime: FootballDataApiScore,
    penalties: FootballDataApiScore
}

export interface FootballDataApiScore {
    homeTeam: number | null,
    awayTeam: number | null
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

export const getMatchesFromFootballDataApi = async (): Promise<Result<Array<MatchWithCompetitionIncluded>, ErrorScenarios>> => {
    let responses;
    try {
        const secret = await fetchSecret();

        let competitionPromises: Array<Promise<AxiosResponse<FootballDataApiMatches>>> = [];

        for (const key in competitions) {
            const competitionPromise = axios.get<FootballDataApiMatches>(
                `${API_FOOTBAL_DATA_URL}/competitions/${key}/matches/`,
                {headers: {"X-Auth-Token": secret}}
            );
            competitionPromises.push(competitionPromise);
        }

        responses = await Promise.all<AxiosResponse<FootballDataApiMatches>>(competitionPromises);
        const matches = responses
            .filter(axiosResponse => {
                if (axiosResponse.status === 200) {
                    return true;
                } else {
                    console.log("Couldn't " + JSON.stringify(axiosResponse.request));
                    return false;
                }
            })
            .map(axiosResponse => {
                const matches: FootballDataApiMatches = axiosResponse.data;
                const competitionId = matches.competition.id;
                return matches.matches.map((matchWithoutCompetition) => {
                    return {...matchWithoutCompetition, competitionId: competitionId} as MatchWithCompetitionIncluded
                });
            });
        // This is an unsafe cast.
        return ok(([] as Array<MatchWithCompetitionIncluded>).concat(...matches));
    } catch (error) {
        console.error(`Something went wrong with retrieving ${responses ? JSON.stringify(responses) : "<promises not initialized>"} or . Error: ${error}`);
        return err(ErrorScenarios.INTERNAL_ERROR);
    }
}
