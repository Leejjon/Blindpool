/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */
import theme from "./theme/theme";
import { initReactI18next } from "react-i18next";
import { ThemeProvider } from "@mui/material";
import { RemixBrowser } from "@remix-run/react";
import { use } from "i18next";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { getLocale, resources } from "./locales/translations";

use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: getLocale(),
    returnNull: false,
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <ThemeProvider theme={theme}>
        <RemixBrowser />
      </ThemeProvider>
    </StrictMode>
  );
});
