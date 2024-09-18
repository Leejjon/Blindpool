import React, {useState} from "react";
import {AppBar, Button, IconButton, Menu, MenuItem, SwipeableDrawer, Toolbar, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import BpMenu from "../bpmenu/BpMenu";
import StyledBpLogoFn from "../bplogo/BpLogo";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ReactCountryFlag from "react-country-flag";
import { Link } from "@remix-run/react";

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

const BpAppBar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const currentFlag = () => {
        if (window.location.hostname === "www.blindepool.nl" ||
            window.location.hostname === "blindepool.nl") {
            return <ReactCountryFlag countryCode="NL" style={{fontSize: '2.2em'}}/>
        } else {
            return <ReactCountryFlag countryCode="GB" style={{fontSize: '2.2em'}}/>
        }
    };

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
                    <BpMenu closeMenu={() => setMenuOpen(false)}/>
                </SwipeableDrawer>
                <Typography component={Link} to="/" sx={grow} variant="h1" color="inherit">
                    <StyledBpLogoFn/>
                </Typography>
                <Button aria-label="Language menu"
                        aria-owns={anchorEl ? 'language-menu' : undefined} aria-haspopup="true"
                        onClick={handleClick} sx={languageMenu}>
                    {currentFlag()}
                    <ArrowDropDownIcon sx={dropDown}/>
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

export default BpAppBar;
