import { Datastore } from "@google-cloud/datastore";
import { Match } from "../model/Match";
import { Request, Response } from "express";
import { API_FOOTBAL_DATA_URL, EREDIVISIE_NAME, EREDIVISIE_CODE } from "../constants";
import axios from "axios";
import {fetchSecret} from "../services/SecretService";

export const getScheduledMatches = async (req: Request, res: Response) => {
    const datastore = new Datastore();

    const matchKind = "match";
    const matchSource = "match-source";

    try {
        const matchesResponse = await axios.get(
            `${API_FOOTBAL_DATA_URL}/competitions/${EREDIVISIE_CODE}/matches/`,
            { headers: { "X-Auth-Token": await fetchSecret()} }
        );
        
        // console.log(`${JSON.stringify(matchesResponse.data)}`);

        matchesResponse?.data?.matches.map(async (match: any) => {

            try {
                const result = {
                    date: match.utcDate,
                    competitionName: match.competitionName,
                    homeTeam: {
                        name: match.homeTeam.name,
                        score: match.score.fullTime.homeTeam
                    },
                    awayTeam: {
                        name: match.awayTeam.name,
                        score: match.score.fullTime.awayTeam
                    }
                } as Match;
                const sourceId = datastore.key([matchSource, `football-data-${match.id}`]);
                const resultKey = await datastore.get(sourceId);

                if (resultKey?.length > 0 && resultKey[0]) {
                    console.log("Found the key", resultKey)
                    // const matchData = {
                    //     key: storedResult.key,
                    //     data: storedResult.data,
                    // }
                    // await datastore.update(matchData);
                } else {
                    console.log("Not found");
                    // The Cloud Datastore key for the new entity
                    const matchKey = datastore.key(matchKind);
                    const matchData = {
                        key: matchKey,
                        data: result,
                    };
                    await datastore.save(matchData);
                    console.log("saved match", matchData);
                    const sourceIdData = {
                        key: sourceId,
                        data: { id: matchKey.id },
                    }
                    console.log("sourceIdData", sourceIdData);

                    await datastore.save(sourceIdData);
                }
            } catch (error) { // Not catching it will result in unresolved errors
                console.log(error);
            }
        });

        res.contentType('application/json');
        res.status(200);
        res.send({ success: true });

    } catch (error) {
        console.log("error", error);
        res.status(500);
        res.send({ success: false, error });
    }
}