import {Match} from "../model/Match";
import {Request, Response} from "express";
import {getCompetitionsThatNeedUpdate, selectMatchByKey, selectTenUpcomingMatches, upsertMatches} from "../services/MatchService";
import {ErrorScenarios} from "../model/ErrorScenarios";
import {
    getMatchesFromFootballDataApi,
    MatchWithCompetitionIncluded
} from "../services/footballdata-api/FootballDataApiService";
import {err, ok, Result} from "neverthrow";
import {CompetitionEnum} from "blindpool-common/constants/Competitions";

const environment = process.env.NODE_ENV || 'development';

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

export function getCompetitionsFromQueryString(url: string): Result<Array<number>, ErrorScenarios> {
    try {
        const querystrings = url.split('?')[1].split('&');
        return ok(querystrings.map((queryString: string) => Number(queryString.split('=')[1])))
    } catch (e) {
        console.error(`Could not load 10 matches: ${e}`);
        return err(ErrorScenarios.INVALID_INPUT)
    }
}

export const getTenScheduledMatches = async (req: Request, res: Response) => {
    let result = getCompetitionsFromQueryString(req.url);
    if (result.isOk()) {
        await getTenScheduledMatchesForTheseCompetitions(req, res, result._unsafeUnwrap());
    } else {
        await getTenScheduledMatchesForTheseCompetitions(req, res, [2000, 2003, 2021]);
    }
};

const getTenScheduledMatchesForTheseCompetitions = async (req: Request, res: Response, competitions: Array<number>) => {
    let competitionsToUse: Array<number>;
    if (environment === 'development') {
        competitionsToUse = [competitions[0]];
    } else {
        competitionsToUse = competitions;
    }
    let tenUpcomingMatchesResult = await selectTenUpcomingMatches(competitionsToUse);

    tenUpcomingMatchesResult
        .map((matches: Array<Match>) => mapSuccess(res, matches))
        .mapErr((errorScenario: ErrorScenarios) => mapError(res, errorScenario));
}

export const fetchAndUpdateMatchesThatAreCurrentlyPlaying = async (req: Request, res: Response) => {
    const competitionsKeysToUpdate = await getCompetitionsThatNeedUpdate();

    competitionsKeysToUpdate
        .map((competitionKeysToUpdate) => {
            const competitionKeysAsStrings = competitionKeysToUpdate.map(competition => {
                return competition.toString();
            });
            if (competitionKeysToUpdate.length === 0) {
                res.status(200);
                res.send();
            } else {
                upsertMatchesForCompetitions(res, competitionKeysToUpdate);
            }
        })
        .mapErr((errorScenario: ErrorScenarios) => mapError(res, errorScenario))
}

export const fetchAndSaveScheduledMatches = async (req: Request, res: Response) => {
    try {
        res.contentType('application/json');

        await upsertMatchesForCompetitions(res, Object.values(CompetitionEnum));
    } catch (error) {
        mapError(res, ErrorScenarios.INTERNAL_ERROR);
    }
};

async function upsertMatchesForCompetitions(res: Response, competitionsArray: Array<CompetitionEnum>) {
    let matches = await getMatchesFromFootballDataApi(competitionsArray);
    matches
        .map((matches: Array<MatchWithCompetitionIncluded>) => {
            while (matches.length) {
                upsertMatches(matches.splice(0, 500));
            }
            res.status(200);
            res.send();
        })
        .mapErr((errorScenario) => mapError(res, errorScenario));
}

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
