import React, {useState} from "react";
import {AppBar, Button, IconButton, Menu, MenuItem, SwipeableDrawer, Toolbar, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import BpMenu from "../bpmenu/BpMenu";
import {Link} from "react-router-dom";
import StyledBpLogoFn from "../bplogo/BpLogo";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ReactCountryFlag from "react-country-flag";
import "./BpAppBar.css";

const BpAppBar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const currentFlag = () => {
        if (window.location.hostname === "www.blindepool.nl" ||
            window.location.hostname === "blindepool.nl") {
            return <ReactCountryFlag countryCode="GB" style={{fontSize: '2.2em'}}/>
        } else {
            return <ReactCountryFlag countryCode="NL" style={{fontSize: '2.2em'}}/>
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
                <IconButton sx={{marginLeft: '0.8em'}}
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
                <Typography component={Link} to="/" sx={{
                    flexGrow: 1,
                    fontSize: "1.1rem",
                    lineHeight: 1.4,
                    letterSpacing: "0.0075em",
                }} variant="h1" color="inherit">
                    <StyledBpLogoFn/>
                </Typography>
                <Button aria-label="Language menu"
                        aria-owns={anchorEl ? 'language-menu' : undefined} aria-haspopup="true"
                        onClick={handleClick} sx={{paddingBottom: '0px', paddingTop: '0.2em'}}>
                    {currentFlag()}
                    <ArrowDropDownIcon sx={{color: "black", paddingBottom: "0.2em", paddingLeft: "0.2em"}}/>
                </Button>
                <Menu id="language-menu" anchorEl={anchorEl} open={Boolean(anchorEl)}
                      onClose={handleClose}>
                    <a title="Blindpool" className="languageUrl" href="https://www.blindpool.com/">
                        <MenuItem component="li">
                            <ReactCountryFlag countryCode="GB" style={{fontSize: '2em', paddingTop: '0.1em'}}/>&nbsp;&nbsp;English
                        </MenuItem>
                    </a>
                    <a title="Blindepool" className="languageUrl" href="https://www.blindepool.nl/">
                        <MenuItem component="li">
                            <ReactCountryFlag countryCode="NL" style={{fontSize: '2em', paddingTop: '0.1em'}}/>&nbsp;&nbsp;Nederlands
                        </MenuItem>
                    </a>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

export default BpAppBar;
