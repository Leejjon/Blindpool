import {Datastore} from "@google-cloud/datastore";
import {Match, Score} from "../model/Match";
import {err, ok, Result} from "neverthrow";
import {FootballDataApiMatch} from "./footballdata-api/FootballDataApiService";
import {getCompetitionByTeam, getTeamName} from "../constants/Teams";
import {ErrorScenarios} from "../model/ErrorScenarios";
import {EREDIVISIE_CODE, EREDIVISIE_NAME, EURO2020_CODE, EURO2020_NAME} from "./footballdata-api/constants";
import {Entity} from "@google-cloud/datastore/build/src/entity";
import {getDatastoreInstance} from "./DatastoreService";

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
            .limit(10);

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

const datastore = getDatastoreInstance();

const convertToMatchEntity = (match: FootballDataApiMatch) => {
    try {
        const startTimestamp = new Date(match.utcDate);

        const isMatchFinished = function () {
            // SCHEDULED IN_PLAY PAUSED FINISHED
            return match.status === 'FINISHED';
        }

        const createScoreObject = (): Score => {
            if (match.score.fullTime.homeTeam != null && match.score.fullTime.awayTeam != null) {
                let homeScore: number = match.score.fullTime.homeTeam;
                let awayScore: number = match.score.fullTime.awayTeam;

                if (match.score.penalties.homeTeam && match.score.penalties.awayTeam) {
                    homeScore -= match.score.penalties.homeTeam;
                    awayScore -= match.score.penalties.awayTeam;
                }

                return {
                    home: homeScore,
                    away: awayScore,
                } as Score;
            } else {
                return {
                    home: 0,
                    away: 0
                } as Score;
            }
        }

        // TODO: This is bad logic.
        const competitionId = getCompetitionByTeam(match.homeTeam.id, match.awayTeam.id);

        let competitionName = "Competition";
        if (competitionId === EREDIVISIE_CODE) {
            competitionName = EREDIVISIE_NAME;
        }
        if (competitionId === EURO2020_CODE) {
            competitionName = EURO2020_NAME;
        }

        const matchIndexes = [
            {name: 'startTimestamp', value: startTimestamp.toJSON()},
            {name: 'competitionName', value: competitionName},
            {name: 'homeTeamName', value: getTeamName(match.homeTeam.id as number, competitionId)},
            {name: 'homeTeamID', value: match.homeTeam.id},
            {name: 'awayTeamName', value: getTeamName(match.awayTeam.id as number, competitionId)},
            {name: 'awayTeamID', value: match.awayTeam.id},
            {name: 'score', value: createScoreObject()},
            {name: 'finished', value: isMatchFinished()}
        ];
        const matchKind = "match";
        const existingMatchKey = datastore.key([matchKind, `football-data-${match.id}`]);
        return {
            key: existingMatchKey,
            data: matchIndexes
        } as Entity;
    } catch (error) {
        console.log(`We are not storing match ${match.id} because of error: ${error}`);
        return null;
    }
}

export const upsertMatches = async (matches: Array<FootballDataApiMatch>) => {
    try {
        const matchEntities: Entity[]= matches.map(convertToMatchEntity).filter((match) => match != null);
        await datastore.upsert(matchEntities);
    } catch (error) {
        console.error(`Something went wrong with storing the matches in Google Datastore, error: ${error}`);
    }
};
