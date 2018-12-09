import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Grid from "@material-ui/core/Grid/Grid";
import Menu from "@material-ui/core/Menu/Menu";
import intl from "react-intl-universal";
import FlagIcon from "../../locales/FlagIcon";

class BlindPoolNavbar extends Component {
    // I have no fucking clue what the anchorEI is doing. But it probably has something to do with the menu.
    // Just copy pasted it from: https://material-ui.com/demos/menus/
    state = {
        anchorEl: null,
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
        this.setState({ anchorEl: null, languageCode: lang});
        this.props.setLanguage(lang);
    };

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
                        <Button aria-owns={anchorEl ? 'simple-menu' : undefined}
                                aria-haspopup="true"
                                onClick={this.openLanguageSelect}>
                            <FlagIcon code="nl" size="lg" />
                            <Icon color="secondary">arrow_drop_down</Icon>
                        </Button>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={this.closeLanguageSelect}>
                            <MenuItem onClick={() => this.selectLanguage('en-US')}>English</MenuItem>
                            <MenuItem onClick={() => this.selectLanguage('nl-NL')}>Nederlands</MenuItem>
                        </Menu>
                    </Grid>
                </Grid>
            </AppBar>
        );
    }
}

export default BlindPoolNavbar;
