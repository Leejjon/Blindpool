import {Checkbox, FormControlLabel, List, ListItem, ListItemButton, Typography} from "@mui/material";
import {competitions, getCompetitionsList} from "../../constants/Competitions";
import React from "react";
import {BpCompetitionProps} from "../../App";

const BpUpcomingMatches: React.FC<BpCompetitionProps> = ({competitionsToWatch, setCompetitionsToWatch}) => {
    const listOfCompetitions = getCompetitionsList();
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, competition: number) => {
        if (!event.target.checked) {
            setCompetitionsToWatch(competitionsToWatch.filter((key) => key.toString() !== competition.toString()));
        } else {
            const newLeaguePreferences: Array<number> = Object.assign([], competitionsToWatch);
            newLeaguePreferences.push(competition);
            setCompetitionsToWatch(newLeaguePreferences);
        }
    }

    return (
        <List sx={{padding: "0", paddingTop: "0.5em"}} >
            {listOfCompetitions.map((key: number) => {
                const competition = competitions[key];
                const labelId = `competition-label-${key}`;
                return (
                    <ListItem sx={{margin: "0", padding: "0"}} key={key}>
                        <ListItemButton id={labelId} sx={{margin: "0", padding: "0", marginTop: "0.3em"}}>
                            <FormControlLabel label={competition.name} control={
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
