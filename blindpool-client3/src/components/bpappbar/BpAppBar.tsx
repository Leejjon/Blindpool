import React, {useState} from "react";
import {AppBar, IconButton, SwipeableDrawer, Toolbar, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import BpMenu from "../bpmenu/BpMenu";
import {Link} from "react-router-dom";
import StyledBpLogoFn from "../bplogo/BpLogo";

const BpAppBar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar sx={{
                // margin: 0, padding: 0
            }}>
                <IconButton sx={{marginLeft: '-0.4em'}}
                            color="inherit"
                            aria-label="Navigation menu" aria-haspopup="true"
                            onClick={() => setMenuOpen(true)}>
                    <MenuIcon />
                </IconButton>
                <SwipeableDrawer open={menuOpen}
                                 onClose={() => setMenuOpen(false)}
                                 onOpen={() => setMenuOpen(true)}>
                    <BpMenu closeMenu={() => setMenuOpen(false)}/>
                </SwipeableDrawer>
                <Typography component={Link} to="/" sx={{
                    flexGrow: 1, fontWeight: 500,
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                    letterSpacing: "0.0075em"
                }} variant="h1" color="inherit">
                    <StyledBpLogoFn/>
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default BpAppBar;
