import React, { Component } from 'react';
import './App.css';
import Navbar2 from "./components/BlindpoolNavbar";

import {  MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#ff4400',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            light: '#0066ff',
            main: '#0044ff',
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#ffcc00',
        },
        // error: will use the default color
    },
});

// function App() {
//     return (
//         <MuiThemeProvider theme={theme}>
//             <Root />
//         </MuiThemeProvider>
//     );
// }
//
// render(<App />, document.querySelector('#app'));

// /*
//  * These imports make sure the materialize css is imported without me
//  * having to add it manually in the index.html
//  */
// import 'materialize-css';
// import 'materialize-css/dist/css/materialize.min.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // currentTitle: "Pool van Leejjon",
            // showPool: false,
            // currentContent: 'home',
        };
    }


    render() {
        return (
          <div className="App">
              <Navbar2 />

          </div>
        );
    }
}

export default App;
