import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { Response, Request } from 'express';

import { getBlindpoolByKey } from "./BlindpoolApi";
import {Blindpool} from "../models/Blindpool";

describe('Blindpool API', () => {
    let sandbox: any = null;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    })

    afterEach(() => {
        sandbox.restore()
    })

    const testPool: Blindpool = {
        key: '123',
        participantsAndScores: [{participant: {name: 'Hoi', userType: 1}, score: {homeClubScore: '1', awayClubScore: '0'}}],
        // createdTimestamp: BigInt(101)
    };

    it('Retrieve a blindpool', async() => {
        let req: Partial<Request> = { params: { key: '123' } };
        let res: Partial<Response> = {
            contentType: sinon.stub(),
            status: sinon.stub(),
            send: sinon.stub()
        };

        await getBlindpoolByKey(<Request>req, <Response>res);
        sinon.assert.calledWith(res.send as sinon.SinonStub, testPool);
    });
});