import './App.css';
import {HelmetProvider} from "react-helmet-async";
import {Outlet} from "react-router-dom";
import BpDefaultHelmet from "./components/bphelmet/BpDefaultHelmet";
import BpAppBar from "./components/bpappbar/BpAppBar";
import BpSnackbar from './components/bpsnackbar/BpSnackbar';
import { useNewBlindpoolOutletContext } from './context/BpContext';
import { useState } from 'react';

function App() {
    const [message, setMessage] = useState<string | undefined>(undefined);

    const bpContext = useNewBlindpoolOutletContext(setMessage, message);

    return (
        <HelmetProvider>
            <div className="App">
                <BpDefaultHelmet/>
                <BpAppBar/>
                <Outlet context={bpContext} />
                <BpSnackbar message={message} setMessage={setMessage} />
            </div>
        </HelmetProvider>
    );
}

export default App;
