import React, {Component} from 'react';
import './App.css';
import 'typeface-roboto';

import BpAppBar from "./components/bpappbar";
import ViewCreatePool from "./views/createpool";
import ViewWhatIs from "./views/howto";
import ViewHome from "./views/home";
import ViewPool from "./views/viewpool";

import {BrowserRouter, Route} from "react-router-dom";
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Helmet from "react-helmet/es/Helmet";

import UpdateDialog from "./components/bpupdatedialog/UpdateDialog";

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
        useNextVariants: true,
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

class App extends Component {

    getAlternateLink() {
        if (window.location.hostname === "www.blindepool.nl" ||
            window.location.hostname === "blindepool.nl") {
            return <link rel="alternate" hrefLang="en" href="http://www.blindpool.com/"/>
        } else {
            return <link rel="alternate" hrefLang="nl" href="http://blindepool.nl/"/>
        }
    }

    render() {
        const { t } = this.props;
        return (
            <BrowserRouter>
                <div className="App">
                    <Helmet>
                        <meta charSet="utf-8"/>
                        <title>{t('TITLE') + " - " + t('BLINDPOOL_DEFINITION_TITLE')}</title>
                        <meta name="description" content={t('BLINDPOOL_DEFINITION_DESCRIPTION')} />
                        <meta property="og:title" content={t('TITLE') + " - " + t('BLINDPOOL_DEFINITION_TITLE')}/>
                        <meta property="og:description" content={t('BLINDPOOL_DEFINITION_DESCRIPTION')}/>
                        {this.getAlternateLink()}
                    </Helmet>
                    <MuiThemeProvider theme={theme}>
                        <BpAppBar/>
                        <UpdateDialog/>
                        <Route exact path="/" component={ViewHome}/>
                        <Route exact path="/create" component={ViewCreatePool}/>
                        <Route exact path="/howto" component={ViewWhatIs}/>
                        <Route path="/pool/:key" component={ViewPool}/>
                    </MuiThemeProvider>
                </div>
            </BrowserRouter>
        );
    }
}

export default withTranslation()(App);
