import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Link from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

class BlindPoolNavbar extends Component {
    render() {
        return (
            <AppBar color="primary">
                <Button>
                    <Typography variant="subtitle2">Language</Typography>
                    <Icon color="secondary">arrow_drop_down</Icon>
                </Button>
            </AppBar>
        );
    }
}

export default BlindPoolNavbar;
