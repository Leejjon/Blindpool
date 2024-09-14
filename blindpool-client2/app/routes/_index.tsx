import { Button, Grid } from "@mui/material";
import type { MetaFunction } from "@remix-run/node";
import { useTranslation } from "react-i18next";
import { getLocale, getPageTitle, resources } from "../locales/translations";
import { useQuery } from "@tanstack/react-query";
import { matchesQuery } from "../queries/MatchesQuery";
import { getCompetitionsFromLocalStorage, updateCompetitionsInLocalStorage } from "../storage/PreferredCompetitions";
import { useEffect, useState } from "react";
import { queryClientSingleton } from "../singletons/QueryClientSingleton";

export const meta: MetaFunction = () => {
  return [
    { title: `${getPageTitle(resources[getLocale()].translation.BLINDPOOL_DEFINITION_TITLE)}` },
    { name: "description", content: resources[getLocale()].translation.BLINDPOOL_DEFINITION_DESCRIPTION },
  ];
};

export const clientLoader = async () => {
  await queryClientSingleton.prefetchQuery(
    matchesQuery(getCompetitionsFromLocalStorage())
  );
  return null;
};

// DO THIS https://tanstack.com/query/latest/docs/framework/react/guides/ssr#get-started-fast-with-initialdata

export default function Index() {
  const { t } = useTranslation();
  const [competitionsToWatch, setCompetitionsToWatch] = useState<Array<number>>(getCompetitionsFromLocalStorage());

  useEffect(() => {
    updateCompetitionsInLocalStorage(competitionsToWatch);
  }, [competitionsToWatch, setCompetitionsToWatch]);

  const { data, isLoading } = useQuery({
    ...matchesQuery(competitionsToWatch)
  });

  if (isLoading) {
    return (<>Loading</>);
  } else {
    return (
      <Grid container justifyContent={"center"} spacing={2}
        sx={{ flexGrow: 1, textAlign: 'center', marginTop: '0.5em' }}>
        <Button variant="outlined">{t('ABOUT_BLINDPOOL_TITLE')}</Button>
        {JSON.stringify(data)}
      </Grid>
    );
  }
}
