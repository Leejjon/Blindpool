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
    }
});

export default theme;
