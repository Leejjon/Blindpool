import { LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const links: LinksFunction = () => {
    return [
        {rel: "preconnect", href: "https://fonts.googleapis.com"},
        {rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: true},
        {href: "https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&display=swap", rel: "stylesheet"}
    ];
}

export default function Component() {
    return (
        <div className="App">
            <Outlet/>
        </div>
    );
}