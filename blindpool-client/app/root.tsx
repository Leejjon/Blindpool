import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientSingleton } from "./singletons/QueryClientSingleton";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <Meta/>
        <Links/>
    </head>
    <body>
    {children}
    <ScrollRestoration/>
    <Scripts/>
    </body>
    </html>
  );
}

export default function App() {
    return (
        <QueryClientProvider client={queryClientSingleton}>
        <Outlet />
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export function HydrateFallback() {
  return <p>Loading...</p>;
}
