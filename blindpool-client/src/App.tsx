import './App.css';
import {HelmetProvider} from "react-helmet-async";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import React, {useEffect, useState} from "react";
import BpDefaultHelmet from "./components/bphelmet/BpDefaultHelmet";
import BpAppBar from "./components/bpappbar/BpAppBar";
import {Alert, Snackbar, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {defaultCompetitions} from "./locales/i18n";
import {Match} from "./model/Match";
import Home from "./views/home/Home";
import About from "./views/about/About";
import CreatePool from "./views/createpool/CreatePool";
import HowTo from "./views/howto/HowTo";
import ViewPool from "./views/viewpool/ViewPool";

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
        const localCompetitionsObject: Array<number> = JSON.parse(localCompetitions);
        if (localCompetitionsObject.includes(2018)) {
            return localCompetitionsObject;
        } else {
            localCompetitionsObject.push(2018);
            return localCompetitionsObject.sort(function(a, b) {
                return a - b;
            });
        }
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
                    <BpDefaultHelmet/>
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
