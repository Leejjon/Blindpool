import 'mocha';
import * as sinon from 'sinon';
import { Response, Request } from 'express';
import {err, ok} from "neverthrow";
import {getBlindpoolByKey, getBlindpoolStatistics} from "./BlindpoolApi";
import {Blindpool} from "../models/Blindpool";
import * as BlindpoolStorageService from "../services/BlindpoolStorageService";
import {ErrorScenarios} from "../services/BlindpoolStorageService";

describe('Blindpool API', () => {
    const testPool: Blindpool = {
        key: '123',
        PARTICIPANTS_AND_SCORES: [{participant: {name: 'Hoi', userType: 1}, score: {homeClubScore: '1', awayClubScore: '0'}}],
        CREATED_TIMESTAMP: new Date()
    };

    let res: Partial<Response> = {
        contentType: sinon.stub(),
        status: sinon.stub(),
        send: sinon.stub()
    };

    let stub: sinon.SinonStub<any[], any>;
    afterEach(() => {
        sinon.restore();
    });

    it('Retrieve blindpool - SUCCESS', async() => {
        stub = sinon.stub(BlindpoolStorageService, 'findBlindpoolByKey')
            .resolves(ok(testPool));
        let validRequest: Partial<Request> = { params: { key: 'r06' } };
        let res: Partial<Response> = {
            contentType: sinon.stub(),
            status: sinon.stub(),
            send: sinon.stub()
        };

        await getBlindpoolByKey(<Request>validRequest, <Response>res);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        sinon.assert.calledWith(res.send as sinon.SinonStub, testPool);
    });

    it('Retrieve blindpool - NOT FOUND', async() => {
        stub = sinon.stub(BlindpoolStorageService, 'findBlindpoolByKey')
            .resolves(err(ErrorScenarios.NOT_FOUND));
        let requestWithValidKeyButNotExistingPool: Partial<Request> = { params: { key: 'wprD1' } };

        await getBlindpoolByKey(<Request>requestWithValidKeyButNotExistingPool, <Response>res);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 404);
        sinon.assert.calledWith(res.send as sinon.SinonStub, 'We can\'t find this pool, sorry!');
    });

    it('Retrieve blindpool statistics - SUCCESS', async () => {
        const expectedCount = 5;
        let emptyRequest: Partial<Request> = {};

        stub = sinon.stub(BlindpoolStorageService, 'calculateBlindpoolCount')
            .resolves(ok(expectedCount));

        await getBlindpoolStatistics(<Request> emptyRequest, <Response> res);

        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        sinon.assert.calledWith(res.send as sinon.SinonStub, {count: expectedCount});
    });

    it('Retrieve blindpool statistics - INTERNAL ERROR', async () => {
        let emptyRequest: Partial<Request> = {};

        stub = sinon.stub(BlindpoolStorageService, 'calculateBlindpoolCount')
            .resolves(err(ErrorScenarios.INTERNAL_ERROR));

        await getBlindpoolStatistics(<Request> emptyRequest, <Response> res);

        sinon.assert.calledWith(res.status as sinon.SinonStub, 500);
        sinon.assert.calledWith(res.send as sinon.SinonStub, 'An error occurred on our side, sorry!');
    });
});