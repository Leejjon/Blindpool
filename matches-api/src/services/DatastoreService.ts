import {Datastore} from "@google-cloud/datastore/build/src";

export const getDatastoreInstance = (): Datastore => {
    return new Datastore();
}
