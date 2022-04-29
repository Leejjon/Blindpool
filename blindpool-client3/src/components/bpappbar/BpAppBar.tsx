import React, {useState} from "react";
import {AppBar, IconButton, Toolbar} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

const BpAppBar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <AppBar sx={{backgroundColor: "#00cc47"}} position="static">
            <Toolbar>
                <IconButton color="inherit"
                            aria-label="Navigation menu" aria-haspopup="true"
                            onClick={() => setMenuOpen(true)}>
                    <MenuIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default BpAppBar;
