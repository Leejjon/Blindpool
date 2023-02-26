import * as sinon from 'sinon';
import {Response, Request, NextFunction} from 'express';
import {err, ok} from "neverthrow";
import {getBlindpoolByKey, getBlindpoolStatistics, postCreateBlindpool} from "./BlindpoolApi";
import {Blindpool} from "../models/Blindpool";
import * as BlindpoolStorageService from "../services/BlindpoolService";
import {CreateBlindpoolRequest} from "blindpool-common";
import {tryValidation} from "../validation/Validation";
import {ErrorScenarios} from "../models/ErrorScenarios";

describe('Blindpool API', () => {
    const testPool: Blindpool = {
        key: '123',
        PARTICIPANTS_AND_SCORES: [
            {participant: {name: 'Hoi', userType: 0}, score: {home: 1, away: 0}},
            {participant: {name: 'Doei', userType: 0}, score: {home: -1, away: -1}}
        ],
        CREATED_TIMESTAMP: new Date()
    };

    function createStubbedResponse() {
        return {
            contentType: sinon.stub(),
            status: sinon.stub(),
            send: sinon.stub()
        }
    }

    let stub: sinon.SinonStub<any[], any>;
    afterEach(() => {
        sinon.restore();
    });

    it('Create blindpool - SUCCESS', async () => {
        stub = sinon.stub(BlindpoolStorageService, 'insertNewBlindpool')
            .resolves(ok(testPool));

        let createBlindpoolRequestBody = {
            participants: ['Hoi', 'doei'],
        };

        let res: Partial<Response> = createStubbedResponse();

        let next = sinon.stub();

        let validRequest: Partial<Request> = { body: createBlindpoolRequestBody};

        await tryValidation<CreateBlindpoolRequest>(<Request> validRequest, <Response> res, next, CreateBlindpoolRequest);
        await postCreateBlindpool(<Request>validRequest, <Response>res);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        sinon.assert.calledWith(res.send as sinon.SinonStub, testPool);
        sinon.assert.calledOnce(next);
    });

    it('Create blindpool - invalid name - FAIL', async () => {
        let createBlindpoolRequestBody = {
            participants: 5 // Participants should be a String array.
        };

        let validRequest: Partial<Request> = { body: createBlindpoolRequestBody};
        let res: Partial<Response> = createStubbedResponse();
        let next = sinon.stub();

        await tryValidation<CreateBlindpoolRequest>(<Request> validRequest, <Response> res, next, CreateBlindpoolRequest);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
        sinon.assert.calledWith(res.send as sinon.SinonStub, "Invalid request.");
        sinon.assert.notCalled(next);
    });


    it('Create blindpool - empty body - FAIL', async () => {
        let validRequest: Partial<Request> = { body: {}};

        let res: Partial<Response> = createStubbedResponse();
        let next = sinon.stub();

        await tryValidation<CreateBlindpoolRequest>(<Request> validRequest, <Response> res, next, CreateBlindpoolRequest);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
        sinon.assert.calledWith(res.send as sinon.SinonStub, "Invalid request.");
        sinon.assert.notCalled(next);
    });

    it('Create blindpool - empty list in body - FAIL', async () => {
        let validRequest: Partial<Request> = {body: {participants: []}};

        let res: Partial<Response> = createStubbedResponse();
        let next = sinon.stub();

        await tryValidation<CreateBlindpoolRequest>(<Request> validRequest, <Response> res, next, CreateBlindpoolRequest);
        await postCreateBlindpool(<Request>validRequest, <Response>res);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
        sinon.assert.calledWith(res.send as sinon.SinonStub, 'Invalid input.');
        sinon.assert.calledOnce(next);
    });

    it('Create blindpool - name with invalid character - FAIL', async () => {
        let validRequest: Partial<Request> = {body: {participants: ['Hoi', 'Doei!']}};

        let res: Partial<Response> = createStubbedResponse();
        let next = sinon.stub();

        await tryValidation<CreateBlindpoolRequest>(<Request> validRequest, <Response> res, next, CreateBlindpoolRequest);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
        sinon.assert.calledWith(res.send as sinon.SinonStub, "Invalid request.");
        sinon.assert.notCalled(next);
    });

    it('Retrieve blindpool - SUCCESS', async () => {
        stub = sinon.stub(BlindpoolStorageService, 'findBlindpoolByKey')
            .resolves(ok(testPool));
        let validRequest: Partial<Request> = {params: {key: 'r06'}};

        let res: Partial<Response> = createStubbedResponse();

        await getBlindpoolByKey(<Request>validRequest, <Response>res);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        sinon.assert.calledWith(res.send as sinon.SinonStub, testPool);
    });

    it('Retrieve blindpool - NOT FOUND', async () => {
        stub = sinon.stub(BlindpoolStorageService, 'findBlindpoolByKey')
            .resolves(err(ErrorScenarios.POOL_NOT_FOUND));
        let requestWithValidKeyButNotExistingPool: Partial<Request> = {params: {key: 'wprD1'}};

        let res: Partial<Response> = createStubbedResponse();

        await getBlindpoolByKey(<Request>requestWithValidKeyButNotExistingPool, <Response>res);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 404);
        sinon.assert.calledWith(res.send as sinon.SinonStub, 'We can\'t find this pool, sorry!');
    });

    it('Retrieve blindpool statistics - SUCCESS', async () => {
        const expectedCount = 5;
        let emptyRequest: Partial<Request> = {};

        stub = sinon.stub(BlindpoolStorageService, 'calculateBlindpoolCount')
            .resolves(ok(expectedCount));

        let res: Partial<Response> = createStubbedResponse();

        await getBlindpoolStatistics(<Request>emptyRequest, <Response>res);

        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        sinon.assert.calledWith(res.send as sinon.SinonStub, {count: expectedCount});
    });

    it('Retrieve blindpool statistics - INTERNAL ERROR', async () => {
        let emptyRequest: Partial<Request> = {};

        stub = sinon.stub(BlindpoolStorageService, 'calculateBlindpoolCount')
            .resolves(err(ErrorScenarios.INTERNAL_ERROR));

        let res: Partial<Response> = createStubbedResponse();

        await getBlindpoolStatistics(<Request>emptyRequest, <Response>res);

        sinon.assert.calledWith(res.status as sinon.SinonStub, 500);
        sinon.assert.calledWith(res.send as sinon.SinonStub, 'An error occurred on our side, sorry!');
    });
});
