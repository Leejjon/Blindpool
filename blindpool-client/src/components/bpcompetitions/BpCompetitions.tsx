import {Checkbox, FormControlLabel, List, ListItem, ListItemButton} from "@mui/material";
import {allCompetitions, getCompetitionsList} from "../../constants/Competitions";
import React from "react";
import {useCompetitionsAndMessagesContext} from "../../App";

const BpUpcomingMatches = () => {
    const {competitions, setCompetitions} = useCompetitionsAndMessagesContext();
    const listOfCompetitions = getCompetitionsList();

    // Sanitizing competitions like the world cup, that somehow seemed to stay in the query after removing it from the getCompetitionList().
    function filterDisabledCompetitions(competitions: Array<number>) {
        return competitions.filter((key) => getCompetitionsList().includes(key));
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, competition: number) => {
        if (!event.target.checked) {
            setCompetitions(filterDisabledCompetitions(competitions.filter((key) => key.toString() !== competition.toString())));
        } else {
            const newLeaguePreferences: Array<number> = Object.assign([], competitions);
            newLeaguePreferences.push(competition);
            setCompetitions(filterDisabledCompetitions(newLeaguePreferences));
        }
    }

    return (
        <List sx={{padding: "0", paddingTop: "0.5em"}} >
            {listOfCompetitions.map((key: number) => {
                const competition = allCompetitions[key];
                const labelId = `competition-label-${key}`;
                return (
                    <ListItem sx={{margin: "0", padding: "0"}} key={key}>
                        <ListItemButton id={labelId} sx={{margin: "0", padding: "0", marginTop: "0.3em"}}>
                            <FormControlLabel label={competition.name} control={
                                <Checkbox sx={{marginLeft: "0.5em"}} onChange={(event) => handleChange(event, key)}
                                  checked={competitions.includes(key)} disableRipple color="secondary" />
                            }/>
                        </ListItemButton>
                    </ListItem>
                )
            })}
        </List>
    )
};

export default BpUpcomingMatches;
