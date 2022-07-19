import {getMatchesFromFootballDataApi} from "./FootballDataApiService";

describe('FootballDataApiService', () => {
    it('getMatchesFromFootballDataApi', async () => {
        let result = await getMatchesFromFootballDataApi();
        result.map(
            matches => console.log(matches.length)
        ).mapErr(
            e => console.log(e)
        );
    });
});
