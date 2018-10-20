import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

class BlindPoolNavbar extends Component {
    render() {
        return (
            <AppBar color="primary">
                <Typography align="right" variant="h6" color="inherit">
                    Language&nbsp;
                </Typography>
            </AppBar>
        );
    }
}

export default BlindPoolNavbar;
