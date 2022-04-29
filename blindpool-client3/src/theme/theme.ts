
import { createTheme } from '@mui/material/styles';


export interface CustomTheme {
    bg: {
        main: string,
        light: string
    },
    text: {
        main: string,
        light: string
    }
}

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
        }
    }
});

export default theme;
