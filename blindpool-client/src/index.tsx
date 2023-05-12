import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ThemeProvider} from "@mui/material";
import theme from "./theme/theme";
import './locales/i18n';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {getUpcomingMatches} from "./api/GetUpcomingMatches";
import Home from "./views/home/Home";
import About from "./views/about/About";
import CreatePool from "./views/createpool/CreatePool";
import HowTo from "./views/howto/HowTo";
import ViewPool from "./views/viewpool/ViewPool";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Match} from "./model/Match";

const queryClient = new QueryClient();

export const matchesQuery = () => (
    {
        queryKey: ["matches"],
        queryFn: async () => { return await getUpcomingMatches([2021])},
    }
);

const matchesQueryLoader = async (queryClient: QueryClient): Promise<Array<Match>> => {
    return await queryClient.ensureQueryData(matchesQuery());
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                index: true,
                element: <Home />,
                loader: async () => { return matchesQueryLoader(queryClient) }
            },
            {
                path: "/create",
                element: <CreatePool />,
                loader: async () => { return matchesQueryLoader(queryClient) }
            },
            {
                path: "/pool/:key",
                element: <ViewPool />
            },
            {
                path: "/about",
                element: <About />
            },
            {
                path: "/howto",
                element: <HowTo />
            }
        ]
    }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
          </ThemeProvider>
      </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
