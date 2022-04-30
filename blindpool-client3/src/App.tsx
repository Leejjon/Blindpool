import React from 'react';
import './App.css';
import BpAppBar from "./components/bpappbar/BpAppBar";
import {BrowserRouter, Route} from "react-router-dom";
import BpHelmet from "./components/bphelmet/BpDefaultHelmet";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <BpHelmet/>
                <BpAppBar/>
            </div>
        </BrowserRouter>
    );
}

export default App;
