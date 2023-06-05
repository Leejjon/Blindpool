import {upsertMatches} from "./MatchService";
import * as sinon from "sinon";
import {FootballDataApiMatch, MatchWithCompetitionIncluded} from "./footballdata-api/FootballDataApiService";
import {Datastore} from "@google-cloud/datastore/build/src";
import * as DatastoreService from "./DatastoreService";
import {entity} from "@google-cloud/datastore/build/src/entity";

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
            "homeTeam": 0,
            "awayTeam": 3
        },
        "halfTime": {
            "homeTeam": 0,
            "awayTeam": 0
        },
        "extraTime": {
            "homeTeam": null,
            "awayTeam": null
        },
        "penalties": {
            "homeTeam": null,
            "awayTeam": null
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
            "homeTeam": null,
            "awayTeam": null
        },
        "halfTime": {
            "homeTeam": null,
            "awayTeam": null
        },
        "extraTime": {
            "homeTeam": null,
            "awayTeam": null
        },
        "penalties": {
            "homeTeam": null,
            "awayTeam": null
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
