import React from 'react';
import './App.css';
import BpAppBar from "./components/bpappbar/BpAppBar";
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {BrowserRouter, Route} from "react-router-dom";
import Home from "./views/home/Home";
import HowTo from "./views/howto/HowTo";
import CreatePool from "./views/createpool/CreatePool";
import ViewPool from "./views/viewpool/ViewPool";

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
        background: {
            paper: '#fafafa',
            /**/
            default: '#d6d6d6',
        }
    },

    // This is only overriden for the copy textfield in viewpool. Need to find a way to only apply it there. But JavaScript API's are so hard to use :/
    overrides: {
        MuiFormLabel: {
            root: {
                color: 'black',
                fontWeight: 'bold',
                '&$focused': {
                    color: 'black',
                    fontWeight: 'bold'
                },
            }
        },

        MuiOutlinedInput: {
            root: {
                '&$focused': {
                    color: 'black',
                    // fontWeight: 'bold'
                    borderColor: 'black',
                },
                '&$focused $notchedOutline': {
                    borderColor: 'black',
                },
            },
            notchedOutline: {
                borderColor: 'black'
            }
        },
        MuiTableCell: {
            root: {
                '&:last-child': {
                    paddingRight: '0px'
                }
            }
        }
    },
    typography: {
        fontFamily: "\"Archivo\", \"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
        fontSize: 12,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        h1: {
            fontWeight: 500,
            fontSize: "1.1rem",
            lineHeight: 1.6,
            letterSpacing: "0.0075em"
        },
        h2: {
            fontSize: "1.5rem",
        },
        body1: {
            color: "rgba(0, 0, 0, 0.87)",
            fontFamily: "Archivo, Roboto, Helvetica, Arial, sans-serif",
            fontWeight: 400,
            fontSize: "1rem",
            lineHeight: 1.5
        },

        button: {
            textTransform: 'none'
        }
    },
    mixins: {
        toolbar: {
            paddingLeft: 0,
            paddingRight: '1em'
        }
    }
});

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <div className="App">
                <MuiThemeProvider theme={theme}>
                    <BpAppBar/>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/create" component={CreatePool}/>
                    <Route exact path="/howto" component={HowTo}/>
                    <Route path="/pool/:key" component={ViewPool}/>
                </MuiThemeProvider>
            </div>
        </BrowserRouter>
    );
};

export default App;
