import {Checkbox, FormControlLabel, List, ListItem, ListItemButton} from "@mui/material";
import React from "react";
import {BpCompetitionProps} from "../../App";
import {competitions, getCompetitionsList} from "blindpool-common/constants/Competitions";

const BpUpcomingMatches: React.FC<BpCompetitionProps> = ({competitionsToWatch, setCompetitionsToWatch}) => {
    const listOfCompetitions= [2018];//getCompetitionsList();

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

                let label: String;
                if (competition.competition === "European Cup" && window.location.hostname.endsWith('blindepool.nl')) {
                    label = "EK 2024"
                } else {
                    label = competition.competition;
                }

                return (
                    <ListItem sx={{margin: "0", padding: "0"}} key={key}>
                        <ListItemButton id={labelId} sx={{margin: "0", padding: "0", marginTop: "0.3em"}}>
                            <FormControlLabel disabled={true} label={label} control={
                                <Checkbox sx={{marginLeft: "0.5em"}} onChange={(event) => handleChange(event, key)}
                                   checked={true} disableRipple color="secondary" />
                                // checked={competitionsToWatch.includes(key)}
                            }/>
                        </ListItemButton>
                    </ListItem>
                )
            })}
        </List>
    )
};

export default BpUpcomingMatches;
