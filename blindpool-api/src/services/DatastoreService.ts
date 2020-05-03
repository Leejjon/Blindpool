import {Datastore} from "@google-cloud/datastore/build/src";
import {SinonStubbedInstance} from "sinon";


export const getDatastoreInstance = (): Datastore => {
    return new Datastore();
}

export const getDatastoreKey = () => {
    return Datastore.KEY;
}

export const getTest1Instance = (): Test1 => {
    return new Test1();
}


export class Test1 {
    begroeting: string;

    constructor() {
        this.begroeting = 'Hoi';
    }

    getString() {
        return this.begroeting;
    }
}