import {Request, Response} from "express";

export const findAndCacheClubIcons = async (req: Request, res: Response) => {
    res.contentType('application/json');
    res.status(200);
    res.send('Hi');
};

const mapError = (res: Response, error: ErrorScenarios) => {
    switch (error) {
    }
};

export enum ErrorScenarios {
    FOOTBALL_API_UNREACHABLE,
    FILE_STORAGE_ERROR
}