import {Api, getHost} from "../utils/Network";
import {Match} from "../model/Match";

export type setMessageFunction = (message: string | undefined) => void;

// This is preventing the fetch call being in both BpUpcomingMatches.tsx and BpMatchSelector.tsx BUT
// It now has both the setLoading and setMatches logic still in.
// Normally I would fix this by using async/await and put that logic in the react components but the useEffect functions
// calling this function can't be async.
export const getUpcomingMatches = async (setMessage: setMessageFunction, competitionsToWatch: Array<number>): Promise<Array<Match>> => {
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
        console.log(url);
        const response = await fetch(url);
        if (response.status === 200) {
            return await response.json();
        } else {
            setMessage('BACKEND_OFFLINE');
            return [];
        }
    } catch (e) {
        console.error(`Something went wrong with fetching upcoming matches ${e}`);
        setMessage('BACKEND_UNREACHABLE')
        return [];
    }
}
