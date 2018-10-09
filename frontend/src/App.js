import React, { Component } from 'react';
import Header from './components/Header'
import './App.css';
import Navbar2 from "./components/BlindpoolNavbar";

/*
 * These imports make sure the materialize css is imported without me
 * having to add it manually in the index.html
 */
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // currentTitle: "Pool van Leejjon",
            // showPool: false,
            // currentContent: 'home',
        };
    }

    render() {
        return (
          <div className="App">
              <Navbar2 />

          </div>
        );
    }
}

export default App;
