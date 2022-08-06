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
import {getUpcomingMatches} from "./api/GetUpcomingMatches";
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

function App() {
    const {t} = useTranslation();
    const [message, setMessage] = useState<string | undefined>(undefined);


    const [matches, setMatches] = useState<Array<Match>>([]);
    const [competitionsToWatch, setCompetitionsToWatch] = useState<Array<number>>(defaultCompetitions);

    useEffect(() => {
        getUpcomingMatches(setMessage, competitionsToWatch)
            .then((matches) => {
                setMatches(matches);
            }) // Do we need a .catch here? There is already one inside getUpcomingMatches
    }, [competitionsToWatch]);

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
                            <Home matches={matches} competitionsToWatch={competitionsToWatch} setCompetitionsToWatch={(competitions) => setCompetitionsToWatch(competitions)} />
                        } />
                        <Route path="/about" element={<About/>}/>
                        <Route path="/create" element={
                            <CreatePool setMessage={(message) => setMessage(message)} matches={matches}/>}
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
