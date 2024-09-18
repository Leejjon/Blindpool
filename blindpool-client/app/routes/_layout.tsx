import { useState } from "react";
import { useNewBlindpoolOutletContext } from "../context/BpContext";
import { Outlet } from "@remix-run/react";
import BpAppBar from "../components/bpappbar/BpAppBar";
import '../theme/App.css';

export default function Layout() {
    const [message, setMessage] = useState<string | undefined>(undefined);

    const bpContext = useNewBlindpoolOutletContext(setMessage, message);

    return (
        <div className="App">
            <BpAppBar />
            <Outlet context={bpContext} />
        </div>
    );
}

