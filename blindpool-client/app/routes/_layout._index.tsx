import { Button, Card, CardActions, CardContent, Divider, Grid, Typography } from "@mui/material";
import type { MetaFunction } from "@remix-run/node";
import { useTranslation } from "react-i18next";
import { getLocale, getPageTitle, resources } from "../locales/translations";
import { matchesQuery } from "../queries/MatchesQuery";
import { getCompetitionsFromLocalStorage, updateCompetitionsInLocalStorage } from "../storage/PreferredCompetitions";
import { queryClientSingleton } from "../singletons/QueryClientSingleton";
import { useUpcomingMatches } from "../queries/MatchesHook";
import { Match } from "../model/Match";
import { useExistingBlindpoolOutletContext } from "../context/BpContext";
import { Link } from "@remix-run/react";
import BpSocialMediaLinks from "../components/bpsocialmedialinks/BpSocialMediaLinks";
import BpCompetitions from "../components/bpcompetitions/BpCompetitions";
import BpUpcomingMatches from "../components/bpupcomingmatches/BpUpcomingMatches";

export const meta: MetaFunction = () => {
  return [
    { title: `${getPageTitle(resources[getLocale()].translation.BLINDPOOL_DEFINITION_TITLE)}` },
    { name: "description", content: resources[getLocale()].translation.BLINDPOOL_DEFINITION_DESCRIPTION },
    { tagName: "link", rel: "canonical", href: window.location.hostname.endsWith('blindepool.nl') ? "https://blindepool.nl/" : "https://www.blindpool.com/"}
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
  const { competitionsToWatch, setMessage, setSelectedMatchId } = useExistingBlindpoolOutletContext();
  const { t } = useTranslation();
  const matches: Array<Match> = useUpcomingMatches(competitionsToWatch, setMessage) ?? [];
  return (
    <Grid container justifyContent={"center"} spacing={2}
      sx={{ flexGrow: 1, textAlign: 'center', marginTop: '0.5em' }}>
      {/* The insane style correction makes sure there is no horizontal scrollbar and it's centered on mobile */}
      <Grid key="definition" item>
        <Card className="card">
          <CardContent>
            <Typography variant="h2">
              {t("BLINDPOOL_DEFINITION_TITLE")}
            </Typography>
            <Divider />
            <Typography component="p">
              <br />
              {t("BLINDPOOL_DEFINITION_DESCRIPTION")}
            </Typography>
          </CardContent>
          <CardActions>
            <Link className="firstButton" to="/create">
              <Button size="large" sx={{ color: "rgba(0, 0, 0, 0.87)", fontSize: "medium" }}>{t("CREATE_POOL")}</Button>
            </Link>
            <Link to="/howto" style={{ textDecoration: 'none' }}>
              <Button size="large"
                sx={{ color: "rgba(0, 0, 0, 0.87)", fontSize: "medium" }}>{t("HOW_DOES_IT_WORK_TITLE")}</Button>
            </Link>
          </CardActions>
        </Card>
        <Card className="card" sx={{ marginTop: "1.5em" }}>
          <CardContent>
            <Typography variant="h2">
              {t("COMPETITIONS_TITLE")}
            </Typography>
            <Divider />
            <BpCompetitions />
          </CardContent>
        </Card>
      </Grid>
      <Grid key="matchers" item sx={{ marginBottom: "0.3em" }}>
        <Card className="card">
          <CardContent>
            <Typography variant="h2">{t('UPCOMING_MATCHES')}</Typography>
            <Divider />
            {/* Try to avoid passing these properties and use composition here. */}
            <Typography component="p" style={{ marginBottom: '0.5em' }}><br />{matches.length > 0 ? t('CLICK_ON_MATCH') : ""}</Typography>
            <BpUpcomingMatches matches={matches} setSelectedMatchId={setSelectedMatchId} />
          </CardContent>
        </Card>
      </Grid>
      <BpSocialMediaLinks />
    </Grid>
  );
}
