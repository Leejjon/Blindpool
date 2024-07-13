import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import theme from "./theme/theme";
import './locales/i18n';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Home from './views/home/Home';
import About from './views/about/About';
import CreatePool from './views/createpool/CreatePool';
import HowTo from './views/howto/HowTo';
import ViewPool from './views/viewpool/ViewPool';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route index={true} element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/create" element={<CreatePool />} />
            <Route path="/howto" element={<HowTo />} />
            <Route path="/pool/:key" element={<ViewPool />} />
        </Route>
    )
);

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </ThemeProvider>
    </React.StrictMode>,
);
