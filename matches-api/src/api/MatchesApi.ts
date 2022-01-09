import {Match} from "../model/Match";
import {Request, Response} from "express";
import {selectMatchByKey, selectTenUpcomingMatches, upsertMatches} from "../services/MatchService";
import {ErrorScenarios} from "../model/ErrorScenarios";
import {FootballDataApiMatch, getMatchesFromFootballDataApi} from "../services/footballdata-api/FootballDataApiService";

export const getMatchByKey = async (req: Request, res: Response) => {
    const key = req.params.key;
    const matchNumber = parseInt(key.substr(14));
    const isKeyParamValid = key && key.startsWith('football-data-') && key.length <= 30 && matchNumber;
    if (isKeyParamValid) {
        const matchResult = await selectMatchByKey(key);
        matchResult
            .map((match: Match) => mapSuccess(res, match))
            .mapErr((errorScenario: ErrorScenarios) => mapError(res, errorScenario));
    } else {
        mapError(res, ErrorScenarios.INVALID_INPUT);
    }
};

export const getTenScheduledMatches = async (req: Request, res: Response) => {
    let tenUpcomingMatchesResult = await selectTenUpcomingMatches();

    tenUpcomingMatchesResult
        .map((matches: Array<Match>) => mapSuccess(res, matches))
        .mapErr((errorScenario: ErrorScenarios) => mapError(res, errorScenario));
};

export const fetchAndSaveScheduledMatches = async (req: Request, res: Response) => {
    try {
        res.contentType('application/json');

        let matches = await getMatchesFromFootballDataApi();
        matches
            .map((matches: Array<FootballDataApiMatch>) => {
                console.log(matches.length);
                while (matches.length) {
                    upsertMatches(matches.splice(0, 500));
                }
                res.status(200);
                res.send();
            })
            .mapErr((errorScenario) => mapError(res, errorScenario));
    } catch (error) {
        mapError(res, ErrorScenarios.INVALID_INPUT);
    }
};

const respond = (res: Response, status: number, message: string) => {
    res.status(status);
    res.send(message);
};

const mapSuccess = (res: Response, responseEntity: any) => {
    res.contentType('application/json');
    res.status(200);
    res.send(responseEntity);
};

const mapError = (res: Response, error: ErrorScenarios) => {
    switch (error) {
        case ErrorScenarios.MATCH_NOT_FOUND:
            respond(res, 404, "We can't find the match you've selected, sorry!");
            break;
        case ErrorScenarios.INTERNAL_ERROR:
            respond(res, 500, 'An error occurred on our side, sorry!');
            break;
        case ErrorScenarios.INVALID_INPUT:
            respond(res, 400, 'Invalid input.');
            break;
    }
};
