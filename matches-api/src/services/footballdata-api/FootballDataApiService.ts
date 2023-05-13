import {ok, err, Result} from "neverthrow";
import axios, {AxiosResponse} from "axios";
import {fetchSecret} from "../SecretService";
import {ErrorScenarios} from "../../model/ErrorScenarios";
import {
    API_FOOTBAL_DATA_URL,
    EREDIVISIE_CODE,
    LA_LIGA_CODE,
    PREMIER_LEAGUE_CODE,
    WORLDCUP2022_CODE
} from "./constants/Teams";


export interface MatchWithCompetition {
    [competition: number]: FootballDataApiMatch
}

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
}

export const getMatchesFromFootballDataApi = async (): Promise<Result<Array<FootballDataApiMatch>, ErrorScenarios>> => {
    let responses;
    try {
        const secret = await fetchSecret();

        let competitionPromises: Array<Promise<AxiosResponse<FootballDataApiMatches>>> = [];

        const competitions: Array<string> = [WORLDCUP2022_CODE, EREDIVISIE_CODE, PREMIER_LEAGUE_CODE, LA_LIGA_CODE];
        competitions.forEach((competition) => {
            const competitionPromise = axios.get<FootballDataApiMatches>(
                `${API_FOOTBAL_DATA_URL}/competitions/${competition}/matches/`,
                {headers: {"X-Auth-Token": secret}}
            );
            competitionPromises.push(competitionPromise);
        });

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
                return matches.matches;
            });
        // This is an unsafe cast.
        return ok(([] as Array<FootballDataApiMatch>).concat(...matches));
    } catch (error) {
        console.error(`Something went wrong with retrieving ${responses ? JSON.stringify(responses) : "<promises not initialized>"} or . Error: ${error}`);
        return err(ErrorScenarios.INTERNAL_ERROR);
    }
}
