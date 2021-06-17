import 'mocha';
import {Request, Response} from "express";
import * as sinon from 'sinon';
import {fetchAndSaveScheduledMatches, getMatchByKey, getTenScheduledMatches} from "./MatchesApi";
import {err, ok} from "neverthrow";
import * as FootballDataApi from "../services/footballdata-api/FootballDataApiService";
import * as DatastoreService from "../services/MatchService"
import {
    FootballDataApiMatch
} from "../services/footballdata-api/FootballDataApiService";
import {ErrorScenarios} from "../model/ErrorScenarios";
import {Match} from "../model/Match";

const testFootballApiMatch: FootballDataApiMatch = {
    odds: undefined, referees: [],
    id: 1,
    utcDate: '2020-09-12T16:45:00Z',
    status: 'SCHEDULED',
    matchday: 18,
    stage: 'REGULAR_SEASON',
    group: 'Regular season',
    lastUpdated: '2021-01-24T15:27:12Z',
    score: {
        winner: null,
        duration: 'REGULAR',
        fullTime: {
            homeTeam: null,
            awayTeam: null
        },
        halfTime: {
            homeTeam: null,
            awayTeam: null
        },
        extraTime: {
            homeTeam: null,
            awayTeam: null
        },
        penalties: {
            homeTeam: null,
            awayTeam: null
        }
    },
    homeTeam: {
        id: 675,
        name: 'AZ'
    },
    awayTeam: {
        id: 682,
        name: 'Feyenoord Rotterdam'
    }
};

const testDatastoreMatch: Match = {
    id: 'football-data-302159',
    startTimestamp: new Date('2021-01-26T17:45:00.000Z'),
    homeTeamID: '675',
    homeTeamName: 'AZ',
    awayTeamID: '682',
    awayTeamName: 'Feyenoord Rotterdam'
};

describe('Matches API', () => {
    let footballApiStub: sinon.SinonStub<any[], any>;
    let datastoreApiStub: sinon.SinonStub<any[], any>;

    let res: Partial<Response> = {
        contentType: sinon.stub(),
        status: sinon.stub(),
        send: sinon.stub()
    };

    afterEach(() => {
        sinon.restore();
    });

    it('fetchAndSaveScheduledMatches success', async () => {
        const matchesForTest: Array<FootballDataApiMatch> = [testFootballApiMatch];
        footballApiStub = sinon.stub(FootballDataApi, 'getMatchesFromFootballDataApi')
            .resolves(ok(matchesForTest));
        datastoreApiStub = sinon.stub(DatastoreService, 'upsertMatches');

        let req: Partial<Request> = {};

        await fetchAndSaveScheduledMatches(<Request>req, <Response>res);

        sinon.assert.calledOnce(footballApiStub)
        sinon.assert.calledOnce(datastoreApiStub as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
    });

    it('fetchAndSaveScheduledMatches datastore error', async () => {
        footballApiStub = sinon.stub(FootballDataApi, 'getMatchesFromFootballDataApi')
            .resolves(err(ErrorScenarios.INTERNAL_ERROR));
        datastoreApiStub = sinon.stub(DatastoreService, 'upsertMatches');

        let req: Partial<Request> = {};

        await fetchAndSaveScheduledMatches(<Request>req, <Response>res);
        sinon.assert.calledOnce(footballApiStub)
        sinon.assert.callCount(datastoreApiStub as sinon.SinonStub, 0);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 500);
        sinon.assert.calledWith(res.send as sinon.SinonStub, "An error occurred on our side, sorry!");
    });

    it('getTenScheduledMatches success', async () => {
        datastoreApiStub = sinon.stub(DatastoreService, 'selectTenUpcomingMatches')
            .resolves(ok([testDatastoreMatch]));

        let req: Partial<Request> = {};

        await getTenScheduledMatches(<Request> req, <Response> res);
        sinon.assert.calledOnce(datastoreApiStub as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        sinon.assert.calledWith(res.send as sinon.SinonStub, [testDatastoreMatch]);
    });

    it('getTenScheduledMatches datastore error', async () => {
        datastoreApiStub = sinon.stub(DatastoreService, 'selectTenUpcomingMatches')
            .resolves(err(ErrorScenarios.INTERNAL_ERROR));

        let req: Partial<Request> = {};

        await getTenScheduledMatches(<Request> req, <Response> res);
        sinon.assert.calledOnce(datastoreApiStub as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 500);
        sinon.assert.calledWith(res.send as sinon.SinonStub, 'An error occurred on our side, sorry!');
    });

    it('getMatchByKey success', async () => {
        datastoreApiStub = sinon.stub(DatastoreService, 'selectMatchByKey')
            .resolves(ok(testDatastoreMatch));

        let req: Partial<Request> = {params: {key: 'football-data-302159'}};

        await getMatchByKey(<Request> req, <Response> res);
        sinon.assert.calledOnce(datastoreApiStub as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        sinon.assert.calledWith(res.send as sinon.SinonStub, testDatastoreMatch);
    });

    it('getMatchByKey datastore error', async () => {
        datastoreApiStub = sinon.stub(DatastoreService, 'selectMatchByKey')
            .resolves(err(ErrorScenarios.INTERNAL_ERROR));

        let req: Partial<Request> = {params: {key: 'football-data-302159'}};

        await getMatchByKey(<Request> req, <Response> res);
        sinon.assert.calledOnce(datastoreApiStub as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 500);
        sinon.assert.calledWith(res.send as sinon.SinonStub, 'An error occurred on our side, sorry!');
    });

    it('getMatchByKey validation error', async () => {
        let req: Partial<Request> = {params: {key: 'blabla'}};

        await getMatchByKey(<Request> req, <Response> res);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
        sinon.assert.calledWith(res.send as sinon.SinonStub, 'Invalid input.');
    });
});
