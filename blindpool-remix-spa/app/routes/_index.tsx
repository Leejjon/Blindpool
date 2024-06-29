import type { MetaFunction } from "@remix-run/node";
import { useTranslation } from "react-i18next";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix SPA" },
    { name: "description", content: "Welcome to Remix (SPA Mode)!" },
  ];
};

export default function Index() {
  const {t} = useTranslation();
  return (
    <div>
      Test {t('TITLE')} - {t('BLINDPOOL_DEFINITION_TITLE')}
    </div>
  );
}
