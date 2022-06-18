import React, {useState} from 'react';
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

export interface BpSnackbarMessage {
    message: string | undefined
    setMessage: (message: string | undefined) => void
}

function App() {
    const {t} = useTranslation();
    const [message, setMessage] = useState<string | undefined>(undefined);

    // const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    //     if (reason === 'clickaway') {
    //         return;
    //     }
    //     setMessage(undefined);
    // };

    return (
        <HelmetProvider>
            <BrowserRouter>
                <div className="App">
                    <BpHelmet/>
                    <BpAppBar/>
                    <Routes>
                        <Route path="/" element={<Home message={message} setMessage={(message) => setMessage(message)}/>} />
                        <Route path="/about" element={<About/>}/>
                        <Route path="/create" element={<CreatePool message={message} setMessage={(message) => setMessage(message)}/>} />
                        <Route path="/howto" element={<HowTo/>}/>
                        <Route path="/pool/:key" element={<ViewPool/>}/>
                    </Routes>
                </div>
            </BrowserRouter>
        </HelmetProvider>
    );
}

export default App;
