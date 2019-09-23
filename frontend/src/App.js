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
import intl from "react-intl-universal";
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
        },
        // Disabled will have the default color.
        // text: {
        //     disabled: 'black'
        // }
        // error: will use the default color
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

// locale data
const locales = {
    "en-US": require('./locales/en-GB.json'),
    "nl-NL": require('./locales/nl-NL.json'),
};

class App extends Component {
    constructor(props) {
        super(props);
        this.loadLocales = this.loadLocales.bind(this);
        this.state = {
            doneLoadingLanguage: false,
            currentLang: null,
        };
    }

    componentDidMount() {
        this.loadLocales();
    }

    loadLocales(specificLocale) {
        let currentLocale;

        if (specificLocale) {
            currentLocale = specificLocale;
        } else {
            const language = window.navigator.language;

            if (language === "nl" || language === "nl-BE") {
                currentLocale = "nl-NL";
            } else {
                currentLocale = "en-US";
            }
        }

        // init method will load CLDR locale data according to currentLocale
        // react-intl-universal is singleton, so you should init it only once in your app
        intl.init({
            currentLocale: currentLocale,
            locales,
            commonLocaleDataUrls: {
                en: "./locales/en.js",
                nl: "./locales/nl.js",
            }
        }).then(() => {
            // After loading CLDR locale data, start to render
            this.setState({doneLoadingLanguage: true, currentLang: currentLocale});
        });
    }

    render() {
        return (
            this.state.doneLoadingLanguage &&
            <BrowserRouter>
                <div className="App">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>{intl.get('TITLE')} - {intl.get('BLINDPOOL_DEFINITION_TITLE')}</title>
                        <meta name="description" content={intl.get('BLINDPOOL_DEFINITION')} />
                    </Helmet>
                    <MuiThemeProvider theme={theme}>
                        <BpAppBar
                            setLanguage={this.loadLocales}
                            currentLang={this.state.currentLang}/>
                        <UpdateDialog />
                        <Route exact path="/" component={ViewHome}/>
                        <Route exact path="/create" component={ViewCreatePool}/>
                        <Route exact path="/howto" component={ViewWhatIs}/>
                        <Route path="/pool/:key" component={ViewPool} />
                    </MuiThemeProvider>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
