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
import intl from 'react-intl-universal';
import IconButton from "@material-ui/core/IconButton";
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import PropTypes from 'prop-types';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";

const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: 0,
    },
    languageSelector: {
        paddingRight: 0
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
};

class BlindPoolNavbar extends Component {
    constructor(props) {
        super(props);
        // I have no fucking clue what the anchorEI is doing. But it probably has something to do with the menu.
        // Just copy pasted it from: https://material-ui.com/demos/menus/
        this.state = {
            languageAnchorEl: null,
            menuOpen: false,
            currentPageTitleKeyFunction: this.props.currentPageTitleKeyFunction,
            classes: PropTypes.object.isRequired,
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

    // Probably should replace
    selectLanguage(lang) {
        let lastTwoCharacters = BlindPoolNavbar.getLangFromLanguageAndCountryNotation(lang);

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
            let lastTwoCharacters = BlindPoolNavbar.getLangFromLanguageAndCountryNotation(this.props.currentLang);
            return (
                <FlagIcon code={lastTwoCharacters} size="lg"/>
            );
        } else {
            return <FlagIcon code="gb" size="lg"/>
        }
    }

    render() {
        const {languageAnchorEl} = this.state;
        const {classes} = this.props;
        const menuDrawer = (
            <div className={classes.list}>
                <AppBar color="primary" position="static">
                    <Toolbar className={this.props.classes.toolBar}>
                        <IconButton className={this.props.classes.menuButton} color="inherit"
                                    aria-label="Navigation menu" aria-owns={undefined} aria-haspopup="true"
                                    onClick={this.toggleDrawer("menuOpen", false)}>
                            <MenuIcon/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <List>
                    <ListItem button>
                        {/*<Link onClick={() => this.closeMenu()} to="/">Home</Link>*/}
                        <ListItemText primary={intl.get("CREATE_POOL")}/>
                    </ListItem>
                    <ListItem button>
                        {/*<Link onClick={() => this.closeMenu()} to="/">Home</Link>*/}
                        <ListItemText primary={intl.get("WHAT_IS_A_BLINDPOOL")}/>
                    </ListItem>
                </List>
            </div>
        );
        /* https://material-ui.com/demos/app-bar/ */
        return (
            <div>
                <AppBar color="primary" position="static">
                    <Toolbar className={this.props.classes.toolBar}>
                        <IconButton className={this.props.classes.menuButton} color="inherit"
                                    aria-label="Navigation menu" aria-owns={undefined} aria-haspopup="true"
                                    onClick={this.toggleDrawer("menuOpen", true)}>
                            <MenuIcon/>
                        </IconButton>
                        <SwipeableDrawer open={this.state.menuOpen}
                                         onClose={this.toggleDrawer('menuOpen', false)}
                                         onOpen={this.toggleDrawer('menuOpen', true)}>
                            {menuDrawer}
                        </SwipeableDrawer>
                        <Typography variant="h1" color="inherit" className={this.props.classes.grow}>
                            <b>{this.state.currentPageTitleKeyFunction()}</b>
                        </Typography>
                        <Button className={this.props.classes.languageSelector} aria-label="Language menu"
                                aria-owns={languageAnchorEl ? 'language-menu' : undefined} aria-haspopup="true"
                                onClick={this.openLanguageSelect}>
                            {this.currentFlag()}
                            <Icon color="secondary">arrow_drop_down</Icon>
                        </Button>
                        <Menu id="language-menu" anchorEl={languageAnchorEl} open={Boolean(languageAnchorEl)}
                              onClose={this.closeLanguageSelect}>
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

export default withStyles(styles)(BlindPoolNavbar);
