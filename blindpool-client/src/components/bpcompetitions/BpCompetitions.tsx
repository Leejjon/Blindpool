import {Checkbox, FormControlLabel, List, ListItem, ListItemButton} from "@mui/material";
import React from "react";
import {competitions, getCompetitionsList} from "blindpool-common/constants/Competitions";
import {useExistingBlindpoolOutletContext} from "../../context/BpContext";

const BpUpcomingMatches: React.FC = () => {
    const {competitionsToWatch, setCompetitionsToWatch} = useExistingBlindpoolOutletContext();
    const listOfCompetitions= getCompetitionsList();

    // Sanitizing competitions like the world cup, that somehow seemed to stay in the query after removing it from the getCompetitionList().
    function filterDisabledCompetitions(competitions: Array<number>) {
        return competitions.filter((key) => getCompetitionsList().includes(key));
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, competition: number) => {
        if (!event.target.checked) {
            setCompetitionsToWatch?.(filterDisabledCompetitions(competitionsToWatch.filter((key) => key.toString() !== competition.toString())));
        } else {
            const newLeaguePreferences: Array<number> = Object.assign([], competitionsToWatch);
            newLeaguePreferences.push(competition);
            setCompetitionsToWatch?.(filterDisabledCompetitions(newLeaguePreferences));
        }
    }

    return (
        <List sx={{padding: "0", paddingTop: "0.5em"}} >
            {listOfCompetitions.map((key: number) => {
                const competition = competitions[key];
                const labelId = `competition-label-${key}`;

                let label: String = competition.competition;
                // if (competition.competition === "European Cup" && window.location.hostname.endsWith('blindepool.nl')) {
                //     label = "EK 2024"
                // }

                return (
                    <ListItem sx={{margin: "0", padding: "0"}} key={key}>
                        <ListItemButton id={labelId} sx={{margin: "0", padding: "0", marginTop: "0.3em"}}>
                            <FormControlLabel label={label} control={
                                <Checkbox sx={{marginLeft: "0.5em"}} onChange={(event) => handleChange(event, key)}
                                          checked={competitionsToWatch.includes(key)} disableRipple color="secondary" />

                            }/>
                        </ListItemButton>
                    </ListItem>
                )
            })}
        </List>
    )
};

export default BpUpcomingMatches;
