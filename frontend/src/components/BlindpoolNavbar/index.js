import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Link from 'react-router-dom';

class BlindPoolNavbar extends Component {
    render() {
        return (
            <AppBar color="primary">

                <Typography align="right" variant="body1" color="inherit">
                    <a href="/blabla.html">Language</a>&nbsp;
                </Typography>
            </AppBar>
        );
    }
}

export default BlindPoolNavbar;
