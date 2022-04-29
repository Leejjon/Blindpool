import React from 'react';
import './App.css';
import BpAppBar from "./components/bpappbar/BpAppBar";
import {BrowserRouter, Route} from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <header className="App-header">
                    <BpAppBar/>
                </header>
            </div>
        </BrowserRouter>
    );
}

export default App;
