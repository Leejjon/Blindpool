import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Grid from "@material-ui/core/Grid/Grid";
import Menu from "@material-ui/core/Menu/Menu";
// import LocalizedStrings from 'react-localization';
//
// let resourceBundle = new LocalizedStrings({
//     en: {
//
//     },
//     nl: {
//
//     }
// });

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
    selectEnglish = () => {
        this.setState({ anchorEl: null });
        console.log("Switch to English.");
    };

    selectDutch = () => {
        this.setState({ anchorEl: null });
        console.log("Switch to Dutch.");
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
                            <Typography variant="subtitle2">Language</Typography>
                            <Icon color="secondary">arrow_drop_down</Icon>
                        </Button>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={this.closeLanguageSelect}>
                            <MenuItem onClick={this.selectEnglish}>English</MenuItem>
                            <MenuItem onClick={this.selectDutch}>Nederlands</MenuItem>
                        </Menu>
                    </Grid>
                </Grid>
            </AppBar>
        );
    }
}

export default BlindPoolNavbar;
