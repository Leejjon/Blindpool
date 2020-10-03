import {Datastore} from "@google-cloud/datastore";
import {Match, Score} from "../model/Match";
import {EREDIVISIE_NAME} from "./footballdata-api/constants";
import {err, ok, Result} from "neverthrow";
import {ErrorScenarios, FootballDataApiMatch} from "./footballdata-api/FootballDataApi";

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
            console.log(`Upcoming match: ${JSON.stringify(upcomingMatch)}`);
            const startTimestamp: Date = new Date(upcomingMatch.startTimestamp);
            const key = upcomingMatch[datastore.KEY];
            let match: Match = { id: key.name, ...upcomingMatch};
            return match;
        }));
    } catch (error) {
        console.error(`Something went wrong with retrieving ${error}`);
        return err(ErrorScenarios.DATASTORE_ERROR);
    }
};

export const insertOrUpdateMatch = async (match: FootballDataApiMatch) => {
    try {
        const matchKind = "match";
        const datastore = new Datastore();
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
            { name: 'homeTeam', value: match.homeTeam.name },
            { name: 'homeTeamID', value: match.homeTeam.id },
            { name: 'awayTeam', value: match.awayTeam.name },
            { name: 'awayTeamID', value: match.awayTeam.id },
            { name: 'score', value: createScoreObject() },
            { name: 'finished', value: isMatchFinished() }
        ];

        const existingMatchKey = datastore.key([matchKind, `football-data-${match.id}`]);
        const [existingMatch] = await datastore.get(existingMatchKey);

        if (existingMatch) {
            const externalHomeTeamScore = match.score.fullTime.homeTeam;
            const externalAwayTeamScore = match.score.fullTime.awayTeam;
            if ((externalHomeTeamScore !== null && externalAwayTeamScore !== null)
                && (externalHomeTeamScore !== existingMatch.score.homeScore || externalAwayTeamScore !== existingMatch.score.awayScore)) {
                console.log(`Updated score for ${match.homeTeam.name}-${match.awayTeam.name} that started at ${match.utcDate} to ${match.score.fullTime.homeTeam}-${match.score.fullTime.awayTeam}`);

                const updatedMatch = {
                    key: existingMatchKey,
                    data: matchIndexes
                };
                await datastore.update(updatedMatch);
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
    } catch (error) {
        console.error(`Something went wrong with storing the match ${JSON.stringify(match)} in Google Datastore, error: ${error}`);
    }
};