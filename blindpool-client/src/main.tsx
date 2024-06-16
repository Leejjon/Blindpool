import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import theme from "./theme/theme";
import './locales/i18n';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ThemeProvider} from "@mui/material";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <App/>
            </QueryClientProvider>
        </ThemeProvider>
    </React.StrictMode>,
);
