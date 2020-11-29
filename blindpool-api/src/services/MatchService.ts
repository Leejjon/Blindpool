import {err, ok, Result} from "neverthrow";
import {ErrorScenarios} from "../models/ErrorScenarios";
import {getDatastoreInstance} from "./DatastoreService";
import {Kinds} from "./BlindpoolService";
import {Match} from "../models/Blindpool";

export const doesThisMatchExists = async (key: string): Promise<Result<Match, ErrorScenarios>> => {
    const datastore = getDatastoreInstance();

    const matchKey = datastore.key([Kinds.MATCH_KIND, key]);

    const [matchEntity] = await datastore.get(matchKey);

    if (matchEntity === undefined) {
        return err(ErrorScenarios.MATCH_NOT_FOUND);
    } else {
        let match: Match = {
            awayTeamID: matchEntity.awayTeamID, awayTeamName: matchEntity.awayTeamName, homeTeamID: matchEntity.homeTeamID, homeTeamName: matchEntity.homeTeamName, id: key
        };
        return ok(match);
    }
};