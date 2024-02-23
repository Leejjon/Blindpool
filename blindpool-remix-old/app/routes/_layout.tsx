import { Outlet, useLoaderData } from '@remix-run/react';
import BpAppBar from '../components/bpappbar/BpAppBar';
import {ThemeProvider} from "@mui/material";
import theme from "../theme/theme";
import { TranslationKey, getCountryCode, getTranslator } from '../locales/i18n';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useState } from 'react';
import BpMenu from '~/components/bpmenu/BpMenu';

export async function loader({ request }: LoaderFunctionArgs) {
    const t = getTranslator(getCountryCode(request));
    const CREATE_POOL = t(TranslationKey.CREATE_POOL);
    const HOW_DOES_IT_WORK_TITLE  = t(TranslationKey.HOW_DOES_IT_WORK_TITLE);
    const ABOUT_BLINDPOOL_TITLE  = t(TranslationKey.ABOUT_BLINDPOOL_TITLE);
    const OTHER_APPS = t(TranslationKey.OTHER_APPS);
    const headers = { "Cache-Control": "max-age=86400" }; // This max age is one day. Maybe we want to put it at 15 minutes or something.
    return json({ 
      CREATE_POOL, HOW_DOES_IT_WORK_TITLE, ABOUT_BLINDPOOL_TITLE, OTHER_APPS
    }, {headers});
}

export default function Component() {
    const translations = useLoaderData<typeof loader>();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <BpAppBar menuOpen={menuOpen} setMenuOpen={(menuOpen: boolean) => setMenuOpen(menuOpen)}>
                    {/* Not sure if this component composition is the best option here. 
                    */}
                    <BpMenu closeMenu={() => setMenuOpen(false)} translations={translations} />
                </BpAppBar>
                <Outlet/>
            </ThemeProvider>
        </div>
    );
}