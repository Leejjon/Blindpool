// import {useTranslation} from "react-i18next";
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
import {Menu as MenuIcon, SupervisedUserCircle, Help, AddCircle} from '@mui/icons-material';
import BpLogo from "../bplogo/BpLogo";
import "./BpMenu.css"
import { Link } from "@remix-run/react";
import { TranslationKey } from "../../locales/i18n";

interface BpMenuProps {
    closeMenu: () => void
}

type bpMenuTranslations = TranslationKey.CREATE_POOL | TranslationKey.HOW_DOES_IT_WORK_TITLE | TranslationKey.ABOUT_BLINDPOOL_TITLE | TranslationKey.OTHER_APPS;

export interface BpMenuTranslationsAsProps {
    translations: {[key in bpMenuTranslations]: string};
}

export default function Component({closeMenu, translations}: BpMenuProps & BpMenuTranslationsAsProps) {
    // const { t } = useTranslation();
    return (
        <div className="BpMenu">
            <AppBar color="primary" position="static" onClick={closeMenu}>
                <Toolbar style={{paddingLeft: '0px', paddingRight: '0px', minHeight: '2.9em'}}>
                    <IconButton  sx={{marginRight: '0.4em', marginLeft: '0.6em'}}
                                color="inherit" aria-label="Navigation menu" aria-haspopup="true">
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="body1" color="inherit" sx={{flexGrow: 1}}>
                        <BpLogo />
                    </Typography>
                </Toolbar>
            </AppBar>
            <List component="ul">
                <ListItem className="linkWithoutDecoration" disablePadding={true}>
                    {/*Somehow the ListItemButton can't have a className*/}
                    <ListItemButton component={Link} onClick={closeMenu} to="/create" sx={{padding: '4 16px 4'}}>
                        <ListItemIcon className="negativeLinkPadding">
                            <AddCircle fontSize="large" sx={{color: '#00cc47'}}/>
                        </ListItemIcon>
                        <ListItemText className="linktext">
                            {translations[TranslationKey.CREATE_POOL]}
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <ListItem className="linkWithoutDecoration" disablePadding={true}>
                    <ListItemButton component={Link} onClick={closeMenu} to="/howto" sx={{padding: '4 16px 4'}}>
                        <ListItemIcon className="negativeLinkPadding">
                            <Help fontSize="large" />
                        </ListItemIcon>
                        <ListItemText className="linktext">
                            {translations[TranslationKey.HOW_DOES_IT_WORK_TITLE]}
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <ListItem className="linkWithoutDecoration" disablePadding={true}>
                    <ListItemButton component={Link} onClick={closeMenu} to="/about"  sx={{padding: '4 16px 4'}}>
                        <ListItemIcon className="negativeLinkPadding">
                            <SupervisedUserCircle fontSize="large"/>
                        </ListItemIcon>
                        <ListItemText className="linktext">
                            {translations[TranslationKey.ABOUT_BLINDPOOL_TITLE]}
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
            </List>
            <List>
                <ListItem className="linkWithoutDecoration" disablePadding={true}>
                    <ListItemButton sx={{padding: '4 16px 4'}}>
                        <ListItemText>
                            <strong>{translations[TranslationKey.OTHER_APPS]}</strong>
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <ListItem className="linkWithoutDecoration" disablePadding={true}>
                    <ListItemButton sx={{padding: '4 16px 4'}}>
                        <ListItemIcon className="otherAppsPadding">
                            <img src={"/icons/bluffpoker-icon.png"} alt="Bluff Poker Icon" />
                        </ListItemIcon>
                        <ListItemText className="linktext">
                            <a className="linkWithoutDecoration" href="https://bluffpoker.app" target="new">Bluff Poker</a>
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <ListItem className="linkWithoutDecoration" disablePadding={true}>
                    <ListItemButton sx={{padding: '4 16px 4'}}>
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
}
