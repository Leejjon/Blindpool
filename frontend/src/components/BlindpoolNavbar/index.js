import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Grid from "@material-ui/core/Grid/Grid";
import Menu from "@material-ui/core/Menu/Menu";
import FlagIcon from "../../locales/FlagIcon";

class BlindPoolNavbar extends Component {
    // I have no fucking clue what the anchorEI is doing. But it probably has something to do with the menu.
    // Just copy pasted it from: https://material-ui.com/demos/menus/
    state = {
        anchorEl: null,
        currentLang: 'gb'
    };

    openLanguageSelect = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    closeLanguageSelect = () => {
        this.setState({ anchorEl: null });
        console.log("Clicked outside of the menu and thus closed language select.");
    };

    // Probably should replace
    selectLanguage(lang) {
        let lastTwoCharacters = lang.substr(lang.length - 2).toLowerCase();

        if (lastTwoCharacters === 'us') {
            // Nobody in the US watches football, so let's show the GB flag instead.
            lastTwoCharacters = 'gb';
        }

        this.setState({ anchorEl: null, currentLang: lastTwoCharacters});
        console.log(lastTwoCharacters);
        this.props.setLanguage(lang);
    };

    currentFlag() {
        if (this.state.currentLang !== null) {
            return <FlagIcon code={this.state.currentLang} size="lg" />
        } else {
            return <FlagIcon code="gb" size="lg"/>
        }
    }

    render() {
        const { anchorEl } = this.state;
        return (
            <AppBar color="primary">
                {/* I suppose you put stuff in grids and then give grids positions instead of positioning separate buttons. Makes sense I guess. */}
                <Grid
                    justify="flex-end"
                    container
                    spacing={24}>
                    <Grid item>
                        {/*<Typography>{intl.get('TITLE')}</Typography>*/}
                    </Grid>
                    <Grid item>
                        <Button aria-owns={anchorEl ? 'simple-menu' : undefined}
                                aria-haspopup="true"
                                onClick={this.openLanguageSelect}>
                            {this.currentFlag()}
                            <Icon color="secondary">arrow_drop_down</Icon>
                        </Button>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={this.closeLanguageSelect}>
                            <MenuItem onClick={this.selectLanguage.bind(this, 'en-US')}><FlagIcon code="gb" size="lg"/>&nbsp;&nbsp;English</MenuItem>
                            <MenuItem onClick={this.selectLanguage.bind(this, 'nl-NL')}><FlagIcon code="nl" size="lg"/>&nbsp;&nbsp;Nederlands</MenuItem>
                        </Menu>
                    </Grid>
                </Grid>
            </AppBar>
        );
    }
}

export default BlindPoolNavbar;
