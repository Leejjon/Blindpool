import { Request, Response } from "express";
import * as BlindpoolStorageService from "../services/BlindpoolStorageService";
import { Blindpool } from "../models/Blindpool";

export const getBlindpoolByKey = async (req: Request, res: Response) => {
    const key: string = req.params.key;

    try {
        const blindpool: Blindpool = await BlindpoolStorageService.find(key);
        res.contentType('application/json');
        res.status(200);
        res.send(JSON.parse(JSON.stringify(blindpool, bigIntReplacer)));
    } catch (e) {
        console.log(e);
        res.status(404).send('We can\'t find this pool, sorry!');
    }
};

/**
 * Apparently bigint breaks json serialization
 * Solution: https://github.com/GoogleChromeLabs/jsbi/issues/30
 * @param key
 * @param value
 */
let bigIntReplacer = (key: any, value: any) => {
    return typeof value === 'bigint'
        ? value.toString()
        : value // return everything else unchanged
}
