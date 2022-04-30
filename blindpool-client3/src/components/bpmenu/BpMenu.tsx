import React from "react";
import {useTranslation} from "react-i18next";
import {
    AppBar,
    IconButton,
    List,
    ListItem, ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {Link} from "react-router-dom";
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import StyledBpLogoFn from "../bplogo/BpLogo";
import HelpIcon from '@mui/icons-material/Help';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import "./BpMenu.css"

interface BpMenuProps {
    closeMenu: () => void
}

const BpMenu: React.FC<BpMenuProps> = ({closeMenu}) => {
    const { t } = useTranslation();
    return (
        <div className="BpMenu">
            <AppBar color="primary" position="static" onClick={closeMenu} sx={{width: 250}}>
                <Toolbar>
                    <IconButton sx={{marginRight: '0.4em', padding: '0.2em', marginLeft: '0em'}}
                                color="inherit" aria-label="Navigation menu" aria-haspopup="true">
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="body1" color="inherit" sx={{flexGrow: 1}} className="{classes.grow}">
                        <StyledBpLogoFn/>
                    </Typography>
                </Toolbar>
            </AppBar>
            <List component="ul">
                <ListItem component={props => <Link {... props} to="/create" />} onClick={closeMenu} className="linkWithoutDecoration">
                    {/*Somehow the ListItemButton can't have a className*/}
                    <ListItemButton sx={{padding: 0}}>
                        <ListItemIcon className="negativeLinkPadding">
                            <AddCircleIcon fontSize="large" sx={{color: '#00cc47'}}/>
                        </ListItemIcon>
                        <ListItemText className="linktext">
                            {t("CREATE_POOL")}
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <ListItem component={Link} onClick={closeMenu} to="/howto" className="linkWithoutDecoration">
                    <ListItemButton sx={{padding: 0}}>
                        <ListItemIcon className="negativeLinkPadding">
                            <HelpIcon fontSize="large" />
                        </ListItemIcon>
                        <ListItemText className="linktext">
                            {t("HOW_DOES_IT_WORK_TITLE")}
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <ListItem component={Link} onClick={closeMenu} to="/about" className="linkWithoutDecoration">
                    <ListItemButton sx={{padding: 0}}>
                        <ListItemIcon className="negativeLinkPadding">
                            <SupervisedUserCircleIcon fontSize="large"/>
                        </ListItemIcon>
                        <ListItemText className="linktext">
                            {t('ABOUT_BLINDPOOL_TITLE')}
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
            </List>
            <List>
                <ListItem className="linkWithoutDecoration">
                    <ListItemButton sx={{padding: 0}}>
                        <ListItemText className="{classes.bottomLinks}">
                            <strong>{t('OTHER_APPS')}</strong>
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <ListItem className="linkWithoutDecoration">
                    <ListItemButton sx={{padding: 0}}>
                        <ListItemIcon className="otherAppsPadding">
                            <img src={"/icons/bluffpoker-icon.png"} alt="Bluff Poker Icon" />
                        </ListItemIcon>
                        <ListItemText className="linktext">
                            <a className="linkWithoutDecoration" href="https://bluffpoker.app" target="new">Bluff Poker</a>
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <ListItem className="linkWithoutDecoration">
                    <ListItemButton sx={{padding: 0}}>
                        <ListItemIcon className="otherAppsPadding">
                            <img src={"/icons/toffeeshare-icon.png"} alt="ToffeeShare Icon" />
                        </ListItemIcon>
                        <ListItemText className="linktext">
                            <a className="linkWithoutDecoration" href="https://toffeeshare.com" target="new">ToffeeShare</a>
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );
};

export default BpMenu;
