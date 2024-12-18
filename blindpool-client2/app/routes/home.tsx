import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  return (
    <>
      <Button>{t("CREATE_POOL")}</Button>
    </>
  );
}
