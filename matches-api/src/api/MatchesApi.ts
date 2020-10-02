import {Datastore} from "@google-cloud/datastore";
import {Match} from "../model/Match";
import {Request, Response} from "express";
import {API_FOOTBAL_DATA_URL, EREDIVISIE_NAME, EREDIVISIE_CODE} from "../constants";
import axios from "axios";
import {fetchSecret} from "../services/SecretService";

const matchKind = "match";

export const getTenScheduledMatches = async (req: Request, res: Response) => {
    const today = new Date();
    console.log(`Current date: ${today.toISOString()}`);
    const datastore = new Datastore();
    const query = datastore.createQuery(matchKind)
        .order('startTimestamp', {descending: false})
        .filter('startTimestamp', '>', today.toJSON())
        .limit(10);

    let [upcomingTenMatches] = await datastore.runQuery(query);
    upcomingTenMatches.forEach(upcomingMatch => {
        try {
            console.log(`Upcoming match: ${JSON.stringify(upcomingMatch)}`);
        } catch (error) {
            console.error(`Could not parse: ${JSON.stringify(upcomingMatch)}`);
        }
    });

    res.contentType('application/json');
    res.status(200);
    res.send({});

}
export const fetchAndSaveScheduledMatches = async (req: Request, res: Response) => {
    const datastore = new Datastore();

    try {
        const matchesResponse = await axios.get(
            `${API_FOOTBAL_DATA_URL}/competitions/${EREDIVISIE_CODE}/matches/`,
            {headers: {"X-Auth-Token": await fetchSecret()}}
        );

        matchesResponse?.data?.matches.map(async (match: any) => {
            try {
                // const matchKey = datastore.key(matchKind);
                // const aDate: Date = new Date(match.utcDate);
                // console.log(`Check deze date ${aDate}`);
                //
                // const entity = {
                //     key: matchKey,
                //     data: [
                //         {
                //             name: 'created',
                //             value: aDate.toJSON()
                //         },
                //         {
                //             name: 'wedstrijd',
                //             value: `${match.homeTeam.name}-${match.awayTeam.name}`
                //         }
                //     ]
                // };
                //
                // await datastore.save(entity);

                const startTimestamp = new Date(match.utcDate);

                const isMatchFinished = function() {
                    return match.score.fullTime.homeTeam != null && match.score.fullTime.awayTeam != null;
                }

                const createScoreObject = function() {
                    if (match.score.fullTime.homeTeam != null && match.score.fullTime.awayTeam != null) {
                        return {
                            homeScore: match.score.fullTime.homeTeam,
                            awayScore: match.score.fullTime.awayTeam,
                        };
                    } else {
                        return {
                            homeScore: 0,
                            awayScore: 0
                        }
                    }
                }

                const existingMatchKey = datastore.key([matchKind, `football-data-${match.id}`]);
                const resultKey = await datastore.get(existingMatchKey);

                if (resultKey?.length > 0 && resultKey[0]) {
                    console.log("Found the key", resultKey);

                    // TODO: Implement update mechanism.
                    // const matchData = {
                    //     key: storedResult.key,
                    //     data: storedResult.data,
                    // }
                    // await datastore.update(matchData);
                } else {
                    console.log("Not found");

                    const result = [
                        {
                            name: 'startTimestamp',
                            value: startTimestamp.toJSON()
                        },
                        {
                            name: 'competitionName',
                            value: EREDIVISIE_NAME
                        },
                        {
                            name: 'homeTeam',
                            value: match.homeTeam.name
                        },
                        {
                            name: 'awayTeam',
                            value: match.awayTeam.name
                        },
                        {
                            name: 'score',
                            value: createScoreObject()
                        },
                        {
                            name: 'finished',
                            value: isMatchFinished()
                        }
                    ];

                    const matchKey = datastore.key(matchKind);
                    const matchData = {
                        key: matchKey,
                        data: result,
                    };
                    await datastore.save(matchData);
                    // console.log("saved match", matchData);
                    // const sourceIdData = {
                    //     key: existingMatchKey,
                    //     data: { id: matchKey.id },
                    // }
                    // console.log("sourceIdData", sourceIdData);
                    //
                    // await datastore.save(sourceIdData);
                }
            } catch (error) { // Not catching it will result in unresolved errors
                console.log();
                console.log(error);
            }
        });

        res.contentType('application/json');
        res.status(200);
        res.send({success: true});

    } catch (error) {
        console.log("error", error);
        res.status(500);
        res.send({success: false, error});
    }
}