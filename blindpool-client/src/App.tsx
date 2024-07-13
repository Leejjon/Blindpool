import './App.css';
import {HelmetProvider} from "react-helmet-async";
import {Outlet} from "react-router-dom";
import BpDefaultHelmet from "./components/bphelmet/BpDefaultHelmet";
import BpAppBar from "./components/bpappbar/BpAppBar";
import Home from "./views/home/Home";
import About from "./views/about/About";
import CreatePool from "./views/createpool/CreatePool";
import HowTo from "./views/howto/HowTo";
import ViewPool from "./views/viewpool/ViewPool";
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
                {/* <Routes>
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
                </Routes> */}
                <BpSnackbar message={message} setMessage={setMessage} />
            </div>
        </HelmetProvider>
    );
}

export default App;
