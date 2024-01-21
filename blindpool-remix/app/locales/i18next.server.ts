import i18n from "./i18n";
import { RemixI18Next } from "remix-i18next";

export async function getTranslationFunctionBasedOnHost(request: Request) {
    // if (process.env.NODE_ENV === 'development') {
    //     request.headers.set("X-Appengine-Country", "NL");
    //   }
    //   const countryCode = request.headers.get("X-Appengine-Country")!;
    const host = request.headers.get("Host");
    const countryCode = host && host.endsWith("blindepool.nl") ? "nl" : "en";
    return await i18next.getFixedT(countryCode);
}

const i18next = new RemixI18Next({
    detection: {
        supportedLanguages: i18n.supportedLngs,
        fallbackLanguage: i18n.fallbackLng,
    },
    i18next: {
        ...i18n
    }
});
  
export default i18next;