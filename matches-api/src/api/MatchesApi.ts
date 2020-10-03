import {Datastore} from "@google-cloud/datastore";
import {Match, Score} from "../model/Match";
import {Request, Response} from "express";
import {
    ErrorScenarios,
    FootballDataApiMatch,
    getMatchesFromFootballDataApi
} from "../services/footballdata-api/FootballDataApi";
import {insertOrUpdateMatch, selectTenUpcomingMatches} from "../services/DatastoreService";

export const getTenScheduledMatches = async (req: Request, res: Response) => {
    let tenUpcomingMatchesResult = await selectTenUpcomingMatches();

    res.contentType('application/json');

    tenUpcomingMatchesResult.map((matches: Array<Match>) => {
        res.status(200);
        res.send(matches);
    }).mapErr((errorScenario: ErrorScenarios) => {
        res.status(500);
        res.send({success: false});
    });
}


export const fetchAndSaveScheduledMatches = async (req: Request, res: Response) => {
    let matches = await getMatchesFromFootballDataApi();
    matches.map((matches: Array<FootballDataApiMatch>) => {
        matches.forEach((match) => {
            insertOrUpdateMatch(match);
        });
    }); // No need to do anything with errors because we're not waiting with responding.

    res.contentType('application/json');
    res.status(200);
    res.send({success: true});
}