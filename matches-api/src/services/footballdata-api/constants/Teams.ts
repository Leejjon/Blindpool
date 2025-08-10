import {competitions} from "blindpool-common/constants/Competitions";

export const API_FOOTBAL_DATA_URL = "https://api.football-data.org/v4";

export const getTeamName = (teamId: number, competitionId: string): string => {
    let teamName;

    for (const key in competitions) {
        if (key === competitionId) {
            let competition = competitions[key];
            teamName = competition.teams[teamId];
            break;
        }
    }

    return teamName ? teamName : 'Unknown team';
};
