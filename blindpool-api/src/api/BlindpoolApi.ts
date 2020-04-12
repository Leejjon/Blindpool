/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import * as BlindpoolStorageService from "../services/BlindpoolStorageService";
import { Blindpool } from "../models/Blindpool";

/**
 * Router Definition
 */
export const blindpoolApi = express.Router();

/**
 * Controller Definitions
 */
blindpoolApi.get('/:key', async (req: Request, res: Response) => {
    const key: string = req.params.key;

    try {
        const blindpool: Blindpool = await BlindpoolStorageService.find(key);
        res.contentType('application/json');
        res.status(200).send(JSON.parse(JSON.stringify(blindpool, bigIntReplacer)));
    } catch (e) {
        console.log(e);
        res.status(404).send(e.message);
    }
});

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
