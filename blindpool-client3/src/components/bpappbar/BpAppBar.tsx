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
            // return <FlagIcon code="nl" size="lg"/>
            return <p>Hoi</p>
        } else {
            return <ReactCountryFlag countryCode="NL" style={{fontSize: '3em', paddingTop: '0.2em'}}/>
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
            {/* sx doesn't work on toolbar */}
            <Toolbar style={{paddingRight: '0px'}}>
                <IconButton sx={{marginLeft: '-0.4em'}}
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
                    flexGrow: 1, fontWeight: 500,
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                    letterSpacing: "0.0075em"
                }} variant="h1" color="inherit">
                    <StyledBpLogoFn/>
                </Typography>
                <Button aria-label="Language menu"
                        aria-owns={anchorEl ? 'language-menu' : undefined} aria-haspopup="true"
                        onClick={handleClick}>
                    {currentFlag()}
                    <ArrowDropDownIcon sx={{color: "black", paddingBottom: "0.25em", paddingLeft: "0.1em"}}/>
                </Button>
                <Menu id="language-menu" anchorEl={anchorEl} open={Boolean(anchorEl)}
                      onClose={handleClose}>
                    <a title="Blindpool" className="languageUrl" href="https://www.blindpool.com/">
                        <MenuItem component="li">
                            <ReactCountryFlag countryCode="GB" style={{fontSize: '3em', paddingTop: '0.2em'}}/>&nbsp;&nbsp;English
                        </MenuItem>
                    </a>
                    <a title="Blindepool" className="languageUrl" href="https://www.blindepool.nl/">
                        <MenuItem component="li">
                            <ReactCountryFlag countryCode="NL" style={{fontSize: '3em', paddingTop: '0.2em'}}/>&nbsp;&nbsp;Nederlands
                        </MenuItem>
                    </a>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

export default BpAppBar;
