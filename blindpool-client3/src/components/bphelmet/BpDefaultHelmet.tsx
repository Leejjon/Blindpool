import React from "react";
import { useLocation } from "react-router-dom";
import {Helmet} from "react-helmet";

const BpDefaultHelmet: React.FC = () => {
    let location = useLocation();
    const locale = window.location.hostname.endsWith("blindepool.nl") ? 'en' : 'nl';
    const hostname = window.location.hostname.endsWith("blindepool.nl") ? 'https://blindpool.com' : 'https://blindepool.nl';

    return (
        <Helmet>
            <meta charSet="utf-8"/>
            <link rel="alternate" href={hostname + location.pathname} hrefLang={locale} />
        </Helmet>
    );
};

export default BpDefaultHelmet;
