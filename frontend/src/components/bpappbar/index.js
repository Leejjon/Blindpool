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

    closeMenu() {
        this.setState({menuOpen: false});
    }

    openLanguageSelect = event => {
        this.setState({languageAnchorEl: event.currentTarget});
    };

    closeLanguageSelect = () => {
        this.setState({languageAnchorEl: null});
        console.log("Clicked outside of the menu and thus closed language select.");
    };

    // Probably should replace
    selectLanguage(lang) {
        let lastTwoCharacters = BpAppBar.getLangFromLanguageAndCountryNotation(lang);

        this.setState({languageAnchorEl: null, currentLang: lastTwoCharacters});
        this.props.setLanguage(lang);
    };

    static getLangFromLanguageAndCountryNotation(langAndCountry) {
        let lastTwoCharacters = langAndCountry.substr(langAndCountry.length - 2).toLowerCase();

        if (lastTwoCharacters === 'us') {
            // Nobody in the US watches football, so let's show the GB flag instead.
            lastTwoCharacters = 'gb';
        }
        return lastTwoCharacters;
    }

    currentFlag() {
        if (this.props.currentLang !== null) {
            let lastTwoCharacters = BpAppBar.getLangFromLanguageAndCountryNotation(this.props.currentLang);
            return (
                <FlagIcon code={lastTwoCharacters} size="lg"/>
            );
        } else {
            return <FlagIcon code="gb" size="lg"/>
        }
    }

    render() {
        const {languageAnchorEl} = this.state;
        /* https://material-ui.com/demos/app-bar/ */
        return (
            <div>
                <AppBar color="primary" position="static" style={{marginRight: 0, paddingRight: 0}}>
                    <Toolbar className={this.props.classes.toolBar}>
                        <IconButton className={this.props.classes.menuButton} color="inherit"
                                    aria-label="Navigation menu" aria-haspopup="true"
                                    onClick={this.toggleDrawer("menuOpen", true)}>
                            <MenuIcon/>
                        </IconButton>
                        <SwipeableDrawer open={this.state.menuOpen}
                                         onClose={this.toggleDrawer('menuOpen', false)}
                                         onOpen={this.toggleDrawer('menuOpen', true)}>
                            <BpMenu closeMenu={() => this.closeMenu()} />
                        </SwipeableDrawer>
                        <Typography variant="h1" color="inherit" className={this.props.classes.grow}>
                            <img alt="BLINDPOOL" className={this.props.classes.logoImage} src={require("../../images/logo2.png")} />
                        </Typography>
                        <Button aria-label="Language menu"
                                aria-owns={languageAnchorEl ? 'language-menu' : undefined} aria-haspopup="true"
                                onClick={this.openLanguageSelect}>
                            {this.currentFlag()}
                            <Icon color="secondary">arrow_drop_down</Icon>
                        </Button>
                        <Menu id="language-menu" anchorEl={languageAnchorEl} open={Boolean(languageAnchorEl)}
                              onClose={this.closeLanguageSelect}>
                            {/* Do something to make sure the current language is selected, and not always the top one. */}
                            <MenuItem onClick={this.selectLanguage.bind(this, 'en-US')}>
                                <FlagIcon code="gb" size="lg"/>&nbsp;&nbsp;English
                            </MenuItem>
                            <MenuItem onClick={this.selectLanguage.bind(this, 'nl-NL')}>
                                <FlagIcon code="nl" size="lg"/>&nbsp;&nbsp;Nederlands
                            </MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles)(BpAppBar);
