import {Request, Response} from "express";
import {Blindpool, Match, ParticipantAndScore} from "../models/Blindpool";
import {BlindpoolStatistics} from "../models/BlindpoolStatistics";
import {Result} from "neverthrow";
import {calculateBlindpoolCount, findBlindpoolByKey, insertNewBlindpool} from "../services/BlindpoolService";
import {assignRandomScores} from "../logic/ScoreGenerator";
import {ErrorScenarios} from "../models/ErrorScenarios";
import {doesThisMatchExists} from "../services/MatchService";
import Hashids from 'hashids';
import {CreateBlindpoolRequestSchemaType} from "blindpool-common/requests/validation/CreateBpRequest";
import {BpRequestValidations} from "blindpool-common/requests/validation/BpRequestValidations";

const hashids = new Hashids();

export const postCreateBlindpool = async (req: Request, res: Response) => {
    try {
        const createBlindpoolRequest = req.body as CreateBlindpoolRequestSchemaType; // We can just cast because validation should have already happened in the validationMiddleware
        const names = createBlindpoolRequest.participants;
        const participantsAndScores = assignRandomScores(names);
        let freeFormatMatch: string | undefined = undefined;

        if (createBlindpoolRequest.selectedMatchID) {
            const result = await doesThisMatchExists(createBlindpoolRequest.selectedMatchID);
            result
                .map((match: Match) => {
                    if (new Date(match.startTimestamp) < new Date()) {
                        mapError(res, ErrorScenarios.MATCH_ALREADY_STARTED);
                    } else {
                        handleInsertNewBlindpool(res, participantsAndScores, match, undefined, match.startTimestamp);
                    }
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
    if (typeof req.params.key !== 'string') {
        mapError(res, ErrorScenarios.INVALID_INPUT);
        return;
    }

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
    res.contentType('application/json').status(200).json(blindpool);
};

const mapError = (res: Response, error: ErrorScenarios) => {
    switch (error) {
        case ErrorScenarios.POOL_NOT_FOUND:
            respond(res, 404, 'We can\'t find this pool, sorry!');
            break;
        case ErrorScenarios.MATCH_NOT_FOUND:
            respond(res, 404, "We can't find the match you've selected, sorry!");
            break;
        case ErrorScenarios.INVALID_INPUT:
            respond(res, 400, 'Invalid input.');
            break;
        case ErrorScenarios.MATCH_ALREADY_STARTED:
            res.status(400).json({
                selectedMatchIdValidation: "MATCH_ALREADY_STARTED"
            } as BpRequestValidations);
            break;
        case ErrorScenarios.INTERNAL_ERROR:
        default:
            respond(res, 500, 'An error occurred on our side, sorry!');
            break;
    }
}

const respond = (res: Response, status: number, message: string) => {
    res.status(status);
    res.send(message);
}
