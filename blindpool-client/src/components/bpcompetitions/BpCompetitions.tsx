import {Checkbox, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography} from "@mui/material";
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
                let isIncluded = false;
                competitionsToWatch.forEach((competition) => {
                    // Typescript is broken.
                    console.log(`${competition} ${key} ${competition === key}`)
                    if (competition.toString() === key.toString()) {
                        isIncluded = true;
                    }
                });
                const competition = competitions[key];
                const labelId = `competition-label-${key}`;
                return (
                    <ListItem sx={{margin: "0", padding: "0"}} key={key}>
                        <ListItemButton id={labelId} sx={{margin: "0", padding: "0", marginTop: "0.3em"}}>
                            <Checkbox sx={{marginLeft: "0.5em"}} edge="start" onChange={(event) => handleChange(event, key)}
                                      checked={isIncluded} disableRipple color="secondary" />
                            <Typography variant="body1">{competition.name}</Typography>
                        </ListItemButton>
                    </ListItem>
                )
            })}
        </List>
    )
};

export default BpUpcomingMatches;
