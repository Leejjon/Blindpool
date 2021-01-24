import 'mocha';
import {postCreateBlindpool} from "../../../blindpool-api/src/api/BlindpoolApi";
import {Request, Response} from "express";
import * as sinon from 'sinon';
import {fetchAndSaveScheduledMatches} from "./MatchesApi";
import {ok} from "neverthrow";
import * as FootballDataApi from "../services/footballdata-api/FootballDataApiService";
import * as DatastoreService from "../services/DatastoreService"
import {
    FootballDataApiMatch, FootballDataApiScore,
    FootballDataApiScoreInfo,
    FootballDataApiTeam
} from "../services/footballdata-api/FootballDataApiService";

describe('Matches API', () => {
    let footballApiStub: sinon.SinonStub<any[], any>;
    let datastoreApiStub: sinon.SinonStub<any[], any>;
    afterEach(() => {
        sinon.restore();
    });

    it('fetchAndSaveScheduledMatches', async () => {
        const matchesForTest: Array<FootballDataApiMatch> = [{
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
        }];
        footballApiStub = sinon.stub(FootballDataApi, 'getMatchesFromFootballDataApi')
            .resolves(ok(matchesForTest));
        datastoreApiStub = sinon.stub(DatastoreService, 'upsertMatches');

        let res: Partial<Response> = {
            contentType: sinon.stub(),
            status: sinon.stub(),
            send: sinon.stub()
        };

        let req: Partial<Request> = {};

        await fetchAndSaveScheduledMatches(<Request>req, <Response>res);

        sinon.assert.calledOnce(datastoreApiStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        sinon.assert.calledWith(res.send as sinon.SinonStub, {success: true});
    });
});
