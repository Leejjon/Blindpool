import { AppBar, IconButton, Menu, MenuItem, Toolbar, SwipeableDrawer, Typography, Button } from "@mui/material";
import {ReactCountryFlag} from "react-country-flag";
import {ArrowDropDown, Menu as MenuIcon} from '@mui/icons-material';
import { Link } from "@remix-run/react";
import BpLogo from "../bplogo/BpLogo";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";

const grow = {
    flexGrow: 1,
}

const menuButton = {
    marginLeft: '0.5em', marginRight: '0.5em',
}

const languageMenu = {
    paddingBottom: '0px', paddingTop: '0.2em'
}

const dropDown = {
    color: "white", paddingBottom: "0.15em", paddingLeft: "0.2em"
}

const languageUrl = {
    color: 'inherit',
    textDecoration: 'none'
}

const flagStyle = {
    fontSize: '2em', paddingTop: '0.1em'
}

type BpAppBarProps = {
    menuOpen: boolean,
    setMenuOpen: (menuOpen: boolean) => void,
    children: ReactNode
}

export default function Component({menuOpen, setMenuOpen, children}: BpAppBarProps /*{translations}: BpMenuTranslationsAsProps*/) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentFlag, setCurrentFlag] = useState<null | JSX.Element>(null);

    useEffect(() => {
        const dutchFlag = <ReactCountryFlag countryCode="NL" style={{fontSize: '2.2em'}}/>;
        const englishFlag = <ReactCountryFlag countryCode="GB" style={{fontSize: '2.2em'}}/>;
        if (window.location.hostname === "www.blindepool.nl" ||
            window.location.hostname === "blindepool.nl") {
            setCurrentFlag(dutchFlag);
        } else {
            setCurrentFlag(englishFlag);
        }
    }, [setCurrentFlag]);


    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            {/* sx doesn't work on toolbar. Also by default it has a minimal height of 64px, which we override */}
            <Toolbar style={{paddingLeft: '0px', paddingRight: '0px', minHeight: '2.9em'}}>
                <IconButton sx={menuButton}
                            color="inherit"
                            aria-label="Navigation menu" aria-haspopup="true"
                            onClick={() => setMenuOpen(true)}>
                    <MenuIcon />
                </IconButton>
                <SwipeableDrawer open={menuOpen}
                                 onClose={() => setMenuOpen(false)}
                                 onOpen={() => setMenuOpen(true)}>
                    {children}
                </SwipeableDrawer>
                <Typography component={Link} to="/" sx={grow} variant="h1" color="inherit">
                    <BpLogo/>
                </Typography>
                <Button aria-label="Language menu"
                        aria-owns={anchorEl ? 'language-menu' : undefined} aria-haspopup="true"
                        onClick={handleClick} sx={languageMenu}>
                    {currentFlag}
                    <ArrowDropDown sx={dropDown}/>
                </Button>
                <Menu id="language-menu" anchorEl={anchorEl} open={Boolean(anchorEl)}
                      onClose={handleClose}>
                    <a title="Blindpool" style={languageUrl} href="https://www.blindpool.com/">
                        <MenuItem component="li">
                            <ReactCountryFlag countryCode="GB" style={flagStyle}/>&nbsp;&nbsp;English
                        </MenuItem>
                    </a>
                    <a title="Blindepool" style={languageUrl} href="https://www.blindepool.nl/">
                        <MenuItem component="li">
                            <ReactCountryFlag countryCode="NL" style={flagStyle}/>&nbsp;&nbsp;Nederlands
                        </MenuItem>
                    </a>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}