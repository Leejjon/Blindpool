import React, { Component } from 'react';
import './App.css';
import Navbar2 from "./components/BlindpoolNavbar";
import 'typeface-roboto';

import {  MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#00cc47',
            contrastText: '#ffffff',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            light: '#0066ff',
            main: '#ffffff',
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#ffcc00',
        },
        // error: will use the default color
    },
    typography: {
        fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        subtitle2: {
            color: "#ffffff",
        },
        button: {
            textTransform: 'none'
        }
    }
});

class App extends Component {

    render() {
        return (
          <div className="App">
              <MuiThemeProvider theme={theme}>
                <Navbar2 />
              </MuiThemeProvider>
          </div>
        );
    }
}

export default App;
