import {Api, getHost} from "../utils/Network";
import {type Match} from "../model/Match";

export async function getMatchResultData(matchId: string | undefined) {
    if (matchId) {
        const response = await fetch(`${getHost(Api.matches)}/api/v2/matches/${matchId}`)
        if (response.status === 200) {
            const matchResult: Match = await response.json();
            return matchResult;
        } else {
            // TODO: See if promise.reject is better.
            return undefined;
        }
    } else {
        return undefined;
    }
}
