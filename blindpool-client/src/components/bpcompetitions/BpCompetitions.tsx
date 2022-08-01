import {Checkbox, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {competitions, getCompetitionsList} from "../../constants/Competitions";
import {defaultCompetitions} from "../../locales/i18n";
import {getHostnameWithPortIfLocal} from "../../utils/Network";


const BpUpcomingMatches = () => {
    return (
        <List sx={{padding: "0"}} >
            {getCompetitionsList().map((key: number) => {
                const competition = competitions[key];
                const labelId = `competition-label-${key}`;
                `${window.location.protocol}//${getHostnameWithPortIfLocal()}/clubicons/${}.svg`;
                return (
                    <ListItem sx={{margin: "0", padding: "0"}} key={key}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Checkbox edge="start" defaultChecked={defaultCompetitions.includes(key)} disableRipple color="secondary" />
                            </ListItemIcon>
                            <ListItemIcon>

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
