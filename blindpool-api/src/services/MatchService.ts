import {err, ok, Result} from "neverthrow";
import {ErrorScenarios} from "../models/ErrorScenarios";
import {getDatastoreInstance} from "./DatastoreService";
import {Kinds} from "./BlindpoolService";

export const doesThisMatchExists = async (key: string): Promise<Result<Boolean, ErrorScenarios>> => {
    const datastore = getDatastoreInstance();

    const matchKey = datastore.key([Kinds.MATCH_KIND, key]);
    const [matchEntity] = await datastore.get(matchKey);

    if (matchEntity === undefined) {
        return err(ErrorScenarios.NOT_FOUND);
    } else {
        return ok(true);
    }
};