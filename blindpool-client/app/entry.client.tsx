import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import theme from "./theme/theme";
import { initReactI18next } from "react-i18next";
import { ThemeProvider } from "@mui/material";
import { use } from "i18next";
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
        <HydratedRouter />
      </ThemeProvider>
    </StrictMode>
  );
});
