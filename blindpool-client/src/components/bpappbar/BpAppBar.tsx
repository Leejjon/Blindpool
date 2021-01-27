import React, {useState} from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from "@material-ui/core/Toolbar";
import Menu from "@material-ui/core/Menu/Menu";
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from '@material-ui/core/Icon';
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from '@material-ui/styles';
import FlagIcon from "../../locales/FlagIcon";
import {Button, SwipeableDrawer, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import BpMenu from "../bpmenu/BpMenu";

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    grow: {
        // align: "left",
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: '0.5em',
        marginRight: '0.5em',
    },
    logoImage: {
        width: "150px",
        height: "24px",
        marginTop: "0.5em",
        // marginBottom: "0.8em"
    },
    toolBar: {
        marginRight: 0,
        paddingRight: 0
    },
    pageHeader: {
        marginTop: "0.5em"
    },
    dropDown: {
        color: 'white'
    },
    languageUrl: {
        color: 'inherit',
        textDecoration: 'none'
    }
});

const BpAppBar: React.FC = () => {
    const classes = useStyles();

    const [menuOpen, setMenuOpen] = useState(false);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const currentFlag = () => {
        if (window.location.hostname === "www.blindepool.nl" ||
            window.location.hostname === "blindepool.nl") {
            return <FlagIcon code="nl" size="lg"/>
        } else {
            return <FlagIcon code="gb" size="lg"/>
        }
    };

    return (
        <div>
            <AppBar color="primary" position="static" style={{marginRight: 0, paddingRight: 0}}>
                <Toolbar className={classes.toolBar}>
                    <IconButton className={classes.menuButton} color="inherit"
                                aria-label="Navigation menu" aria-haspopup="true"
                                onClick={() => setMenuOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                    <SwipeableDrawer open={menuOpen}
                                     onClose={() => setMenuOpen(false)}
                                     onOpen={() => setMenuOpen(true)}>
                        <BpMenu closeMenu={() => setMenuOpen(false)}/>
                    </SwipeableDrawer>
                    <Typography component={Link} to="/" className={classes.grow} variant="h1" color="inherit">
                        <img alt="BLINDPOOL" className={classes.logoImage} src={"/icons/logosmall.png"}/>
                    </Typography>
                    <Button aria-label="Language menu"
                            aria-owns={anchorEl ? 'language-menu' : undefined} aria-haspopup="true"
                            onClick={handleClick}>
                        {currentFlag()}
                        <Icon className={classes.dropDown}>arrow_drop_down</Icon>
                    </Button>
                    <Menu id="language-menu" anchorEl={anchorEl} open={Boolean(anchorEl)}
                          onClose={handleClose}>
                        <a title="Blindpool" className={classes.languageUrl} href="https://www.blindpool.com/">
                            <MenuItem component="li" button>
                                <FlagIcon code="gb" size="lg"/>&nbsp;&nbsp;English
                            </MenuItem>
                        </a>
                        <a title="Blindepool" className={classes.languageUrl} href="https://www.blindepool.nl/">
                            <MenuItem component="li" button>
                                <FlagIcon code="nl" size="lg"/>&nbsp;&nbsp;Nederlands
                            </MenuItem>
                        </a>
                    </Menu>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default BpAppBar;
