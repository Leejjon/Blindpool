import 'mocha'
import {expect} from 'chai';
import {ErrorScenarios, findBlindpoolByKey, Kinds} from "./BlindpoolStorageService";
import {Result} from "neverthrow";
import {Blindpool} from "../models/Blindpool";
import * as sinon from "sinon";
import * as DatastoreService from "./DatastoreService";
import {Datastore} from "@google-cloud/datastore/build/src";
import {Entities} from "@google-cloud/datastore/build/src/entity";

describe('BlindpoolStorageService tests', () => {
    const NONE_EXISTING_POOL_KEY = 0;
    const TEST_POOL_KEY = 109;
    const TEST_PARTICIPANT_AND_SCORES = '[{\"participant\":{\"name\":\"Leejjon\",\"userType\":\"0\"},\"score\":{\"homeClubScore\":\"0\",\"awayClubScore\":\"1\"}},{\"participant\":{\"name\":\"Stofkat\",\"userType\":\"0\"},\"score\":{\"homeClubScore\":\"X\",\"awayClubScore\":\"X\"}},{\"participant\":{\"name\":\"Barry\",\"userType\":\"0\"},\"score\":{\"homeClubScore\":\"0\",\"awayClubScore\":\"0\"}},{\"participant\":{\"name\":\"Billy\",\"userType\":\"0\"},\"score\":{\"homeClubScore\":\"1\",\"awayClubScore\":\"0\"}}]';

    afterEach(() => {
        sinon.restore();
    });

    it('Retrieve blindpool - SUCCESS', async () => {
        const queryResponseStubArray: Entities = [
            {
                PARTICIPANTS_AND_SCORES: TEST_PARTICIPANT_AND_SCORES,
                [Datastore.KEY]: {namespace: undefined, id: TEST_POOL_KEY, kind: Kinds.POOL_KIND}
            }
        ];

        const datastoreStub = createSinonStubInstance(Datastore);
        datastoreStub.key.returns((new Datastore()).key([Kinds.POOL_KIND, TEST_POOL_KEY]));
        datastoreStub.get.resolves(queryResponseStubArray);
        sinon.stub(DatastoreService, 'getDatastoreInstance').returns(datastoreStub);

        const result: Result<Blindpool, ErrorScenarios> = await findBlindpoolByKey(TEST_POOL_KEY);
        expect(result.isOk()).to.be.true;
        result.map((blindpool) => {
            const key = blindpool.key;
            expect(key).to.equal(109);
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

    it('Retrieve blindpool - NOT FOUND', async () => {
        const queryResponseStubArray: Entities = [undefined];
        const datastoreStub = createSinonStubInstance(Datastore);
        datastoreStub.key.returns((new Datastore()).key([Kinds.POOL_KIND, NONE_EXISTING_POOL_KEY]));
        datastoreStub.get.resolves(queryResponseStubArray);
        sinon.stub(DatastoreService, 'getDatastoreInstance').returns(datastoreStub);

        const result: Result<Blindpool, ErrorScenarios> = await findBlindpoolByKey(0);
        expect(result.isOk()).to.be.false;
        result.mapErr((errorScenario) => {
            expect(errorScenario).to.equal(ErrorScenarios.NOT_FOUND);
        });
    });

    it('Retrieve blindpool but could not load default credentials - INTERNAL ERROR', async () => {
        const datastoreStub = createSinonStubInstance(Datastore);
        datastoreStub.key.returns((new Datastore()).key([Kinds.POOL_KIND, TEST_POOL_KEY]));
        datastoreStub.get.throws(new Error('Stubbed error to occur on Datastore.get()'));
        sinon.stub(DatastoreService, 'getDatastoreInstance').returns(datastoreStub);

        const result: Result<Blindpool, ErrorScenarios> = await findBlindpoolByKey(109);
        expect(result.isOk()).to.be.false;
        result.mapErr((errorScenario) => {
            expect(errorScenario).to.equal(ErrorScenarios.INTERNAL_ERROR);
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