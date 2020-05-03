import 'mocha'
import {expect} from 'chai';
import {ErrorScenarios, find} from "./BlindpoolStorageService";
import {Result} from "neverthrow";
import {Blindpool} from "../models/Blindpool";
import * as sinon from "sinon";
import * as DatastoreService from "./DatastoreService";
import {Datastore, Query} from "@google-cloud/datastore/build/src";
import {Entities} from "@google-cloud/datastore/build/src/entity";

describe('BlindpoolStorageService tests', () => {
    const TEST_POOL_KEY = '109';
    const TEST_PARTICIPANT_AND_SCORES = '[{\"participant\":{\"name\":\"Leejjon\",\"userType\":\"0\"},\"score\":{\"homeClubScore\":\"0\",\"awayClubScore\":\"1\"}},{\"participant\":{\"name\":\"Stofkat\",\"userType\":\"0\"},\"score\":{\"homeClubScore\":\"X\",\"awayClubScore\":\"X\"}},{\"participant\":{\"name\":\"Barry\",\"userType\":\"0\"},\"score\":{\"homeClubScore\":\"0\",\"awayClubScore\":\"0\"}},{\"participant\":{\"name\":\"Billy\",\"userType\":\"0\"},\"score\":{\"homeClubScore\":\"1\",\"awayClubScore\":\"0\"}}]';

    afterEach(() => {
        sinon.restore;
    });

    it('Retrieve a blindpool - SUCCESS', async () => {
        const queryResponseStubArray: Entities = [
            [
                {PARTICIPANTS_AND_SCORES: TEST_PARTICIPANT_AND_SCORES,
                [Datastore.KEY]: {namespace: undefined, id: TEST_POOL_KEY, kind: 'pool'}}
            ]
        ];

        const queryStub = createSinonStubInstance(Query);
        queryStub.filter.returns(queryStub); // Filter to do nothing.

        const datastoreStub = createSinonStubInstance(Datastore);
        datastoreStub.createQuery.returns(queryStub);
        datastoreStub.runQuery.resolves(queryResponseStubArray);
        sinon.stub(DatastoreService, 'getDatastoreInstance').returns(datastoreStub);

        const result: Result<Blindpool, ErrorScenarios> = await find(0);

        expect(result.isOk());
        result.map((blindpool) => {
            const key = blindpool.key;
            expect(key).to.equal('109');
            const participantsAndScores = blindpool.participantsAndScores;
            const [first, second] = participantsAndScores;
            expect(first.participant.name).to.equal('Leejjon');
            expect(first.score.homeClubScore).to.equal('0');
            expect(first.score.awayClubScore).to.equal('1');
            expect(second.participant.name).to.equal('Stofkat');
            expect(second.score.homeClubScore).to.equal('X');
            expect(second.score.awayClubScore).to.equal('X');
        });
    });
});

// For some reason sinon.createStubInstance(obj) gives an error, this guy solved it with the code below:
// https://github.com/sinonjs/sinon/issues/1963
// This new createSinonStubInstance() works perfectly.
export type StubbedClass<T> = sinon.SinonStubbedInstance<T> & T;

export function createSinonStubInstance<T>(
    constructor: sinon.StubbableType<T>,
    overrides?: { [K in keyof T]?: sinon.SinonStubbedMember<T[K]> },
): StubbedClass<T> {
    const stub = sinon.createStubInstance<T>(constructor, overrides);
    return stub as unknown as StubbedClass<T>;
}