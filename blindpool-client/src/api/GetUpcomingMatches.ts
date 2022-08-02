import {Api, getHost} from "../utils/Network";
import appState from "../state/AppState";
import {Match} from "../model/Match";

type setLoadingFunction = (loading: boolean) => void;
type setMessageFunction = (message: string | undefined) => void;
type setMatchesFunction = (matches: Array<Match>) => void;

// This is preventing the fetch call being in both BpUpcomingMatches.tsx and BpMatchSelector.tsx BUT
// It now has both the setLoading and setMatches logic still in.
// Normally I would fix this by using async/await and put that logic in the react components but the useEffect functions
// calling this function can't be async.
export const getUpcomingMatches = (setMessage: setMessageFunction, setLoading?: setLoadingFunction, setMatches?: setMatchesFunction) => {
    fetch(`${getHost(Api.matches)}/api/v2/matches/upcoming`)
        .then(async upcomingMatchesResponse => {
            if (upcomingMatchesResponse.status === 200) {
                let upcomingMatches = await upcomingMatchesResponse.json();
                appState.setUpcomingMatches(upcomingMatches);
                setMatches?.(upcomingMatches);
            } else {
                setMessage('BACKEND_OFFLINE');
            }
            setLoading?.(false);
        })
        .catch(result => {
            console.log(`Something went wrong with fetching upcoming matches ${result}`);
            setLoading?.(false);
            setMessage('BACKEND_UNREACHABLE');
        });
}
