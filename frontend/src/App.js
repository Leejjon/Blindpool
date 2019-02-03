import React, {Component} from 'react';
import './App.css';
import BlindpoolNavbar from "./components/BlindpoolNavbar";
import 'typeface-roboto';
import intl from 'react-intl-universal';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import WebFont from 'webfontloader';

WebFont.load({
    google: {
        families: ['Archivo', 'sans-serif']
    }
});

// locale data
const locales = {
    "en-US": require('./locales/en-GB.json'),
    "nl-NL": require('./locales/nl-NL.json'),
};

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
        useNextVariants: true,
        fontFamily: "\"Archivo\", \"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
        fontSize: 12,
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
    state = {initDone: false, currentLang: null}

    constructor(props) {
        super(props);
        this.loadLocales = this.loadLocales.bind(this);
    }

    componentDidMount() {
        this.loadLocales();
        document.title = intl.get('TITLE');
    }

    loadLocales(specificLocale) {
        let currentLocale;

        if (specificLocale) {
            currentLocale = specificLocale;
        } else {
            currentLocale = intl.determineLocale({
                urlLocaleKey: "lang",
                cookieLocaleKey: "lang"
            });
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
            this.setState({initDone: true, currentLang: currentLocale});
        });
    }

    render() {
        return (
            this.state.initDone &&
            <div className="App">
                <MuiThemeProvider theme={theme}>
                    <BlindpoolNavbar setLanguage={this.loadLocales} currentLang={this.state.currentLang} />
                </MuiThemeProvider>
            </div>
        );
    }
}

export default App;
