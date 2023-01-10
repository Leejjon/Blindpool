import 'mocha';
import * as sinon from 'sinon';
import {Response, Request, NextFunction, RequestHandler} from 'express';
import {err, ok} from "neverthrow";
import {getBlindpoolByKey, getBlindpoolStatistics, postCreateBlindpool} from "./BlindpoolApi";
import {Blindpool} from "../models/Blindpool";
import * as BlindpoolStorageService from "../services/BlindpoolService";
import {ErrorScenarios} from "../models/ErrorScenarios";
// import {CreateBlindpoolRequest} from "blindpool-common";
import {plainToClass} from "class-transformer";
import {IsOptional, IsString, Matches, validate} from "class-validator";
import {CreateBlindpoolRequest} from "blindpool-common";

describe('Blindpool API', () => {
    const testPool: Blindpool = {
        key: '123',
        PARTICIPANTS_AND_SCORES: [
            {participant: {name: 'Hoi', userType: 0}, score: {home: 1, away: 0}},
            {participant: {name: 'Doei', userType: 0}, score: {home: -1, away: -1}}
        ],
        CREATED_TIMESTAMP: new Date()
    };

    let res: Partial<Response> = {
        contentType: sinon.stub(),
        status: sinon.stub(),
        send: sinon.stub()
    };

    let next: NextFunction = sinon.stub();

    let stub: sinon.SinonStub<any[], any>;
    afterEach(() => {
        sinon.restore();
    });

    // it('Create blindpool - SUCCESS', async () => {
    //     stub = sinon.stub(BlindpoolStorageService, 'insertNewBlindpool')
    //         .resolves(ok(testPool));
    //
    //     let createBlindpoolRequestBody = {
    //         participants: ['Hoi', 'doei'],
    //     };
    //     let validRequest: Partial<Request> = { body: createBlindpoolRequestBody};
    //
    //     await postCreateBlindpool(<Request>validRequest, <Response>res);
    //     sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
    //     sinon.assert.calledWith(res.send as sinon.SinonStub, testPool);
    // });

    it('Create blindpool - invalid name - FAIL', async () => {
        let createBlindpoolRequestBody = {
            participants: 5
        };

        let validRequest: Partial<Request> = { body: createBlindpoolRequestBody};

        async function tryValidation<T extends Object>(req: Request, type: any) {
            // For some reason the class-transformer and class-validator don't see arrays as a validation error.
            const requestBody: string = JSON.stringify(req.body);

            console.log(requestBody);
            console.log(type);
        }

        await tryValidation<CreateBlindpoolRequest>(<Request> validRequest, CreateBlindpoolRequest);

        // class RequestBody {
        //     @IsString()
        //     name: string;
        //
        //     constructor(name: string) {
        //         this.name = name;
        //     }
        // }
        //
        // await tryValidation<RequestBody>(<Request> validRequest, RequestBody);
        console.log("Success?");
    });


    // it('Create blindpool - empty body - FAIL', async () => {
    //     let validRequest: Partial<Request> = {};
    //     let res: Partial<Response> = {
    //         contentType: sinon.stub(),
    //         status: sinon.stub(),
    //         send: sinon.stub()
    //     };
    //
    //     await postCreateBlindpool(<Request>validRequest, <Response>res);
    //     sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
    // });
    //
    // it('Create blindpool - empty list in body - FAIL', async () => {
    //     let validRequest: Partial<Request> = {body: {participants: []}};
    //     let res: Partial<Response> = {
    //         contentType: sinon.stub(),
    //         status: sinon.stub(),
    //         send: sinon.stub()
    //     };
    //
    //     await postCreateBlindpool(<Request>validRequest, <Response>res);
    //     sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
    // });
    //
    // it('Create blindpool - name with invalid character - FAIL', async () => {
    //     let validRequest: Partial<Request> = {body: {participants: ['Hoi', 'Doei!']}};
    //     let res: Partial<Response> = {
    //         contentType: sinon.stub(),
    //         status: sinon.stub(),
    //         send: sinon.stub()
    //     };
    //
    //     await postCreateBlindpool(<Request>validRequest, <Response>res);
    //     sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
    // });
    //
    // it('Retrieve blindpool - SUCCESS', async () => {
    //     stub = sinon.stub(BlindpoolStorageService, 'findBlindpoolByKey')
    //         .resolves(ok(testPool));
    //     let validRequest: Partial<Request> = {params: {key: 'r06'}};
    //     let res: Partial<Response> = {
    //         contentType: sinon.stub(),
    //         status: sinon.stub(),
    //         send: sinon.stub()
    //     };
    //
    //     await getBlindpoolByKey(<Request>validRequest, <Response>res);
    //     sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
    //     sinon.assert.calledWith(res.send as sinon.SinonStub, testPool);
    // });
    //
    // it('Retrieve blindpool - NOT FOUND', async () => {
    //     stub = sinon.stub(BlindpoolStorageService, 'findBlindpoolByKey')
    //         .resolves(err(ErrorScenarios.POOL_NOT_FOUND));
    //     let requestWithValidKeyButNotExistingPool: Partial<Request> = {params: {key: 'wprD1'}};
    //
    //     await getBlindpoolByKey(<Request>requestWithValidKeyButNotExistingPool, <Response>res);
    //     sinon.assert.calledWith(res.status as sinon.SinonStub, 404);
    //     sinon.assert.calledWith(res.send as sinon.SinonStub, 'We can\'t find this pool, sorry!');
    // });
    //
    // it('Retrieve blindpool statistics - SUCCESS', async () => {
    //     const expectedCount = 5;
    //     let emptyRequest: Partial<Request> = {};
    //
    //     stub = sinon.stub(BlindpoolStorageService, 'calculateBlindpoolCount')
    //         .resolves(ok(expectedCount));
    //
    //     await getBlindpoolStatistics(<Request>emptyRequest, <Response>res);
    //
    //     sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
    //     sinon.assert.calledWith(res.send as sinon.SinonStub, {count: expectedCount});
    // });
    //
    // it('Retrieve blindpool statistics - INTERNAL ERROR', async () => {
    //     let emptyRequest: Partial<Request> = {};
    //
    //     stub = sinon.stub(BlindpoolStorageService, 'calculateBlindpoolCount')
    //         .resolves(err(ErrorScenarios.INTERNAL_ERROR));
    //
    //     await getBlindpoolStatistics(<Request>emptyRequest, <Response>res);
    //
    //     sinon.assert.calledWith(res.status as sinon.SinonStub, 500);
    //     sinon.assert.calledWith(res.send as sinon.SinonStub, 'An error occurred on our side, sorry!');
    // });
});
