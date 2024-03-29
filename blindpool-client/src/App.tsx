import React, {useEffect, useState} from 'react';
import './App.css';
import BpAppBar from "./components/bpappbar/BpAppBar";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import BpHelmet from "./components/bphelmet/BpDefaultHelmet";
import Home from "./views/home/Home";
import {useTranslation} from "react-i18next";
import {HelmetProvider} from "react-helmet-async";
import About from "./views/about/About";
import HowTo from "./views/howto/HowTo";
import CreatePool from "./views/createpool/CreatePool";
import ViewPool from "./views/viewpool/ViewPool";
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
    setCompetitionsToWatch?: (competitions: Array<number>) => void;
}

export interface BpSelectedMatchProps {
    selectedMatchId?: string;
    setSelectedMatchId: (matchId: string | undefined) => void;
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

function App() {
    const {t} = useTranslation();
    const [message, setMessage] = useState<string | undefined>(undefined);
    const [competitionsToWatch, setCompetitionsToWatch] = useState<Array<number>>(getCompetitionsFromLocalStorage());
    const [selectedMatchId, setSelectedMatchId] = useState<string>();

    useEffect(() => {
        updateCompetitionsInLocalStorage(competitionsToWatch);
    }, [competitionsToWatch, setCompetitionsToWatch]);

    const handleClose = (event: any, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setMessage(undefined);
    };

    return (
        <HelmetProvider>
            <BrowserRouter>
                <div className="App">
                    <BpHelmet/>
                    <BpAppBar/>
                    <Routes>
                        <Route path="/" element={
                            <Home setMessage={setMessage} competitionsToWatch={competitionsToWatch} setCompetitionsToWatch={(competitions) => setCompetitionsToWatch(competitions)}
                                  setSelectedMatchId={setSelectedMatchId} />
                        } />
                        <Route path="/about" element={<About/>}/>
                        <Route path="/create" element={
                            <CreatePool competitionsToWatch={competitionsToWatch} setMessage={(message) => setMessage(message)}
                                        selectedMatchId={selectedMatchId} setSelectedMatchId={setSelectedMatchId} />}
                        />
                        <Route path="/howto" element={<HowTo/>}/>
                        <Route path="/pool/:key" element={<ViewPool/>}/>
                    </Routes>
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
                </div>
            </BrowserRouter>
        </HelmetProvider>
    );
}

export default App;
