import { createTheme } from '@mui/material/styles';

// I copied this solution from:
// https://medium.com/@abdurakhimov.sardor/how-to-use-and-customize-material-ui-version-5-with-styled-components-295e62562e61

const theme = createTheme({
    bg: {
        main: '#fff',
        light: '#F4F5F7'
    },
    text: {
        main: '#172B4D',
        light: '#262930'
    },
    palette: {
        primary: {
            main: '#00cc47',
            contrastText: '#ffffff',
        },
        background: {
            paper: '#fafafa',
            default: '#d6d6d6',
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
    components: {
        MuiDivider: {
            styleOverrides: {
                root: {
                    marginTop: "0.5em"
                }
            }
        }
    }
    // So the docs mention the code below but it doesn't work.
    // components: {
    //     MuiToolbar: {
    //         styleOverrides: {
    //             root: {
    //                 paddingLeft: '0px',
    //                 paddingRight: '0px'
    //             }
    //         }
    //     }
    // }
});

export default theme;
