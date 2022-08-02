import {Checkbox, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography} from "@mui/material";
import {competitions, getCompetitionsList} from "../../constants/Competitions";
import appState from "../../state/AppState";
import React from "react";

const BpUpcomingMatches = () => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, competition: number) => {
        if (!event.target.checked) {
            appState.setLeaguePreferences(appState.leaguePreferences.filter((key) => key == competition));
        } else {
            const newLeaguePreferences: Array<number> = Object.assign([], appState.leaguePreferences);
            newLeaguePreferences.push(competition);
            appState.setLeaguePreferences(newLeaguePreferences);
        }
    }

    return (
        <List sx={{padding: "0", paddingTop: "0.5em"}} >
            {getCompetitionsList().map((key: number) => {
                const competition = competitions[key];
                const labelId = `competition-label-${key}`;
                return (
                    <ListItem sx={{margin: "0", padding: "0"}} key={key}>
                        <ListItemButton id={labelId} sx={{margin: "0", padding: "0", marginTop: "0.3em"}}>
                            <Checkbox sx={{marginLeft: "0.5em"}} edge="start" onChange={(event) => handleChange(event, key)}
                                      defaultChecked={appState.leaguePreferences.includes(key)} disableRipple color="secondary" />
                            <Typography variant="body1">{competition.name}</Typography>
                        </ListItemButton>
                    </ListItem>
                )
            })}
        </List>
    )
};

export default BpUpcomingMatches;
