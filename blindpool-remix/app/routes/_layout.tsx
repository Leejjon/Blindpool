import { Outlet } from '@remix-run/react';
import BpAppBar from '../components/bpappbar/BpAppBar';
import {ThemeProvider} from "@mui/material";
import theme from "../theme/theme";

export default function Component() {
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <BpAppBar/>
                <Outlet/>
            </ThemeProvider>
        </div>
    );
}