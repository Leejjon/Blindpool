import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button, Card, CardActions, CardContent, Divider, Grid, Typography } from "@mui/material";
import { getCountryCode, getTranslator, TranslationKey } from "../locales/i18n";

export async function loader({ request }: LoaderFunctionArgs) {
  const t = getTranslator(getCountryCode(request));
  const TITLE = t(TranslationKey.TITLE);
  const COMPETITIONS_TITLE = t(TranslationKey.COMPETITIONS_TITLE);
  const CREATE_POOL = t(TranslationKey.CREATE_POOL);
  const HOW_DOES_IT_WORK_TITLE = t(TranslationKey.HOW_DOES_IT_WORK_TITLE);
  const BLINDPOOL_DEFINITION_TITLE = t(TranslationKey.BLINDPOOL_DEFINITION_TITLE);
  const BLINDPOOL_DEFINITION_DESCRIPTION = t(TranslationKey.BLINDPOOL_DEFINITION_DESCRIPTION);
  const UPCOMING_MATCHES = t(TranslationKey.UPCOMING_MATCHES);
  const headers = { "Cache-Control": "max-age=86400" }; // This max age is one day. Maybe we want to put it at 15 minutes or something.
  return json({ 
    TITLE, COMPETITIONS_TITLE, CREATE_POOL, 
    HOW_DOES_IT_WORK_TITLE, BLINDPOOL_DEFINITION_TITLE, BLINDPOOL_DEFINITION_DESCRIPTION, UPCOMING_MATCHES
  }, {headers});
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  if (data) {
    const { TITLE, BLINDPOOL_DEFINITION_TITLE, BLINDPOOL_DEFINITION_DESCRIPTION } = data;
    return [
      { title: TITLE + " - " + BLINDPOOL_DEFINITION_TITLE },
      { name: "description", content: BLINDPOOL_DEFINITION_DESCRIPTION },
      { property: "og:title", content: TITLE + " - " + BLINDPOOL_DEFINITION_TITLE},
      { property: "og:description", content: BLINDPOOL_DEFINITION_DESCRIPTION}
    ];
  } else {
    return [
      { title: "Couldn't load translations."}
    ]
  }
};

export default function Index() {
  const { 
    COMPETITIONS_TITLE,
    CREATE_POOL,
    HOW_DOES_IT_WORK_TITLE,
    BLINDPOOL_DEFINITION_TITLE, 
    BLINDPOOL_DEFINITION_DESCRIPTION,
    UPCOMING_MATCHES
  } = useLoaderData<typeof loader>();

  return (
    <Grid container justifyContent={"center"} spacing={2}
              sx={{flexGrow: 1, textAlign: 'center', marginTop: '0.5em'}}>
            {/* The insane style correction makes sure there is no horizontal scrollbar and it's centered on mobile */}
            <Grid key="definition" item>
                <Card className="card">
                    <CardContent>
                        <Typography variant="h2">
                            {BLINDPOOL_DEFINITION_TITLE}
                        </Typography>
                        <Divider />
                        <Typography component="p">
                            <br/>
                            {BLINDPOOL_DEFINITION_DESCRIPTION}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Link className="firstButton" to="/create">
                            <Button size="large" sx={{color: "rgba(0, 0, 0, 0.87)", fontSize: "medium"}}>{CREATE_POOL}</Button>
                        </Link>
                        <Link to="/howto" style={{textDecoration: 'none'}}>
                            <Button size="large"
                                    sx={{color: "rgba(0, 0, 0, 0.87)", fontSize: "medium"}}>{HOW_DOES_IT_WORK_TITLE}</Button>
                        </Link>
                    </CardActions>
                </Card>
                <Card className="card" sx={{marginTop: "1.5em"}}>
                    <CardContent>
                        <Typography variant="h2">
                            {COMPETITIONS_TITLE}
                        </Typography>
                        <Divider />
                        {/* <BpCompetitions competitionsToWatch={competitionsToWatch} setCompetitionsToWatch={setCompetitionsToWatch}/> */}
                    </CardContent>
                </Card>
            </Grid>
            <Grid key="matchers" item sx={{marginBottom: "0.3em"}}>
                <Card className="card">
                    <CardContent>
                        <Typography variant="h2">{UPCOMING_MATCHES}</Typography>
                        <Divider />
                        {/* Try to avoid passing these properties and use composition here. */}
                        {/* <Typography component="p" style={{marginBottom: '0.5em'}}><br/>{matches.length > 0 ? t('CLICK_ON_MATCH') : ""}</Typography> */}
                        {/* <BpUpcomingMatches matches={matches} setSelectedMatchId={setSelectedMatchId}/> */}
                    </CardContent>
                </Card>
            </Grid>
            {/* <BpSocialMediaLinks/> */}
        </Grid>
  );
}
