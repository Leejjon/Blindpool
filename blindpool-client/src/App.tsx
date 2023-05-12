import React, {createContext, useContext, useEffect, useState} from 'react';
import './App.css';
import BpAppBar from "./components/bpappbar/BpAppBar";
import {Route, Routes, Outlet} from "react-router-dom";
import BpHelmet from "./components/bphelmet/BpDefaultHelmet";
import {useTranslation} from "react-i18next";
import {HelmetProvider} from "react-helmet-async";
import {Alert, Snackbar, Typography} from "@mui/material";
import {Match} from "./model/Match";
import {defaultCompetitions} from "./locales/i18n";

export interface BpSnackbarMessageProps {
    setMessage: (message: string | undefined) => void;
}

export interface BpMatchesProps {
    matches: Array<Match>;
}

export interface BpCompetitionProps {
    competitionsToWatch: Array<number>;
    setCompetitionsToWatch: (competitions: Array<number>) => void;
}

const localStorageName = "competitions";

function updateCompetitionsInLocalStorage(competitions: Array<number>) {
    const localCompetitions = localStorage.getItem("competitions");
    const competitionsStringified = JSON.stringify(competitions);
    if (JSON.stringify(competitions) === JSON.stringify(defaultCompetitions)) {
        localStorage.removeItem(localStorageName)
    } else if (localCompetitions !== competitionsStringified) {
        localStorage.setItem(localStorageName, competitionsStringified);
    }
}

function getCompetitionsFromLocalStorage(): Array<number> {
    const localCompetitions = localStorage.getItem(localStorageName);
    if (localCompetitions) {
        return JSON.parse(localCompetitions);
    } else {
        return defaultCompetitions;
    }
}

export interface CompetitionsAndMessagesContextType {
    competitions: Array<number>;
    setCompetitions: (competitions: Array<number>) => void;
    setMessage: (message: string) => void;
}

export const CompetitionsAndMessagesContext = createContext<CompetitionsAndMessagesContextType>({
    competitions: getCompetitionsFromLocalStorage(),
    setCompetitions: (competitions: Array<number>) => {},
    setMessage: (message: string) => {}
});

export const useCompetitionsAndMessagesContext = () => useContext(CompetitionsAndMessagesContext);

function App() {
    const {t} = useTranslation();
    const [message, setMessage] = useState<string | undefined>(undefined);
    const [competitionsToWatch, setCompetitionsToWatch] = useState<Array<number>>(getCompetitionsFromLocalStorage);


    const handleClose = (event: any, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setMessage(undefined);
    };

    return (
        <div className="App">
            <HelmetProvider>
                <BpHelmet/>
                <BpAppBar/>

                <CompetitionsAndMessagesContext.Provider value={{ competitions: competitionsToWatch, setCompetitions: setCompetitionsToWatch, setMessage}}>
                    <Outlet />
                </CompetitionsAndMessagesContext.Provider>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={message !== undefined}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    message={message}>
                    <Alert elevation={1} variant="filled" severity="warning" className="warningAlert">
                        <Typography variant="body1" component="p"
                                    sx={{color: "white"}}>{message !== undefined ? t(message) : null}</Typography>
                    </Alert>
                </Snackbar>
            </HelmetProvider>
        </div>
    );
}

export default App;
