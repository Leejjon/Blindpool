import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Menu from "@material-ui/core/Menu/Menu";
import MenuIcon from '@material-ui/icons/Menu';
import FlagIcon from "../../locales/FlagIcon";
import Toolbar from "@material-ui/core/Toolbar";
import {withStyles} from '@material-ui/core/styles';
import IconButton from "@material-ui/core/IconButton";
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import BpMenu from "../bpmenu";
import {Link} from "react-router-dom";

const styles = {
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
};

class BpAppBar extends Component {
    constructor(props) {
        super(props);
        // I have no fucking clue what the anchorEI is doing. But it probably has something to do with the menu.
        // Just copy pasted it from: https://material-ui.com/demos/menus/
        this.state = {
            languageAnchorEl: null,
            menuOpen: false,
        };
    }

    toggleDrawer = (side, open) => () => {
        this.setState({
            [side]: open,
        });
    };

    openLanguageSelect = event => {
        this.setState({languageAnchorEl: event.currentTarget});
    };

    closeLanguageSelect = () => {
        this.setState({languageAnchorEl: null});
        console.log("Clicked outside of the menu and thus closed language select.");
    };

    currentFlag() {
        if (window.location.hostname === "www.blindepool.nl" ||
            window.location.hostname === "blindepool.nl") {
            return <FlagIcon code="nl" size="lg"/>
        } else {
            return <FlagIcon code="gb" size="lg"/>
        }
    }

    render() {
        const {languageAnchorEl} = this.state;
        const classes = this.props.classes;
        /* https://material-ui.com/demos/app-bar/ */
        return (
            <div>
                <AppBar color="primary" position="static" style={{marginRight: 0, paddingRight: 0}}>
                    <Toolbar className={classes.toolBar}>
                        <IconButton className={classes.menuButton} color="inherit"
                                    aria-label="Navigation menu" aria-haspopup="true"
                                    onClick={this.toggleDrawer("menuOpen", true)}>
                            <MenuIcon/>
                        </IconButton>
                        <SwipeableDrawer open={this.state.menuOpen}
                                         onClose={this.toggleDrawer('menuOpen', false)}
                                         onOpen={this.toggleDrawer('menuOpen', true)}>
                            <BpMenu closeMenu={this.toggleDrawer('menuOpen', false)}/>
                        </SwipeableDrawer>
                        <Typography component={Link} to="/" className={classes.grow} variant="h1" color="inherit">
                            <img alt="BLINDPOOL" className={classes.logoImage} src={require("../../images/logosmall.png")}/>
                        </Typography>
                        <Button aria-label="Language menu"
                                aria-owns={languageAnchorEl ? 'language-menu' : undefined} aria-haspopup="true"
                                onClick={this.openLanguageSelect}>
                            {this.currentFlag()}
                            <Icon className={classes.dropDown}>arrow_drop_down</Icon>
                        </Button>
                        <Menu id="language-menu" anchorEl={languageAnchorEl} open={Boolean(languageAnchorEl)}
                              onClose={this.closeLanguageSelect}>
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
    }
}

export default withStyles(styles)(BpAppBar);
