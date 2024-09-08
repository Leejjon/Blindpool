import { Button, Grid } from "@mui/material";
import type { MetaFunction } from "@remix-run/node";
import { useTranslation } from "react-i18next";
import { getLocale, getPageTitle, resources } from "../locales/translations";
import { /*ClientLoaderFunctionArgs,*/ json, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: `${getPageTitle(resources[getLocale()].translation.BLINDPOOL_DEFINITION_TITLE)}` },
    { name: "description", content: resources[getLocale()].translation.BLINDPOOL_DEFINITION_DESCRIPTION},
  ];
};

export const clientLoader = async (/*{
  request,
  params,
}: ClientLoaderFunctionArgs */) => {
  // Return the data to expose through useLoaderData()
  return json({data: "hoi"});
};

export default function Index() {
  const {t} = useTranslation();
  const {data} = useLoaderData<typeof clientLoader>();
  return (
    <Grid container justifyContent={"center"} spacing={2}
              sx={{flexGrow: 1, textAlign: 'center', marginTop: '0.5em'}}>
     <Button variant="outlined">{t('ABOUT_BLINDPOOL_TITLE')}</Button>
     {data}
    </Grid>
  );
}
