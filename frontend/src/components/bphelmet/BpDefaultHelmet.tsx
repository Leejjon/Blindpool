import React from "react";
import { withRouter } from "react-router-dom";
import Helmet from "react-helmet";
import {RouteComponentProps} from "react-router";

const BpDefaultHelmet: React.FC<RouteComponentProps<any>> = (props) => {

    // TODO: Simply put the url in the translation
    const locale = window.location.hostname === "www.blindepool.nl" ||
    window.location.hostname === "blindepool.nl" ? 'en' : 'nl';
    const hostname = window.location.hostname === "www.blindepool.nl" ||
    window.location.hostname === "blindepool.nl" ? 'http://blindpool.com' : 'https://blindepool.nl';

    return (
        <Helmet>
            <meta charSet="utf-8"/>
            <link rel="alternate" href={hostname + props.location.pathname} hrefLang={locale}  />
        </Helmet>
    );
};

export default withRouter(props => <BpDefaultHelmet {...props} />);
