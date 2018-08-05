import React, { Component } from 'react';
import Header from './components/Header'
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentTitle: "Pool van Leejjon",
            showPool: false,
            currentContent: 'home',
        };
    }


    currentContent() {
      switch (this.state.currentContent) {
        case 'home':
          return <Header title="Home"/>
          break;
        case 'info':
          return <Header title="Info"/>
          break;
      }
    }
    showPage(page) {
      this.setState({currentContent: page});
    }

    render() {
        return (
          <div className="App">
              <header className="App-header">
                <h1 className="App-title">{this.state.currentTitle}</h1>
              </header>
              <p className="App-intro">
                  To get started, edit <code>src/App.js</code> and save to reload.
              </p>
              <button onClick={this.showPage.bind(this, 'home')}>Home</button>
              <button onClick={this.showPage.bind(this, 'details')}>Details</button>
              <button onClick={this.showPage.bind(this, 'info')}>Info</button>
              {this.currentContent()}
          </div>
        );
    }
}

export default App;
