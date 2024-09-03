import { Button } from "@mui/material";
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
     No fucking tailwind.
     <Button variant="outlined">{t('ABOUT_BLINDPOOL_TITLE')}</Button>
    </div>
  );
}
