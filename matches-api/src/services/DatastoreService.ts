import {Datastore} from "@google-cloud/datastore";
import {Match, Score} from "../model/Match";
import {EREDIVISIE_NAME} from "./footballdata-api/constants";
import {err, ok, Result} from "neverthrow";
import {ErrorScenarios, FootballDataApiMatch} from "./footballdata-api/FootballDataApi";
import {getTeamName} from "../constants/Teams";

export const selectTenUpcomingMatches = async (): Promise<Result<Array<Match>, ErrorScenarios>> => {
    try {
        const currentTimestamp = new Date();
        const datastore = new Datastore();
        const query = datastore.createQuery('match')
            .order('startTimestamp', {descending: false})
            .filter('startTimestamp', '>', currentTimestamp.toJSON())
            .limit(5);

        let [upcomingTenMatches] = await datastore.runQuery(query);

        return ok(upcomingTenMatches.map((upcomingMatch) => {
            console.log(`Upcoming match: ${JSON.stringify(upcomingMatch)}`);
            // const startTimestamp: Date = new Date(upcomingMatch.startTimestamp);
            const key = upcomingMatch[datastore.KEY];

            let match: Match = { id: key.name, startTimestamp: upcomingMatch.startTimestamp, competitionName: upcomingMatch.competitionName,
                awayTeamName: upcomingMatch.awayTeamName, awayTeamID: upcomingMatch.awayTeamID,
                homeTeamName: upcomingMatch.homeTeamName, homeTeamID: upcomingMatch.homeTeamID
            };
            return match;
        }));
    } catch (error) {
        console.error(`Something went wrong with retrieving ${error}`);
        return err(ErrorScenarios.DATASTORE_ERROR);
    }
};

export const upsertMatches = async (matches: Array<FootballDataApiMatch>) => {
    try {
        const matchKind = "match";
        const datastore = new Datastore();

        const matchEntities = matches.map((match) => {
            const startTimestamp = new Date(match.utcDate);

            const isMatchFinished = function () {
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
                { name: 'startTimestamp', value: startTimestamp.toJSON() },
                { name: 'competitionName', value: EREDIVISIE_NAME },
                { name: 'homeTeamName', value: getTeamName(match.homeTeam.id) },
                { name: 'homeTeamID', value: match.homeTeam.id },
                { name: 'awayTeamName', value: getTeamName(match.awayTeam.id)},
                { name: 'awayTeamID', value: match.awayTeam.id },
                { name: 'score', value: createScoreObject() },
                { name: 'finished', value: isMatchFinished() }
            ];

            const existingMatchKey = datastore.key([matchKind, `football-data-${match.id}`]);
            return {
                key: existingMatchKey,
                data: matchIndexes
            };
        });

        await datastore.upsert(matchEntities);
    } catch (error) {
        console.error(`Something went wrong with storing the matches in Google Datastore, error: ${error}`);
    }
};