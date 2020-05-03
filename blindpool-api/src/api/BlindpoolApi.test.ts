import 'mocha';
import * as sinon from 'sinon';
import { Response, Request } from 'express';
import {err, ok, Result} from "neverthrow";

import { getBlindpoolByKey } from "./BlindpoolApi";
import {Blindpool} from "../models/Blindpool";
import * as BlindpoolStorageService from "../services/BlindpoolStorageService";
import {ErrorScenarios} from "../services/BlindpoolStorageService";

describe('Blindpool API', () => {
    const testPool: Blindpool = {
        key: '123',
        participantsAndScores: [{participant: {name: 'Hoi', userType: 1}, score: {homeClubScore: '1', awayClubScore: '0'}}],
        createdTimestamp: BigInt(101)
    };

    let stub: sinon.SinonStub<any[], any>;
    afterEach(() => {
        stub.restore();
    });

    it('Retrieve a blindpool - Success', async() => {
        stub = sinon.stub(BlindpoolStorageService, 'find')
            .returns(<Promise<Result<Blindpool, ErrorScenarios>>>Promise.resolve(ok(testPool)));
        let req: Partial<Request> = { params: { key: 'r06' } };
        let res: Partial<Response> = {
            contentType: sinon.stub(),
            status: sinon.stub(),
            send: sinon.stub()
        };

        await getBlindpoolByKey(<Request>req, <Response>res);
        sinon.assert.calledWith(res.send as sinon.SinonStub, testPool);
    });

    it('Retrieve a blindpool - not found', async() => {
        stub = sinon.stub(BlindpoolStorageService, 'find')
            .returns(<Promise<Result<Blindpool, ErrorScenarios>>>Promise.resolve(err(ErrorScenarios.NOT_FOUND)));
        let requestWithValidKeyButNotExistingPool: Partial<Request> = { params: { key: 'wprD1' } };
        let res: Partial<Response> = {
            contentType: sinon.stub(),
            status: sinon.stub(),
            send: sinon.stub()
        };

        await getBlindpoolByKey(<Request>requestWithValidKeyButNotExistingPool, <Response>res);
        sinon.assert.calledWith(res.send as sinon.SinonStub, 'We can\'t find this pool, sorry!');
    });
});