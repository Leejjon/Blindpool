import {Datastore} from "@google-cloud/datastore";
import {Score} from "../model/Match";
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
                const startTimestamp = new Date(match.utcDate);

                const isMatchFinished = function() {
                    return match.score.fullTime.homeTeam != null && match.score.fullTime.awayTeam != null;
                }

                const createScoreObject = (): Score => {
                    if (match.score.fullTime.homeTeam != null && match.score.fullTime.awayTeam != null) {
                        return {
                            home: match.score.fullTime.homeTeam,
                            away: match.score.fullTime.awayTeam,
                        } as Score;
                    } else {
                        return {
                            home: 0,
                            away: 0
                        } as Score
                    }
                }

                const matchIndexes = [
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

                const existingMatchKey = datastore.key([matchKind, `football-data-${match.id}`]);
                const [existingMatch] = await datastore.get(existingMatchKey);

                if (existingMatch) {
                    const externalHomeTeamScore = match.score.fullTime.homeTeam;
                    const externalAwayTeamScore = match.score.fullTime.awayTeam;
                    if ((externalHomeTeamScore !== null && externalAwayTeamScore !== null)
                        && (externalHomeTeamScore !== existingMatch.score.homeScore || externalAwayTeamScore !== existingMatch.score.awayScore)) {

                        const updatedMatch = {
                            key: existingMatchKey,
                            data: matchIndexes
                        };

                        await datastore.update(updatedMatch);
                        console.log(`Updated score for ${match.homeTeam.name}-${match.awayTeam.name} that started at ${match.utcDate} to ${match.score.fullTime.homeTeam}-${match.score.fullTime.awayTeam}`);
                    }
                } else {
                    console.log(`Storing new match ${match.homeTeam.name}-${match.awayTeam.name} at ${match.utcDate}`);

                    const matchKey = datastore.key([matchKind, `football-data-${match.id}`]);
                    const matchData = {
                        key: matchKey,
                        data: matchIndexes,
                    };
                    await datastore.save(matchData);
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