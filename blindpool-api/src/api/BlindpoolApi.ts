import {Request, Response} from "express";
import {Blindpool, CreateBlindpoolRequest, Match, ParticipantAndScore} from "../models/Blindpool";
import {BlindpoolStatistics} from "../models/BlindpoolStatistics";
import {Result} from "neverthrow";
import {calculateBlindpoolCount, findBlindpoolByKey, insertNewBlindpool} from "../services/BlindpoolService";
import {assignRandomScores} from "../logic/ScoreGenerator";
import {plainToClass} from "class-transformer";
import {ErrorScenarios} from "../models/ErrorScenarios";
import {doesThisMatchExists} from "../services/MatchService";

// Switch to import to get code completion... The import version crashes on runtime though.
// import Hashids from 'hashids'
const Hashids = require('hashids/cjs');

const hashids = new Hashids();

export const postCreateBlindpool = async (req: Request, res: Response) => {
    try {
        const createBlindpoolRequest: CreateBlindpoolRequest = plainToClass(CreateBlindpoolRequest, req.body as Object);
        const names = createBlindpoolRequest.participants;

        if (names.length < 1) {
            mapError(res, ErrorScenarios.INVALID_INPUT);
            return;
        }

        const checkForDuplicates = (nameToCheck: string) => {
            const duplicate = names.filter(name => name === nameToCheck);
            return duplicate.length > 1;
        };

        const regex = /^([a-zA-Z0-9 _]{1,20})$/;
        for (const name of names) {
            const validName = name && regex.test(name) && !checkForDuplicates(name);
            if (!validName) {
                mapError(res, ErrorScenarios.INVALID_INPUT);
                return;
            }
        }

        const participantsAndScores = assignRandomScores(names);
        let freeFormatMatch: string | undefined = undefined;

        if (createBlindpoolRequest.selectedMatchID) {
            const result = await doesThisMatchExists(createBlindpoolRequest.selectedMatchID);
            result
                .map((match: Match) => {
                    handleInsertNewBlindpool(res, participantsAndScores, match, undefined);
                })
                .mapErr((errorScenario) => {
                    mapError(res, errorScenario);
                });
                return;
        } else if (createBlindpoolRequest.freeFormatMatch) {
            freeFormatMatch = createBlindpoolRequest.freeFormatMatch;
        }

        await handleInsertNewBlindpool(res, participantsAndScores, undefined, freeFormatMatch);
    } catch (error) {
        console.log('Something went wrong with creating a blindpool that wasnt handled by our default validations: ', error);
        mapError(res, ErrorScenarios.INVALID_INPUT);
    }
};

const handleInsertNewBlindpool = async (res: Response, participantsAndScores: Array<ParticipantAndScore>, selectedMatch?: Match, freeFormatMatch?: string) => {
    const result = await insertNewBlindpool(participantsAndScores, selectedMatch, freeFormatMatch);
    result
        .map((blindpool: Blindpool) => mapSuccess(res, blindpool))
        .mapErr((errorScenario: ErrorScenarios) => mapError(res, errorScenario));
}

export const getBlindpoolByKey = async (req: Request, res: Response) => {
    const keyAsNumber = hashids.decode(req.params.key)[0] as number;
    if (keyAsNumber === undefined) {
        respond(res, 400, 'Invalid request!');
        return;
    }

    const blindpoolResult: Result<Blindpool, ErrorScenarios> = await findBlindpoolByKey(keyAsNumber);

    blindpoolResult
        .map((blindpool: Blindpool) => mapSuccess(res, blindpool))
        .mapErr((error: ErrorScenarios) => mapError(res, error));
};

export const getBlindpoolStatistics = async (req: Request, res: Response) => {
    const countResult: Result<Number, ErrorScenarios> = await calculateBlindpoolCount();

    countResult
        .map((poolCount: Number) => mapSuccess(res, {count: poolCount} as BlindpoolStatistics))
        .mapErr((errorScenario: ErrorScenarios) => mapError(res, errorScenario));
};

const mapSuccess = (res: Response, blindpool: Blindpool | BlindpoolStatistics) => {
    res.contentType('application/json');
    res.status(200);
    res.send(blindpool);
};

const mapError = (res: Response, error: ErrorScenarios) => {
    switch (error) {
        case ErrorScenarios.POOL_NOT_FOUND:
            respond(res, 404, 'We can\'t find this pool, sorry!');
            break;
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
}

const respond = (res: Response, status: number, message: string) => {
    res.status(status);
    res.send(message);
}
