import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Link from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Grid from "@material-ui/core/Grid/Grid";

class BlindPoolNavbar extends Component {
    render() {
        return (
            <AppBar color="primary">
                {/* I suppose you put stuff in grids and then give grids positions instead of positioning separate buttons. Makes sense I guess. */}
                <Grid
                    justify="flex-end"
                    container
                    spacing={24}>
                    <Grid item>
                        <Button>
                            <Typography variant="subtitle2">Language</Typography>
                            <Icon color="secondary">arrow_drop_down</Icon>
                        </Button>
                    </Grid>
                </Grid>
            </AppBar>
        );
    }
}

export default BlindPoolNavbar;
