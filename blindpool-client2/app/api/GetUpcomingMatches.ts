import {Api, getHost} from "../utils/Network";
import {Match} from "../model/Match";

export const getUpcomingMatches = async (competitionsToWatch: Array<number>): Promise<Array<Match>> => {
    try {
        if (competitionsToWatch.length === 0) {
            return [];
        }
        let url = `${getHost(Api.matches)}/api/v2/matches/upcoming`;
        let separationChar = "?";
        for (let i = 0; i < competitionsToWatch.length; i++) {
            url += `${separationChar}competition[]=${competitionsToWatch[i]}`;
            separationChar = "&"
        }
        const response = await fetch(url);
        if (response.status === 200) {
            return await response.json();
        } else {
            throw new Error('BACKEND_OFFLINE');
        }
    } catch (e) {
        console.error(`Something went wrong with fetching upcoming matches`, e);
        throw new Error('BACKEND_UNREACHABLE');
    }
}
