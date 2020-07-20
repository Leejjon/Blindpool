import { Datastore } from "@google-cloud/datastore";
import { Match } from "../objects/Match";
import { Request, Response } from "express";
import axios from "axios";
import { API_FOOTBAL_DATA_URL, API_FOOTBAL_DATA_KEY } from "../constants";

export const getScheduledMatches = async (req: Request, res: Response) => {

    const datastore = new Datastore();
    
    const matchKind = "match";
    const matchSource = "match-source";

    try {
        const matchesResponse = await axios.get(
            `${API_FOOTBAL_DATA_URL}/matches/?status=SCHEDULED`,
            { headers: { "X-Auth-Token": API_FOOTBAL_DATA_KEY } }
        );

        matchesResponse.data.matches.map(async (match: any) => {
            // The Cloud Datastore key for the new entity
            const matchKey = datastore.key(matchKind);
            const sourceId = `football-data-${match.id}`;

            await datastore.update(entity);

            const result = {
                date: match.utcDate,
                competitionName: match.competition.name,
                homeTeam: {
                    name: match.homeTeam.name,
                    score: match.score.fullTime.homeTeam
                },
                awayTeam: {
                    name: match.awayTeam.name,
                    score: match.score.fullTime.awayTeam
                }
            } as Match;

            const matchData = {
                key: matchKey,
                data: result,
            }

            await datastore.save(matchData);

        });

        res.contentType('application/json');
        res.status(200);
        res.send({ success: true });

    } catch (error) {
        res.status(500);
        res.send({ success: false, error });
    }
}