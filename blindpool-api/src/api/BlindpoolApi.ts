import {Request, Response} from "express";
import {Blindpool} from "../models/Blindpool";
import {BlindpoolStatistics} from "../models/BlindpoolStatistics";
import {Result} from "neverthrow";
import {find, ErrorScenarios, count} from "../services/BlindpoolStorageService";

// Switch to import to get code completion...
// import Hashids from 'hashids'
const Hashids = require('hashids/cjs');

const hashids = new Hashids();

export const getBlindpoolByKey = async (req: Request, res: Response) => {
    const keyAsNumber = hashids.decode(req.params.key)[0] as number;
    if (keyAsNumber === undefined) {
        respond(res, 400, 'Invalid request!');
        return;
    }

    const blindpoolResult: Result<Blindpool, ErrorScenarios> = await find(keyAsNumber);

    blindpoolResult
        .map((blindpool) => {
            mapSuccess(res, blindpool);
        })
        .mapErr((error) => {
            mapError(res, error);
        });
};

export const getBlindpoolStatistics = async (req: Request, res: Response) => {
    const countResult: Result<Number, ErrorScenarios> = await count();

    countResult
        .map((poolCount) => {
            mapSuccess(res, {count: poolCount} as BlindpoolStatistics);
        })
        .mapErr((errorScenario) => {
            mapError(res, errorScenario);
        });
}

const mapSuccess = (res: Response, blindpool: Blindpool | BlindpoolStatistics) => {
    res.contentType('application/json');
    res.status(200);
    res.send(blindpool);
};

const mapError = (res: Response, error: ErrorScenarios) => {
    switch (error) {
        case ErrorScenarios.NOT_FOUND:
            respond(res, 404, 'We can\'t find this pool, sorry!');
            break;
        case ErrorScenarios.INTERNAL_ERROR:
            respond(res, 500, 'An error occurred on our side, sorry!');
            break;
    }
}

const respond = (res: Response, status: number, message: string) => {
    res.status(status);
    res.send(message);
}
