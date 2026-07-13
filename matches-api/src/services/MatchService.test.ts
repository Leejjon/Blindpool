import {upsertMatches} from "./MatchService";
import * as sinon from "sinon";
import {MatchWithCompetitionIncluded} from "./footballdata-api/FootballDataApiService";
import {Datastore} from "@google-cloud/datastore/build/src";
import * as DatastoreService from "./DatastoreService";
import {entity} from "@google-cloud/datastore/build/src/entity";

import {describe} from "mocha";
import * as assert from "assert";

const turkeyVsItalyMatch = {
    "id": 285418,
    "season": {
        "id": 507,
        "startDate": "2021-06-11",
        "endDate": "2021-07-11",
        "currentMatchday": 1
    },
    "utcDate": "2021-06-11T19:00:00Z",
    "status": "FINISHED",
    "matchday": 1,
    "stage": "GROUP_STAGE",
    "group": "Group A",
    "lastUpdated": "2021-06-11T23:19:01Z",
    "odds": {
        "msg": "Activate Odds-Package in User-Panel to retrieve odds."
    },
    "score": {
        "winner": "AWAY_TEAM",
        "duration": "REGULAR",
        "fullTime": {
            "home": 0,
            "away": 3
        },
        "halfTime": {
            "home": 0,
            "away": 0
        },
        "extraTime": {
            "home": null,
            "away": null
        },
        "penalties": {
            "home": null,
            "away": null
        }
    },
    "homeTeam": {
        "id": 803,
        "name": "Turkey"
    },
    "awayTeam": {
        "id": 784,
        "name": "Italy"
    },
    "referees": [
        {
            "id": 43899,
            "name": "Danny Makkelie",
            "role": "REFEREE",
            "nationality": "Netherlands"
        },
        {
            "id": 43900,
            "name": "Hessel Steegstra",
            "role": "ASSISTANT_REFEREE_N1",
            "nationality": "Netherlands"
        },
        {
            "id": 15154,
            "name": "Jan de Vries",
            "role": "ASSISTANT_REFEREE_N2",
            "nationality": "Netherlands"
        },
        {
            "id": 25786,
            "name": "Stéphanie Frappart",
            "role": "FOURTH_OFFICIAL",
            "nationality": "France"
        },
        {
            "id": 43902,
            "name": "Kevin Blom",
            "role": "VIDEO_ASSISANT_REFEREE_N1",
            "nationality": "Netherlands"
        },
        {
            "id": 15152,
            "name": "Pol van Boekel",
            "role": "VIDEO_ASSISANT_REFEREE_N2",
            "nationality": "Netherlands"
        }
    ],
    competitionId: 2000
};

const finalMatch = {
    "id": 325077,
    "season": {
        "id": 507,
        "startDate": "2021-06-11",
        "endDate": "2021-07-11",
        "currentMatchday": 1
    },
    "utcDate": "2021-07-11T19:00:00Z",
    "status": "SCHEDULED",
    "matchday": 7,
    "stage": "FINAL",
    "group": null,
    "lastUpdated": "2021-05-16T12:52:37Z",
    "odds": {
        "msg": "Activate Odds-Package in User-Panel to retrieve odds."
    },
    "score": {
        "winner": null,
        "duration": "REGULAR",
        "fullTime": {
            "home": null,
            "away": null
        },
        "halfTime": {
            "home": null,
            "away": null
        },
        "extraTime": {
            "home": null,
            "away": null
        },
        "penalties": {
            "home": null,
            "away": null
        }
    },
    "homeTeam": {
        "id": null,
        "name": null
    },
    "awayTeam": {
        "id": null,
        "name": null
    },
    "referees": [],
    competitionId: 2000
};

const netherlandsVsJapan = {
    "area": {"id": 2267, "name": "World", "code": "INT", "flag": null},
    "competition": {
        "id": 2000,
        "name": "FIFA World Cup",
        "code": "WC",
        "type": "CUP",
        "emblem": "https://crests.football-data.org/wm26.png"
    },
    "season": {"id": 2398, "startDate": "2026-06-11", "endDate": "2026-07-19", "currentMatchday": 1, "winner": null},
    "id": 537357,
    "utcDate": "2026-06-14T20:00:00Z",
    "status": "FINISHED",
    "matchday": 1,
    "stage": "GROUP_STAGE",
    "group": "GROUP_F",
    "lastUpdated": "2026-06-14T22:01:31Z",
    "homeTeam": {
        "id": 8601,
        "name": "Netherlands",
        "shortName": "Netherlands",
        "tla": "NED",
        "crest": "https://crests.football-data.org/8601.svg"
    },
    "awayTeam": {
        "id": 766,
        "name": "Japan",
        "shortName": "Japan",
        "tla": "JPN",
        "crest": "https://crests.football-data.org/766.svg"
    },
    "score": {
        "winner": "DRAW",
        "duration": "REGULAR",
        "fullTime": {"home": 2, "away": 2},
        "halfTime": {"home": 0, "away": 0}
    },
    "odds": {"msg": "Activate Odds-Package in User-Panel to retrieve odds."},
    "referees": [{"id": 76608, "name": "Ismail Elfath", "type": "REFEREE", "nationality": "United States"}],
    "competitionId": 2000
};

/*
* Because it was difficult to mock the datastore key, we usre the real datastore for this.
* Therefore when running this test with npm run test you need the local datastore environment variables.
*/
describe('Test datastore calls', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('Just turkey vs Italy match', async () => {
        const datastoreStub = createSinonStubInstance(Datastore);
        datastoreStub.key.returns({
            namespace: undefined, name: "football-data-285418", kind: "match", path: ["match", `football-data-285418`]
        } as entity.Key);
        datastoreStub.upsert.resolves(); // Resolve nothing because in production code we don't even await.
        sinon.stub(DatastoreService, 'getDatastoreInstance').returns(datastoreStub);

        let matches: Array<MatchWithCompetitionIncluded> = [turkeyVsItalyMatch];
        await upsertMatches(matches);
    });

    it('Turkey vs Italy match and incomplete match', async () => {
        const datastoreStub = createSinonStubInstance(Datastore);
        datastoreStub.key.returns({
            namespace: undefined, name: "football-data-285418", kind: "match", path: ["match", `football-data-285418`]
        } as entity.Key);
        datastoreStub.upsert.resolves(); // Resolve nothing
        sinon.stub(DatastoreService, 'getDatastoreInstance').returns(datastoreStub);

        let matches: Array<MatchWithCompetitionIncluded> = [turkeyVsItalyMatch, finalMatch];
        await upsertMatches(matches);
    });

    it('Verify Netherlands vs Japan match', async () => {
        const matchKey = {
            namespace: undefined, name: "football-data-537357", kind: "match", path: ["match", `football-data-537357`]
        } as entity.Key;
        const datastoreStub = createSinonStubInstance(Datastore);
        datastoreStub.key.returns(matchKey);
        datastoreStub.upsert.resolves(); // Resolve nothing
        sinon.stub(DatastoreService, 'getDatastoreInstance').returns(datastoreStub);

        let matches: Array<MatchWithCompetitionIncluded> = [netherlandsVsJapan];
        await upsertMatches(matches);

        sinon.assert.calledOnce(datastoreStub.upsert);
        const upsertedEntities = datastoreStub.upsert.firstCall.args[0] as Array<{ key: entity.Key, data: Array<{ name: string, value: unknown }> }>;
        assert.strictEqual(upsertedEntities.length, 1);

        const matchEntity = upsertedEntities[0];
        assert.deepStrictEqual(matchEntity.key, matchKey);
        assert.deepStrictEqual(matchEntity.data, [
            {name: 'startTimestamp', value: '2026-06-14T20:00:00.000Z'},
            {name: 'competitionName', value: 'World cup'},
            {name: 'competitionId', value: '2000'},
            {name: 'homeTeamName', value: 'Netherlands'},
            {name: 'homeTeamID', value: 8601},
            {name: 'awayTeamName', value: 'Japan'},
            {name: 'awayTeamID', value: 766},
            {name: 'score', value: {home: 2, away: 2}},
            {name: 'finished', value: true},
        ]);
    })

    // TODO: Figure out what to do with extra time.
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
