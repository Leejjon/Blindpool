import { Request, Response } from "express";
import * as BlindpoolStorageService from "../services/BlindpoolStorageService";
import { Blindpool } from "../models/Blindpool";

export const getBlindpoolByKey = async (req: Request, res: Response) => {
    try {
        const key: string = req.params.key;
        const blindpool: Blindpool = await BlindpoolStorageService.find(key);

        res.contentType('application/json');
        res.status(200);
        res.send(blindpool);
    } catch (e) {
        console.log(e);
        res.status(404).send('We can\'t find this pool, sorry!');
    }
};
