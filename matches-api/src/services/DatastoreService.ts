import {Datastore} from "@google-cloud/datastore";
import {Match, Score} from "../model/Match";
import {EREDIVISIE_NAME} from "./footballdata-api/constants";
import {err, ok, Result} from "neverthrow";
import {FootballDataApiMatch} from "./footballdata-api/FootballDataApi";
import {getTeamName} from "../constants/Teams";
import {ErrorScenarios} from "../model/ErrorScenarios";

export const selectMatchByKey = async (key: string): Promise<Result<Match, ErrorScenarios>> => {
    try {
        const datastore = new Datastore();
        const matchKey = datastore.key(['match', key]);
        const [matchEntity] = await datastore.get(matchKey);

        if (matchEntity) {
            return ok(matchEntity);
        } else {
            return err(ErrorScenarios.MATCH_NOT_FOUND);
        }
    } catch (error) {
        console.error(`Something went wrong with retrieving ${error}`);
        return err(ErrorScenarios.DATASTORE_ERROR);
    }
};

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
            const key = upcomingMatch[datastore.KEY];
            let match = upcomingMatch;
            match.id = key.name;
            return match;
        }));
    } catch (error) {
        console.error(`Something went wrong with retrieving ${error}`);
        return err(ErrorScenarios.INTERNAL_ERROR);
    }
};

export const upsertMatches = async (matches: Array<FootballDataApiMatch>) => {
    try {
        const matchKind = "match";
        const datastore = new Datastore();

        const matchEntities = matches.map((match) => {
            const startTimestamp = new Date(match.utcDate);

            const isMatchFinished = function () {
                // SCHEDULED IN_PLAY PAUSED FINISHED
                return match.status === 'FINISHED';
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
                    } as Score;
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