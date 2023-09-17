import {Match, Score} from "../model/Match";
import {err, ok, Result} from "neverthrow";
import {MatchWithCompetitionIncluded} from "./footballdata-api/FootballDataApiService";
import {ErrorScenarios} from "../model/ErrorScenarios";
import {Entity} from "@google-cloud/datastore/build/src/entity";
import {getDatastoreInstance} from "./DatastoreService";
import {getTeamName,} from "./footballdata-api/constants/Teams";
import {RunQueryResponse} from "@google-cloud/datastore/build/src/query";
import {
    CompetitionEnum,
    competitions,
    getCompetitionByStringName,
} from "blindpool-common/constants/Competitions";
import {PropertyFilter} from "@google-cloud/datastore";

export const selectMatchByKey = async (key: string): Promise<Result<Match, ErrorScenarios>> => {
    try {
        const datastore = getDatastoreInstance(); // This has to happen inside this function for the tests to work.
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

export const selectTenUpcomingMatches = async (competitions: Array<number>): Promise<Result<Array<Match>, ErrorScenarios>> => {
    try {
        const datastore = getDatastoreInstance(); // This has to happen inside this function for the tests to work.
        const currentTimestamp = new Date();
        let query = datastore.createQuery('match')
            .order('startTimestamp', {descending: false})
            .filter(new PropertyFilter('startTimestamp', '>', currentTimestamp.toJSON()))
            .filter(new PropertyFilter('competitionId', 'IN', competitions.map((competition) => competition.toString())))
            .limit(10);
        const result: RunQueryResponse = await datastore.runQuery(query);

        const [upcomingTenMatches] = result;
        const tenMatchesFromEachCompetition: Array<Match> = upcomingTenMatches.map((upcomingMatch) => {
            const key = upcomingMatch[datastore.KEY];
            let match = upcomingMatch;
            match.id = key.name;
            return match;
        });

        return ok(tenMatchesFromEachCompetition);
    } catch (error) {
        console.error(`Something went wrong with retrieving ${error}`);
        return err(ErrorScenarios.INTERNAL_ERROR);
    }
}

export const getCompetitionsThatNeedUpdate = async (): Promise<Result<Array<CompetitionEnum>, ErrorScenarios>> => {
    try {
        const datastore = getDatastoreInstance();
        const currentTimestamp = new Date();

        let query = datastore.createQuery('pool')
            .filter(new PropertyFilter('START_TIMESTAMP', '<', currentTimestamp)) // The match has started.
            .filter(new PropertyFilter('START_TIMESTAMP', '>', new Date(currentTimestamp.getTime() - 100*60000))) // But it hasn't gone over 100 minutes.
            .limit(10);
        const result: RunQueryResponse = await datastore.runQuery(query);

        const [pools] = result;

        // Remove duplicates by putting the items in a set.
        const competitionKeys = [...new Set(pools.map((pool: Entity) => {
            const match = pool.MATCH;
            return getCompetitionByStringName(match.competitionName);
        }))];
        return ok(competitionKeys);
    } catch (error) {
        console.error(`Something went wrong with retrieving active pools ${error}`);
        return err(ErrorScenarios.INTERNAL_ERROR);
    }
}

function convertToMatchEntity(match: MatchWithCompetitionIncluded) {
    try {
        const datastore = getDatastoreInstance(); // This has to happen inside this function for the tests to work.
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

        if (match.homeTeam.id === null || match.awayTeam.id === null) {
            throw Error('This match is a placeholder, we ignore it.');
        }

        const matchIndexes = [
            {name: 'startTimestamp', value: startTimestamp.toJSON()},
            {name: 'competitionName', value: competitions[match.competitionId].competition.toString()},
            {name: 'competitionId', value: match.competitionId.toString()},
            {name: 'homeTeamName', value: getTeamName(match.homeTeam.id as number, match.competitionId.toString())},
            {name: 'homeTeamID', value: match.homeTeam.id},
            {name: 'awayTeamName', value: getTeamName(match.awayTeam.id as number, match.competitionId.toString())},
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

export const upsertMatches = async (matches: Array<MatchWithCompetitionIncluded>) => {
    try {
        const datastore = getDatastoreInstance(); // This has to happen inside this function for the tests to work.
        const matchEntities: Entity[] = matches.map(convertToMatchEntity).filter((match) => match != null);
        await datastore.upsert(matchEntities);
    } catch (error) {
        console.error(`Something went wrong with storing the matches in Google Datastore, error: ${error}`);
    }
};
