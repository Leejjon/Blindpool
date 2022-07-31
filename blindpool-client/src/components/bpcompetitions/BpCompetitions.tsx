import {Checkbox, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {competitions, getCompetitionsList} from "../../constants/Competitions";
import {defaultCompetitions} from "../../locales/i18n";


const BpUpcomingMatches = () => {
    return (
        <List sx={{padding: "0"}} >
            {getCompetitionsList().map((key: number) => {
                const competition = competitions[key];
                const labelId = `competition-label-${key}`;
                return (
                    <ListItem sx={{margin: "0", padding: "0"}} key={key}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Checkbox edge="start" defaultChecked={defaultCompetitions.includes(key)} disableRipple color="secondary" />
                            </ListItemIcon>
                            <ListItemText id={labelId}>
                                {competition.name}
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                )
            })}
        </List>
    )
};

export default BpUpcomingMatches;
