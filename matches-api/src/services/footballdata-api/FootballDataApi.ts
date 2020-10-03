import {ok, err, Result, Err} from "neverthrow";
import axios from "axios";
import {API_FOOTBAL_DATA_URL, EREDIVISIE_CODE} from "./constants";
import {fetchSecret} from "../SecretService";

export enum ErrorScenarios {
    FOOTBALL_DATA_API_UNREACHABLE,
    FOOTBALL_DATA_PARSING_ERROR,
    DATASTORE_ERROR
}

// Make all fields we don't use optional
export interface FootballDataApiMatch {
    id: number,
    season?: FootballDataApiSeason,
    utcDate: string,
    status: string,
    matchday: number,
    stage: string,
    group: string,
    lastUpdated: string
    score: FootballDataApiScoreInfo,
    homeTeam: FootballDataApiTeam,
    awayTeam: FootballDataApiTeam
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
    id: number,
    name: string
}

export const getMatchesFromFootballDataApi = async (): Promise<Result<Array<FootballDataApiMatch>, ErrorScenarios>> => {
    let response;
    try {
        response = await axios.get(
            `${API_FOOTBAL_DATA_URL}/competitions/${EREDIVISIE_CODE}/matches/`,
            {headers: {"X-Auth-Token": await fetchSecret()}}
        );

        if (response.status === 200) {
            const matches: Array<FootballDataApiMatch> = response.data.matches;
            return ok(matches);
        } else {
            console.error(`Response object: ${JSON.stringify(response.data)}`);
            return err(ErrorScenarios.FOOTBALL_DATA_API_UNREACHABLE);
        }
    } catch (error) {
        console.error(`Something went wrong with retrieving ${JSON.stringify(response)}`);
        return err(ErrorScenarios.FOOTBALL_DATA_PARSING_ERROR);
    }
}