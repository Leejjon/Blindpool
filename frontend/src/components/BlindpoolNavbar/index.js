import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Link from 'react-router-dom';
import Button from '@material-ui/core/Button';

class BlindPoolNavbar extends Component {
    render() {
        return (
            <AppBar color="primary">
                <Button>
                    <Typography variant="subtitle2">Language</Typography>
                </Button>
            </AppBar>
        );
    }
}

export default BlindPoolNavbar;
