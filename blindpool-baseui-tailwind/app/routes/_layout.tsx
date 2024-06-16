import { Button } from "@mui/base";
import { LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

// Fixed like this: https://github.com/remix-run/remix/issues/4728
// We use archivo regular: https://fonts.google.com/specimen/Archivo
export const links: LinksFunction = () => {
    return [
        {rel: "preconnect", href: "https://fonts.googleapis.com"},
        {rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous"},
        {href: "https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&display=swap", rel: "stylesheet"}
    ];
}

export default function Component() {
    return (
        <div className="font-archivo">
            <Button className="bg-bpgreen">Create Pool</Button>
            <Outlet/>
        </div>
    );
}