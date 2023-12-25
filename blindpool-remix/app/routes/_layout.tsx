import { Outlet } from '@remix-run/react';

export default function Component() {
    return (
        <div className="App">
            <h1>app bar</h1>
            <Outlet/>
        </div>
    );
}