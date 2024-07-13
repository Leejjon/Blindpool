import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import theme from "./theme/theme";
import './locales/i18n';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './views/home/Home';
import About from './views/about/About';
import CreatePool from './views/createpool/CreatePool';
import HowTo from './views/howto/HowTo';
import ViewPool from './views/viewpool/ViewPool';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "/about",
                element: <About />
            },
            {
                path: "/create",
                element: <CreatePool />
            },
            {
                path: "/howto",
                element: <HowTo />
            },
            {
                path: "/pool/:key",
                element: <ViewPool />
            }
        ]
    }
]);

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </ThemeProvider>
    </React.StrictMode>,
);
