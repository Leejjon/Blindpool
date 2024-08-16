import {Request, Response} from "express";
import {Blindpool, Match, ParticipantAndScore} from "../models/Blindpool";
import {BlindpoolStatistics} from "../models/BlindpoolStatistics";
import {Result} from "neverthrow";
import {calculateBlindpoolCount, findBlindpoolByKey, insertNewBlindpool} from "../services/BlindpoolService";
import {assignRandomScores} from "../logic/ScoreGenerator";
import {plainToClass} from "class-transformer";
import {ErrorScenarios} from "../models/ErrorScenarios";
import {doesThisMatchExists} from "../services/MatchService";
import {validate} from "class-validator";
import {CreateBlindpoolRequest} from "blindpool-common/requests/CreateBpRequest";
import Hashids from 'hashids';

const hashids = new Hashids();

export const postCreateBlindpool = async (req: Request, res: Response) => {
    try {
        const createBlindpoolRequest: CreateBlindpoolRequest = plainToClass(CreateBlindpoolRequest, req.body as Object);

        const validationErrors = await validate(createBlindpoolRequest);

        if (validationErrors.length > 0) {
            mapError(res, ErrorScenarios.INVALID_INPUT);
            return;
        }

        const names = createBlindpoolRequest.participants;

        if (names.length < 1) {
            mapError(res, ErrorScenarios.INVALID_INPUT);
            return;
        }

        const checkForDuplicates = (nameToCheck: string) => {
            const duplicate = names.filter((name: string) => name === nameToCheck);
            return duplicate.length > 1;
        };

        for (const name of names) {
            const validName = !checkForDuplicates(name);
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
                    handleInsertNewBlindpool(res, participantsAndScores, match, undefined, match.startTimestamp);
                })
                .mapErr((errorScenario) => {
                    mapError(res, errorScenario);
                });
                return;
        } else if (createBlindpoolRequest.freeFormatMatch) {
            freeFormatMatch = createBlindpoolRequest.freeFormatMatch;
        }

        await handleInsertNewBlindpool(res, participantsAndScores, undefined, freeFormatMatch, undefined);

    } catch (error) {
        console.log('Something went wrong with creating a blindpool that wasnt handled by our default validations: ', error);
        mapError(res, ErrorScenarios.INVALID_INPUT);
    }
};

const handleInsertNewBlindpool = async (res: Response, participantsAndScores: Array<ParticipantAndScore>, selectedMatch?: Match, freeFormatMatch?: string, startTimestamp?: Date | undefined) => {
    const result = await insertNewBlindpool(participantsAndScores, selectedMatch, freeFormatMatch, startTimestamp);
    result
        .map((blindpool: Blindpool) => mapSuccess(res, blindpool))
        .mapErr((errorScenario: ErrorScenarios) => mapError(res, errorScenario));
}

export const getBlindpoolByKey = async (req: Request, res: Response) => {
    const keyAsNumber = hashids.decode(req.params.key)[0] as number;
    if (keyAsNumber === undefined) {
        mapError(res, ErrorScenarios.POOL_NOT_FOUND);
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
