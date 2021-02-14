import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './locales/i18n';
// import {Config} from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById('root'));

// const config: Config = {
//     onUpdate: (registration) => {
//         if (registration && registration.waiting) {
//             registration.waiting.postMessage({ type: 'SKIP_WAITING' });
//             window.location.reload();
//         }
//     },
// };

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
// serviceWorker.register(config);
