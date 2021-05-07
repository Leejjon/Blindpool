import {ok, err, Result} from "neverthrow";
import axios from "axios";
import {API_FOOTBAL_DATA_URL, EREDIVISIE_CODE, EURO2020_CODE} from "./constants";
import {fetchSecret} from "../SecretService";
import {ErrorScenarios} from "../../model/ErrorScenarios";

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
    let ereDivisieResponse;
    let euro2020Response;
    try {
        const secret = await fetchSecret();
        const eredivisiePromise = axios.get(
            `${API_FOOTBAL_DATA_URL}/competitions/${EREDIVISIE_CODE}/matches/`,
            {headers: {"X-Auth-Token": secret}}
        );
        const euro2020Promise = axios.get(
            `${API_FOOTBAL_DATA_URL}/competitions/${EURO2020_CODE}/matches/`,
            {headers: {"X-Auth-Token": secret}}
        );
        let [ereDivisieResponse, euro2020Response] = await Promise.all([eredivisiePromise, euro2020Promise]);
        if (ereDivisieResponse.status === 200 && euro2020Response.status === 200) {
            let ereDivisieMatches: Array<FootballDataApiMatch> = ereDivisieResponse.data.matches ?? [];
            let euro2020Matches: Array<FootballDataApiMatch> = euro2020Response.data.matches ?? [];
            let allMatches: Array<FootballDataApiMatch> = ereDivisieMatches.concat(euro2020Matches);
            return ok(allMatches);
        } else {
            console.error(`Response object: ${JSON.stringify(ereDivisieResponse.data)}`);
            return err(ErrorScenarios.INTERNAL_ERROR);
        }
    } catch (error) {
        console.error(`Something went wrong with retrieving ${JSON.stringify(ereDivisieResponse)} or ${JSON.stringify(euro2020Response)}`);
        return err(ErrorScenarios.INTERNAL_ERROR);
    }
}
